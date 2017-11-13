import UserModel from '../../models/user'
import {UserRepository} from '../index'
import {injectable} from '../../annotations/di'
import {IBuildOptions} from 'sequelize-typescript'

@injectable('UserRepository')
export class DefaultUserRepository implements UserRepository {
  async getAll() {
    return await UserModel.all<UserModel>()
  }
  
  create(values?: any, options?: IBuildOptions) {
    return new UserModel(values, options)
  }
}
