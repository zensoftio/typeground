import {Amqp, bind, Listener} from '../core/annotations/listener'
import {Ack, DeliveryInfo} from 'amqp'
import {AmqpService} from '../services'
import {Autowired} from '../core/annotations/di'

@Listener
export default class AmqpListener {

  private amqpService: AmqpService

  @Autowired('AmqpService')
  setAmqpService(amqpService: AmqpService) {
    this.amqpService = amqpService
  }

  postConstruct() {
    bind(this)
  }

  // SubscribeCallback
  @Amqp('amqp.consumer.test.queue')
  test = (message: any, headers: { [key: string]: any }, deliveryInfo: DeliveryInfo, ack: Ack) => {
    console.log(message, headers, deliveryInfo)
    ack.acknowledge(true)
  }

}
