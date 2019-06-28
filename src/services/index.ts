import { ExchangePublishOptions, SubscribeCallback } from 'amqp'
import BaseService from '../core/service/base'
import { UserCreateDto, UserUpdateDto } from '../dtos/user'
import UserModel from '../models/user'

export interface UserService extends BaseService {
  createUser(userCreateDto: UserCreateDto): Promise<UserModel>

  receiveUser(userId: string): Promise<UserModel | undefined>

  updateUser(userCreateDto: UserUpdateDto): Promise<UserModel | undefined>

  deleteUser(userId: string): Promise<void>

  receiveAllUsers(): Promise<UserModel[] | undefined>
}

export interface AmqpService extends BaseService {
  sendMessage(exchangeName: string, routingKey: string, message: any, options: ExchangePublishOptions): Promise<any>

  subscribe(queueName: string, handler: SubscribeCallback): Promise<void>
}
