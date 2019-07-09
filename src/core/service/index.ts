import { ConsumeMessage, Message, Options, Replies } from 'amqplib'
import BaseService from './base'
import Consume = Replies.Consume
import Publish = Options.Publish

export interface AmqpService extends BaseService {
  sendMessage(exchangeName: string, routingKey: string, message: string, options: Publish): Promise<any>

  subscribe(queueName: string, handler: (msg: ConsumeMessage | null) => any, options?: Consume | undefined): Promise<Consume>

  ackMessage(queueName: string, ackMessage: Message): void

  nackMessage(queueName: string, message: Message, requeue?: boolean): void
}
