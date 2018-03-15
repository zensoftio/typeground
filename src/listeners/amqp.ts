import {amqp, bind, listener} from '../annotations/listener'
import {Ack, DeliveryInfo} from 'amqp'
import {AmqpService} from '../services'
import {inject} from '../annotations/di'

@listener
export default class AmqpListener {

  private amqpService: AmqpService

  @inject('AmqpService')
  setAmqpService(amqpService: AmqpService) {
    this.amqpService = amqpService
  }

  postConstruct() {
    bind(this)
  }

  // SubscribeCallback
  @amqp('amqp.consumer.test.queue')
  test = (message: any, headers: { [key: string]: any }, deliveryInfo: DeliveryInfo, ack: Ack) => {
    console.log(message, headers, deliveryInfo)
    ack.acknowledge(true)
  }

}
