import amqplib from 'amqplib'
import Docker from 'dockerode'
import fs from 'fs'

import { storageClient } from '../storageClient'
import { unzipBuffer } from './unzipBuffer'

export async function handleSubmissionUploadedMessage(this: amqplib.Channel, message: amqplib.ConsumeMessage | null) {
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
    console.error('Submission file must be a zip file')
    this.reject(message, false)
    return
  }

  const submissionZipReadable = await storageClient.getObject(bucket, filePath)
  console.log(filePath, submissionZipReadable.readableLength, 'bytes')

  const buffers = []
  for await (const data of submissionZipReadable) {
    buffers.push(data)
  }

  const submissionZipBuffer = Buffer.concat(buffers)

  await unzipBuffer(submissionZipBuffer, '/tmp/submission/')

  const filePaths = fs.readdirSync('/tmp/submission/')
  console.log({ filePaths })

  // TODO: build grader and inject submission files
  // TODO: blacklist/filter out certain files from the submission, like Dockerfile
  // and the test file to prevent students from cheating by modifying the grader
}
