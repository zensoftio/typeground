import {AmqpService, UserService} from '../index'
import {inject, injectable} from '../../annotations/di'
import BaseService from './common/base'
import * as c from 'config'
import Pathes from '../../enums/pathes'
import fetch from 'node-fetch'
import UserDto from '../../dtos/user'
import {UserRepository} from '../../repositories/index'

@injectable('UserService')
export default class DefaultUserService extends BaseService implements UserService {
  
  private amqpService: AmqpService
  private userRepository: UserRepository
  
  async postConstruct() {
    await this.testAmqp()
  }
  
  @inject('AmqpService')
  setAmqpService(amqpService: AmqpService) {
    this.amqpService = amqpService
  }
  
  @inject('UserRepository')
  setUserRepository(userRepository: UserRepository) {
    this.userRepository = userRepository
  }
  
  async createUser() {
    const userModel = this.userRepository.create()
    userModel.name = Math.random()
                         .toString()
    await userModel.save()
    return userModel
  }
  
  async list() {
    const all = await fetch(`http://localhost:8080${Pathes.User.ListApi}`)
    return await all.json<UserDto[]>()
  }
  
  listApi() {
    return this.userRepository.getAll()
  }
  
  private async testAmqp() {
    await this.amqpService.sendMessage(
      c.get('amqp.provider.test.exchange'),
      c.get('amqp.provider.test.routingKey'),
      {message: 'some test'},
      {}
    )
  }
  
}
