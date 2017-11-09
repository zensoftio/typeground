import * as c from 'config'
import {amqp, listener} from '../annotations/listener'
import {Ack, DeliveryInfo} from 'amqp'
import {AmqpService} from '../services/index'
import {inject} from '../annotations/di'

@listener
export default class AmqpListener {
  
  protected static handlers: { queueName: string, handler: string }[] = []
  
  private amqpService: AmqpService
  
  @inject('AmqpService')
  setAmqpService(amqpService: AmqpService) {
    this.amqpService = amqpService
  }
  
  postConstruct() {
    (this.constructor as any)['handlers'].forEach(
      (it: any) => this.amqpService.subscribe(it.queueName, (this as any)[it.handler])
    )
  }
  
  // SubscribeCallback
  @amqp(c.get('amqp.consumer.test.queue'))
  test = (message: any, headers: { [key: string]: any }, deliveryInfo: DeliveryInfo, ack: Ack) => {
    console.log(message, headers, deliveryInfo)
    ack.acknowledge(true)
  }
  
}