import UserModel from '../../models/user'
import {TestService, UserService} from '../index'
import {inject, injectable} from '../../annotations/di'
import BaseService from './common/base'

@injectable('UserService')
export default class DefaultUserService extends BaseService implements UserService {
  
  private testService: TestService
  
  @inject('TestService')
  setTestService(testService: TestService) {
    this.testService = testService
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
  
}
