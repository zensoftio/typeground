import UserModel from '../models/user'

export interface UserService {
  create(): Promise<UserModel>
  
  list(): Promise<UserModel[]>
}