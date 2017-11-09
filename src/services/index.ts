import UserModel from '../models/user'
import BaseService from './impl/common/base'
import {ExchangePublishOptions, SubscribeCallback} from 'amqp'

export interface UserService extends BaseService {
  createUser(): Promise<UserModel>
  
  list(): Promise<UserModel[]>
}

export interface TestService extends BaseService {
  test(): void
}

export interface TestService2 extends BaseService {
  test2(): void
}

export interface AmqpService extends BaseService {
  
  sendMessage(exchangeName: string, routingKey: string, message: any, options: ExchangePublishOptions): Promise<any>
  
  subscribe(queueName: string, handler: SubscribeCallback): Promise<void>
}
