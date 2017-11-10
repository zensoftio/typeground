import UserModel from '../../models/user'
import {AmqpService, UserService} from '../index'
import {inject, injectable} from '../../annotations/di'
import BaseService from './common/base'
import * as c from 'config'
import Pathes from '../../enums/pathes'
import fetch from 'node-fetch'
import UserDto from '../../dtos/user'

@injectable('UserService')
export default class DefaultUserService extends BaseService implements UserService {
  
  private amqpService: AmqpService
  
  async postConstruct() {
    await this.testAmqp()
  }
  
  @inject('AmqpService')
  setAmqpService(amqpService: AmqpService) {
    this.amqpService = amqpService
  }
  
  async createUser() {
    const userModel = new UserModel()
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
    return UserModel.getAll()
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
