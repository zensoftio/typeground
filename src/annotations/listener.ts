import {controller} from './controller'
import * as c from 'config'

const HANDLER_LISTENER_LIST = Symbol('handler_listener_list')

export const listener = controller

export const amqp = (queueNameConfigValue: string) => (target: any, handler: string) => {
  if (!c.has(queueNameConfigValue)) {
    return
  }
  const queueName = c.get(queueNameConfigValue)

  if (!Reflect.get(target, HANDLER_LISTENER_LIST)) {
    Reflect.set(target, HANDLER_LISTENER_LIST, [])
  }

  const handlerList = Reflect.get(target, HANDLER_LISTENER_LIST)
  handlerList.push({queueName: queueName, handler})
}

export const bind = (instance: any) => {
  (Reflect.get(instance.constructor.prototype, HANDLER_LISTENER_LIST) || [])
    .forEach(
      (it: any) => instance.amqpService.subscribe(it.queueName, (instance as any)[it.handler])
    )
}
