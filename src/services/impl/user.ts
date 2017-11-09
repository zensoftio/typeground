import UserModel from '../../models/user'
import {AmqpService, TestService, UserService} from '../index'
import {inject, injectable} from '../../annotations/di'
import BaseService from './common/base'
import * as c from 'config'

@injectable('UserService')
export default class DefaultUserService extends BaseService implements UserService {
  
  private testService: TestService
  private amqpService: AmqpService
  
  async postConstruct() {
    await this.testAmqp()
  }
  
  @inject('TestService')
  setTestService(testService: TestService) {
    this.testService = testService
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
  
  list() {
    this.testService.test()
    return UserModel.getAll()
  }
  
  private async testAmqp() {
    
    await this.amqpService.subscribe(c.get('amqp.consumer.test.queue'), (message, headers, deliveryInfo, ack) => {
      console.log(message, headers, deliveryInfo)
      ack.acknowledge(true)
    })
    await this.amqpService.sendMessage(
      c.get('amqp.provider.test.exchange'),
      c.get('amqp.provider.test.routingKey'),
      {message: 'some test'},
      {}
    )
    
  }
  
}
