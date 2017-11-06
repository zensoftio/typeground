import UserModel from '../models/user'
import BaseService from './impl/common/base'

export interface UserService extends BaseService {
  createUser(): Promise<UserModel>
  
  list(): Promise<UserModel[]>
}

export interface TestService extends BaseService {
  test(): void
}

export interface TestService2 extends BaseService {
  test2(): void
}
