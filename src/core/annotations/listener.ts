import * as c from 'config'
import { Component } from './di'

export const Listener = Component

export const Amqp = (queueConfigValue: string) => (target: any, handler: string) => {
  if (!c.has(queueConfigValue)) {
    return
  }
  const { queue: queueName, subscriptionOptions } = c.get(queueConfigValue)

  target.constructor.handlers.push({ queueName, handler, subscriptionOptions })
}
