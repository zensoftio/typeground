import UserModel from '../models/user'
import BaseService from './impl/common/base'
import {ExchangePublishOptions, SubscribeCallback} from 'amqp'
import UserDto from '../dtos/user'

export interface UserService extends BaseService {
  createUser(): Promise<UserModel>
  
  list(): Promise<UserDto[]>
  
  listApi(): Promise<UserModel[]>
}

export interface AmqpService extends BaseService {
  
  sendMessage(exchangeName: string, routingKey: string, message: any, options: ExchangePublishOptions): Promise<any>
  
  subscribe(queueName: string, handler: SubscribeCallback): Promise<void>
}
