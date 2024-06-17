import amqp, { type Channel } from 'amqp-connection-manager'

import { handleGitHubGraderUploadedMessage } from './messageHandlers/handleGitHubGraderUploadedMessage'
import { handleGitHubSubmissionUploadedMessage } from './messageHandlers/handleGitHubSubmissionUploadedMessage'
import { handleGraderUploadedMessage } from './messageHandlers/handleGraderUploadedMessage'
import { handleSubmissionUploadedMessage } from './messageHandlers/handleSubmissionUploadedMessage'

const connection = amqp.connect(['amqp://message_queue_user:message_queue_password@localhost:5672'])

const TOPICS = ['uploads.grader', 'uploads.grader.github', 'uploads.submission.github']

export const messageQueueChannel = connection.createChannel({
  json: true,
  setup: async (channel: Channel) => {
    for (const TOPIC of TOPICS) {
      await channel.assertExchange(`${TOPIC}.x`, 'direct', { durable: true })
      await channel.assertExchange(`${TOPIC}.dlx`, 'direct', { durable: true })

      await channel.assertQueue(`${TOPIC}.q`, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': `${TOPIC}.dlx`,
          'x-dead-letter-routing-key': '',
        },
      })
      await channel.assertQueue(`${TOPIC}.dlq`, { durable: true })

      await channel.bindQueue(`${TOPIC}.q`, `${TOPIC}.x`, '')
      await channel.bindQueue(`${TOPIC}.dlq`, `${TOPIC}.dlx`, '')
    }

    await channel.prefetch(1)

    await channel.consume('uploads.grader.q', handleGraderUploadedMessage.bind(channel))
    await channel.consume('uploads.grader.github.q', handleGitHubGraderUploadedMessage.bind(channel))
    await channel.consume('uploads.submission.q', handleSubmissionUploadedMessage.bind(channel))
    await channel.consume('uploads.submission.github.q', handleGitHubSubmissionUploadedMessage.bind(channel))
  },
})
