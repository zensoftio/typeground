import { EntityManager, EntityRepository, Repository } from 'typeorm'
import { UserRepository } from '../index'
import { RepositoryByName } from '../../core/annotations/di'
import { UserCreateDto } from '../../dtos/user'
import UserModel from '../../models/user'

@RepositoryByName('UserRepository')
@EntityRepository(UserModel)
export class DefaultUserRepository extends Repository<UserModel> implements UserRepository {
  async getAll(): Promise<UserModel[] | undefined> {
    return await this.find()
  }

  createEntity(dto: UserCreateDto, entityManager?: EntityManager): Promise<UserModel> {
    const entity = this.create(dto)
    return entityManager ? entityManager.save(entity) : this.save(entity)
  }
}
