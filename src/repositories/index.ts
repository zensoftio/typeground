import UserModel from '../models/user'
import {IBuildOptions} from 'sequelize-typescript'

export interface UserRepository {
  getAll(): Promise<UserModel[]>
  
  create(values?: any, options?: IBuildOptions): UserModel
}