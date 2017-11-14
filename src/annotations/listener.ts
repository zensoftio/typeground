import {controller} from './controller'
import * as c from 'config'

export const listener = controller

export const amqp = (queueNameConfigValue: string) => (target: any, handler: string) => {
  if (!c.has(queueNameConfigValue)) {
    return
  }
  const queueName = c.get(queueNameConfigValue)
  target.constructor.handlers.push({queueName: queueName, handler})
}
