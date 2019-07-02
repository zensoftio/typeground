import { ConsumeMessage } from 'amqplib'
import * as c from 'config'
import { Autowired } from '../core/annotations/di'
import { Amqp, Listener } from '../core/annotations/listener'
import { HttpBadRequestException } from '../core/exceptions/http'
import { AmqpService } from '../services'

@Listener
export default class AmqpListener {

  protected static handlers: { queueName: string, handler: string }[] = []

  private amqpService: AmqpService

  @Autowired('AmqpService')
  setAmqpService(service: AmqpService) {
    this.amqpService = service
  }

  postConstruct() {
    (this.constructor as any)['handlers'].forEach(
      (it: any) => this.amqpService.subscribe(it.queueName,
                                              (...args: any[]) => {
                                                return (this as any)[it.handler](...args)
                                              },
                                              it.subscriptionOptions)
    )
  }

  @Amqp('amqp.consumer.test')
  private listenMessage = async (message: ConsumeMessage | null) => {
    if (!message || !message.content) {
      throw new HttpBadRequestException(`Received message is empty ${message}`)
    }
    try {
      const receivedMessage: any = message.content.toString()
      this.amqpService.ackMessage(c.get('amqp.consumer.test.queue'), message)
      console.log('You got new message:', receivedMessage)

    } catch (e) {
      this.amqpService.nackMessage(c.get('amqp.consumer.test.queue'), message, false)
    }
  }
}
