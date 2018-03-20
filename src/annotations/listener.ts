import {Component} from './di'
import * as c from 'config'

const HANDLER_LISTENER_LIST = Symbol('handler_listener_list')

export const Listener = Component

export const Amqp = (queueNameConfigValue: string) => (target: any, handler: string) => {
  if (!c.has(queueNameConfigValue)) {
    return
  }
  const queueName = c.get(queueNameConfigValue)

  if (!Reflect.hasMetadata(HANDLER_LISTENER_LIST, target)) {
    Reflect.defineMetadata(HANDLER_LISTENER_LIST, [], target)
  }

  const handlerList = Reflect.getMetadata(HANDLER_LISTENER_LIST, target)
  handlerList.push({queueName: queueName, handler})
}

export const bind = (instance: any) => {
  Reflect.hasMetadata(HANDLER_LISTENER_LIST, instance) &&
  Reflect.getMetadata(HANDLER_LISTENER_LIST, instance)
         .forEach(
           (it: any) => instance.amqpService.subscribe(it.queueName, (instance as any)[it.handler])
         )
}
