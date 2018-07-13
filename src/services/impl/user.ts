import {AmqpService, UserService} from '../index'
import {Autowired, ComponentByName} from '../../core/annotations/di'
import BaseService from '../../core/service/base'
import * as c from 'config'
import Pathes from '../../enums/pathes'
import fetch from 'node-fetch'
import UserDto, {UserCreateDto} from '../../dtos/user'
import {UserRepository} from '../../repositories'

@ComponentByName('UserService')
export default class DefaultUserService extends BaseService implements UserService {

  private amqpService: AmqpService
  private userRepository: UserRepository

  async postConstruct() {
    await this.testAmqp()
  }

  @Autowired('AmqpService')
  setAmqpService(amqpService: AmqpService) {
    this.amqpService = amqpService
  }

  @Autowired('UserRepository')
  setUserRepository(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async createUser(userCreateDto: UserCreateDto) {
    return await this.userRepository.createEntity(userCreateDto)
  }

  async list() {
    const all = await fetch(`http://localhost:8080${Pathes.User.ListApi}`)
    return await all.json<UserDto[]>()
  }

  listApi() {
    return this.userRepository.getAll()
  }

  private async testAmqp() {
    if (c.has('amqp.provider.test.exchange') && c.has('amqp.provider.test.routingKey')) {
      await this.amqpService.sendMessage(
        c.get('amqp.provider.test.exchange'),
        c.get('amqp.provider.test.routingKey'),
        {message: 'some test'},
        {}
      )
    }
  }

}
