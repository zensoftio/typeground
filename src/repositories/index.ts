import { EntityManager } from 'typeorm'
import { UserCreateDto, UserUpdateDto } from '../dtos/user'
import UserModel from '../models/user'

export interface UserRepository {
  createEntity(dto: UserCreateDto, entityManager?: EntityManager): Promise<UserModel>

  receiveEntity(userId: string): Promise<UserModel | undefined>

  updateEntity(dto: UserUpdateDto, entityManager?: EntityManager): Promise<UserModel | undefined>

  deleteEntity(userId: string, entityManager?: EntityManager): Promise<void>

  receiveAll(): Promise<UserModel[] | undefined>
}
