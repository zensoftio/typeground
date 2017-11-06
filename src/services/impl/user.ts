import UserModel from '../../models/user'
import {UserService} from '../index'
import {injectable} from '../../annotations/di'

@injectable('UserService')
export default class DefaultUserService implements UserService {
  
  async create() {
    const userModel = new UserModel()
    userModel.name = Math.random()
                         .toString()
    await userModel.save()
    return userModel
  }
  
  list() {
    return UserModel.getAll()
  }
  
}
