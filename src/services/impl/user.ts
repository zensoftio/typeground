import * as c from 'config'
import { Autowired, ComponentByName } from '../../core/annotations/di'
import BaseService from '../../core/service/base'
import { UserCreateDto, UserUpdateDto } from '../../dtos/user'
import { UserRepository } from '../../repositories'
import { AmqpService, UserService } from '../index'

@ComponentByName('UserService')
export default class DefaultUserService extends BaseService implements UserService {

  private amqpService: AmqpService
  private userRepository: UserRepository

  async postConstruct() {
    await this.testAmqp()
  }

  @Autowired('AmqpService')
  setAmqpService(service: AmqpService) {
    this.amqpService = service
  }

  @Autowired('UserRepository')
  setUserRepository(repository: UserRepository) {
    this.userRepository = repository
  }

  async createUser(dto: UserCreateDto) {
    return await this.userRepository.createEntity(dto)
  }

  async receiveUser(userId: string) {
    return this.userRepository.receiveEntity(userId)
  }

  async updateUser(dto: UserUpdateDto) {
    return this.userRepository.updateEntity(dto)
  }

  async deleteUser(userId: string) {
    return await this.userRepository.deleteEntity(userId)
  }

  async receiveAllUsers() {
    return this.userRepository.receiveAll()
  }

  private async testAmqp() {
    if (c.has('amqp.provider.test.exchange') && c.has('amqp.provider.test.routingKey')) {
      await this.amqpService.sendMessage(
        c.get('amqp.provider.test.exchange'),
        c.get('amqp.provider.test.routingKey'),
        { message: 'some test' },
        {}
      )
    }
  }

}
