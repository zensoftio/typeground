import { ConsumeMessage, Message, Options, Replies } from 'amqplib'
import BaseService from '../core/service/base'
import { UserCreateDto, UserUpdateDto } from '../dtos/user'
import UserModel from '../models/user'
import Consume = Replies.Consume
import Publish = Options.Publish

export interface UserService extends BaseService {
  createUser(dto: UserCreateDto): Promise<UserModel>

  getUser(userId: string): Promise<UserModel | undefined>

  updateUser(dto: UserUpdateDto): Promise<UserModel | undefined>

  deleteUser(userId: string): Promise<void>

  receiveAllUsers(): Promise<UserModel[] | undefined>

  sendAmqpMessage(message: string): Promise<void>
}

export interface AmqpService extends BaseService {
  sendMessage(exchangeName: string, routingKey: string, message: string, options: Publish)
    : Promise<any>

  subscribe(queueName: string, handler: (msg: ConsumeMessage | null) => any, options?: Consume | undefined)
    : Promise<Consume>

  ackMessage(queueName: string, ackMessage: Message): void

  nackMessage(queueName: string, message: Message, requeue?: boolean): void
}
