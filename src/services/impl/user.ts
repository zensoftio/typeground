import * as c from 'config'
import { Autowired, ComponentByName } from '../../core/annotations/di'
import { HttpDataNotFoundError } from '../../core/exceptions/http'
import BaseService from '../../core/service/base'
import { AmqpService } from '../../core/service/index'
import Request from '../../core/utils/request'
import { default as UserDto, UserCreateDto, UserUpdateDto } from '../../dtos/user'
import ErrorsConstants from '../../enums/errors-constants'
import Injectables from '../../enums/injectables'
import UserModel from '../../models/user'
import { UserRepository } from '../../repositories'
import { UserService } from '../index'

const apiRequest = new Request('http://localhost:8080')

@ComponentByName(Injectables.services.user)
export default class DefaultUserService extends BaseService implements UserService {

  private amqpService: AmqpService
  private userRepository: UserRepository

  @Autowired(Injectables.services.amqp)
  setAmqpService(service: AmqpService) {
    this.amqpService = service
  }

  @Autowired(Injectables.repositories.user)
  setUserRepository(repository: UserRepository) {
    this.userRepository = repository
  }

  async createUser(dto: UserCreateDto): Promise<UserModel> {
    return this.userRepository.createEntity(dto)
  }

  async getUser(userId: string): Promise<UserDto> {
    const user = await this.userRepository.getEntity(userId)
    if (!user) {
      throw new HttpDataNotFoundError(`${ErrorsConstants.user.notFoundById}: ${userId}`)
    }
    return user
  }

  async updateUser(dto: UserUpdateDto): Promise<UserDto> {
    const user = await this.userRepository.updateEntity(dto)
    if (!user) {
      throw new HttpDataNotFoundError(`${ErrorsConstants.user.notFoundById}: ${dto.id}`)
    }
    return user
  }

  async deleteUser(userId: string): Promise<void> {
    return this.userRepository.deleteEntity(userId)
  }

  async getAllUsers(): Promise<UserDto[]> {
    return this.userRepository.getAll()
  }

  async getAllUsersByApiRequest(): Promise<UserDto[]> {
    return apiRequest.get('/api/v1/users')
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
