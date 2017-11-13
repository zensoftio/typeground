import BaseService from './common/base'
import {AmqpService} from '../index'
import {
  AMQPClient,
  AMQPExchange,
  AMQPQueue,
  Callback,
  createConnection,
  ExchangeOptions,
  ExchangePublishOptions,
  QueueOptions,
  SubscribeCallback
} from 'amqp'
import {injectable} from '../../annotations/di'
import * as c from 'config'

@injectable('AmqpService')
export default class DefaultAmqpService extends BaseService implements AmqpService {
  private connection: AMQPClient
  private ready: Promise<any>
  private exchangeList: Map<string, AMQPExchange>
  private queueList: Map<string, AMQPQueue>
  
  constructor() {
    super()
    if (c.get('amqp')) {
      this.init()
    }
  }
  
  async sendMessage(exchangeName: string, routingKey: string, message: any, options: ExchangePublishOptions) {
    return this.ready.then(() => {
      const exchange = this.exchangeList.get(exchangeName)
      return exchange ? new Promise(
        (resolve, reject) => exchange.publish(
          routingKey,
          message,
          options,
          (err, msg) => err ? reject(err) : resolve(message)
        )
      ) : Promise.reject(`no exchange for name '${exchangeName}'`)
    })
  }
  
  subscribe(queueName: string, handler: SubscribeCallback) {
    return this.ready.then(() => {
      const queue = this.queueList.get(queueName)
      if (!queue) {
        throw new Error(`there is no queue for name ${queueName}`)
      }
      return queue.subscribe(handler)
    })
  }
  
  private newExchange(exchangeName: string, options: ExchangeOptions): Promise<AMQPExchange> {
    return new Promise(resolve => this.connection.exchange(exchangeName, options, resolve as Callback<void>))
  }
  
  private newQueue(queueName: string, options: QueueOptions): Promise<AMQPQueue> {
    return new Promise(resolve => this.connection.queue(queueName, options, (queue: any) => resolve(queue)))
  }
  
  private async init() {
    this.exchangeList = new Map()
    this.queueList = new Map()
    this.connection = createConnection(c.get('amqp.connection'))
    this.ready = new Promise((resolve, reject) => {
      this.connection.on('ready', resolve)
      this.connection.on('error', reject)
    }).then(() => this.setupExchanges())
      .then(() => this.setupQueues())
  }
  
  private setupExchanges() {
    const providerList: any = c.get('amqp.provider') || {}
    return Promise.all(
      Object.keys(providerList)
            .map(async it => {
              const provider: { exchange: string, routingKey: string, options?: any } = providerList[it]
              const exchange = await this.newExchange(provider.exchange, provider.options || {})
              this.exchangeList.set(provider.exchange, exchange)
              return exchange
            })
    )
  }
  
  private setupQueues() {
    const consumerList: any = c.get('amqp.consumer') || {}
    return Promise.all(
      Object.keys(consumerList)
            .map(async it => {
              const consumer: { exchange: string, routingKey: string, queue: string, options?: any } = consumerList[it]
              const amqpQueue = await this.newQueue(consumer.queue, consumer.options || {})
              amqpQueue.bind(consumer.exchange, consumer.routingKey)
              this.queueList.set(consumer.queue, amqpQueue)
              return amqpQueue
            })
    )
  }
}
