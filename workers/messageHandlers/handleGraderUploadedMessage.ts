import type amqplib from 'amqplib'
import Docker from 'dockerode'
import fs from 'fs'

import { storageClient } from '../storageClient'
import { buildImage } from './buildImage'
import { unzipBuffer } from './unzipBuffer'
import { wrapError } from './utils'

export async function handleGraderUploadedMessage(this: amqplib.Channel, message: amqplib.ConsumeMessage | null) {
  if (!message) {
    console.log('Consumer cancelled by server')
    return
  }

  const jsonString = message.content.toString()
  const messageBody = JSON.parse(jsonString)
  const [bucket, ...filePathParts] = messageBody.Key.split('/')
  const filePath = filePathParts.join('/')
  const fileExtension = filePath.split('.').pop()

  if (fileExtension !== 'zip') {
    console.error('Grader file must be a zip file')
    this.reject(message, false)
    return
  }

  const graderZipReadable = await storageClient.getObject(bucket, filePath)
  console.log(filePath, graderZipReadable.readableLength, 'bytes')

  const buffers = []
  for await (const data of graderZipReadable) {
    buffers.push(data)
  }

  const graderZipBuffer = Buffer.concat(buffers)

  await unzipBuffer(graderZipBuffer, '/tmp/grader_unzipped/')

  const docker = new Docker()
  const filePaths = fs.readdirSync('/tmp/grader_unzipped', { recursive: true }).map((filePath) => filePath.toString())
  const directoryName = filePaths[0].split('/')[0]

  const imageBuildContext: Docker.ImageBuildContext = {
    context: `/tmp/grader_unzipped/${directoryName}/`,
    src: filePaths //
      .map((filePath) => filePath.replace(directoryName, ''))
      .filter(Boolean),
  }
  const imageBuildOptions: Docker.ImageBuildOptions = { t: 'grader' }

  await buildImage(docker, imageBuildContext, imageBuildOptions)

  const containerCreateOptions: Docker.ContainerCreateOptions = { Image: 'grader' }

  await new Promise<void>((resolve, reject) =>
    docker.createContainer(containerCreateOptions, (error, container) => {
      if (error) {
        reject(wrapError(error))
        return
      }

      if (!container) {
        reject(wrapError('No container'))
        return
      }

      container.attach({ stream: true, stdout: true, stderr: true }, (error, stream) => {
        if (error) {
          reject(wrapError(error))
          return
        }

        if (!stream) {
          reject(wrapError('No stream'))
          return
        }

        stream.pipe(process.stdout, { end: true })

        container.start((error, data) => {
          if (error) {
            reject(wrapError(error))
            return
          }

          console.log(typeof data, data)

          resolve()
        })
      })
    }),
  )

  this.ack(message)
}
