import type amqplib from 'amqplib'
import { Readable } from 'node:stream'
import type { ReadableStream } from 'node:stream/web'

import { storageClient } from '../storageClient'

export async function handleGitHubGraderUploadedMessage(this: amqplib.Channel, message: amqplib.ConsumeMessage | null) {
  if (!message) {
    console.log('Consumer cancelled by server')
    return
  }

  const jsonString = message.content.toString()
  const { repositoryFullName, zipDownloadUrl } = JSON.parse(jsonString)

  const downloadResponse = await fetch(zipDownloadUrl)
  if (!downloadResponse.ok) {
    console.error('Failed to download zip file')
    return this.reject(message, false)
  }

  if (!downloadResponse.body) {
    console.error('No body in response')
    return this.reject(message, false)
  }

  const readableBody = Readable.fromWeb(downloadResponse.body as ReadableStream)

  try {
    await storageClient.putObject(
      process.env.BUCKET_NAME_GRADERS as string,
      `${repositoryFullName}.zip`,
      readableBody,
      readableBody.readableLength,
      { 'Content-Type': 'application/zip' },
    )
    this.ack(message)
  } catch (error) {
    console.error('Failed to upload to storage', error)
    return this.reject(message, false)
  }
}
