import { EntityManager } from 'typeorm'
import UserModel from '../models/user'
import { UserCreateDto } from '../dtos/user'

export interface UserRepository {
  getAll(): Promise<UserModel[] | undefined>

  createEntity(dto: UserCreateDto, entityManager?: EntityManager): Promise<UserModel>
}
