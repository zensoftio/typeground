import * as c from 'config'
import { Autowired, ComponentByName } from '../../core/annotations/di'
import BaseService from '../../core/service/base'
import { UserCreateDto, UserUpdateDto } from '../../dtos/user'
import UserModel from '../../models/user'
import { UserRepository } from '../../repositories'
import { AmqpService, UserService } from '../index'

@ComponentByName('UserService')
export default class DefaultUserService extends BaseService implements UserService {

  private amqpService: AmqpService
  private userRepository: UserRepository

  @Autowired('AmqpService')
  setAmqpService(service: AmqpService) {
    this.amqpService = service
  }

  @Autowired('UserRepository')
  setUserRepository(repository: UserRepository) {
    this.userRepository = repository
  }

  async createUser(dto: UserCreateDto): Promise<UserModel> {
    return this.userRepository.createEntity(dto)
  }

  async getUser(userId: string): Promise<UserModel | undefined> {
    return this.userRepository.receiveEntity(userId)
  }

  async updateUser(dto: UserUpdateDto): Promise<UserModel | undefined> {
    return this.userRepository.updateEntity(dto)
  }

  async deleteUser(userId: string): Promise<void> {
    return this.userRepository.deleteEntity(userId)
  }

  async receiveAllUsers(): Promise<UserModel[] | undefined> {
    return this.userRepository.receiveAll()
  }

  async sendAmqpMessage(message: string): Promise<void> {
    if (c.has('amqp.provider.test.exchange') && c.has('amqp.provider.test.routingKey')) {
      await this.amqpService.sendMessage(
        c.get('amqp.provider.test.exchange'),
        c.get('amqp.provider.test.routingKey'),
        message,
        {}
      )
    }
  }

}
