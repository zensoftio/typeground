import { Channel, connect, Connection, ConsumeMessage, Message, Options, Replies } from 'amqplib'
import * as c from 'config'
import { ComponentByName } from '../../core/annotations/di'
import BaseService from '../../core/service/base'
import Injectables from '../../enums/injectables'
import HttpInternalErrorException from '../../exceptions/http-internal-error'
import { AmqpService } from '../index'

import Consume = Replies.Consume
import Publish = Options.Publish
import AssertExchange = Options.AssertExchange
import AssertQueue = Options.AssertQueue

@ComponentByName(Injectables.services.amqp)
export default class DefaultAmqpService extends BaseService implements AmqpService {
  private connection: Connection
  private ready: Promise<Channel[]>
  private exchangeList: Map<string, Channel>
  private queueList: Map<string, Channel>

  constructor() {
    super()
    if (c.has('amqp')) {
      this.init()
    }
  }


  async sendMessage(exchangeName: string, routingKey: string, message: string, options: Publish) {
    return this.ready
               .then(() => {
                 const exchange = this.exchangeList.get(exchangeName)
                 return exchange ? new Promise(
                   () => exchange.publish(
                     exchangeName,
                     routingKey,
                     Buffer.from(message)
                   )) : Promise.reject(`No exchange for name '${exchangeName}'`)
               })
               .catch((err: any) => {
                 console.error(err)
                 return err
               })
  }

  async subscribe(queueName: string, handler: (msg: ConsumeMessage | null) => any, options?: Consume | undefined) {
    return this.ready
               .then(() => {
                 const queue = this.queueList.get(queueName)
                 if (!queue) {
                   throw new Error(`there is no queue for name ${queueName}`)
                 }
                 console.log(`Consumer added for: ${queueName}`)
                 return queue.consume(queueName, handler, options)
               })
               .catch((err: any) => {
                 console.error(`Consumer error: ${err}`)
                 throw err
               })
  }

  public ackMessage(queueName: string, message: Message) {
    const queueChannel = this.queueList.get(queueName)
    if (!queueChannel) {
      throw new HttpInternalErrorException(`No such queue with name ${queueName}`)
    }
    queueChannel.ack(message)
  }

  public nackMessage(queueName: string, message: Message, requeue: boolean = false) {
    const queueChannel = this.queueList.get(queueName)
    if (!queueChannel) {
      throw new HttpInternalErrorException(`No such queue with name ${queueName}`)
    }
    queueChannel.nack(message, false, requeue)
  }

  private async newExchange(exchangeName: string, options: AssertExchange): Promise<Channel> {
    const exchangeChannel = await this.connection.createChannel()
    await exchangeChannel.assertExchange(exchangeName, 'topic', options)
    return exchangeChannel
  }

  private async newQueue(queueName: string, options: AssertQueue): Promise<Channel> {
    const queueChannel = await this.connection.createChannel()
    await queueChannel.assertQueue(queueName, options)
    return queueChannel
  }

  private init() {
    this.exchangeList = new Map()
    this.queueList = new Map()
    if (!c.has('amqp.connection')) {
      throw new HttpInternalErrorException('No configuration for amqp was found!')
    }

    this.ready = new Promise((resolve, reject) => connect(c.get('amqp.connection'))
      .then(async (connection: Connection) => {
        this.connection = connection
        this.connection.on('close', () => {
          console.error('[AMQP] trying to reconnect')
          return setTimeout(() => this.init(), 1000)
        })

        this.connection.on('error', (err: any) => {
          console.error('[AMQP] error', err)
          reject()
        })
        return resolve()
      })
      .catch(reject))
      .then(() => this.setupExchanges())
      .then(() => this.setupQueues())
      .catch((err) => {
        console.error('[AMQP] error during connecting to the service.\nPlease check configurations.\n', err)
        throw err
      })
  }

  private async setupExchanges() {
    const amqpProvider = c.has('amqp.provider') ? c.get('amqp.provider') : null
    const providerList: any = amqpProvider || {}
    return Promise.all(
      Object.keys(providerList)
            .map(async (it) => {
              const provider: { exchange: string, routingKey: string, options?: any } = providerList[it]
              const exchange = await this.newExchange(provider.exchange, provider.options || {})
              this.exchangeList.set(provider.exchange, exchange)
              return exchange
            })
    )
  }

  private async setupQueues() {
    const amqpConsumer = c.has('amqp.consumer') ? c.get('amqp.consumer') : null
    const consumerList: any = amqpConsumer || {}
    return Promise.all(
      Object.keys(consumerList)
            .map(async (it) => {
              const consumer: { exchange: string, routingKey: string, queue: string, options?: any } = consumerList[it]
              const amqpQueue = await this.newQueue(consumer.queue, consumer.options || {})
              await amqpQueue.bindQueue(consumer.queue, consumer.exchange, consumer.routingKey)
              this.queueList.set(consumer.queue, amqpQueue)
              return amqpQueue
            })
    )
  }
}
