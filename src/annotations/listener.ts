import {controller} from './controller'

export const listener = controller

export const amqp = (queueName: string) => (target: any, handler: string) => {
  target.constructor.handlers.push({queueName, handler})
}
