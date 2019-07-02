import { ConsumeMessage, Message, Options, Replies } from 'amqplib'
import BaseService from '../core/service/base'
import { UserCreateDto, default as UserDto, UserUpdateDto } from '../dtos/user'
import Consume = Replies.Consume
import Publish = Options.Publish

export interface UserService extends BaseService {
  createUser(dto: UserCreateDto): Promise<UserDto>

  getUser(userId: string): Promise<UserDto>

  updateUser(dto: UserUpdateDto): Promise<UserDto>

  deleteUser(userId: string): Promise<void>

  getAllUsers(): Promise<UserDto[]>

  getAllUsersByApiRequest(): Promise<UserDto[]>

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
