import { EntityManager, EntityRepository, Repository } from 'typeorm'
import { RepositoryByName } from '../../core/annotations/di'
import { UserCreateDto, UserUpdateDto } from '../../dtos/user'
import Injectables from '../../enums/injectables'
import UserModel from '../../models/user'
import { UserRepository } from '../index'

@RepositoryByName(Injectables.repositories.user)
@EntityRepository(UserModel)
export class DefaultUserRepository extends Repository<UserModel> implements UserRepository {
  async createEntity(dto: UserCreateDto, entityManager?: EntityManager): Promise<UserModel> {
    const entity = this.create(dto)
    return entityManager ? entityManager.save(entity) : this.save(entity)
  }

  async receiveEntity(userId: string): Promise<UserModel | undefined> {
    return this.findOne({
                          where: { id: userId }
                        })
  }

  async updateEntity(dto: UserUpdateDto, entityManager?: EntityManager): Promise<UserModel | undefined> {
    const queryBuilder = entityManager ? entityManager.createQueryBuilder() : this.createQueryBuilder()
    await queryBuilder.update(UserModel)
                      .set(dto)
                      .where('id = :id', { id: dto.id })
                      .execute()
    return this.receiveEntity(dto.id)
  }

  async deleteEntity(userId: string, entityManager?: EntityManager): Promise<void> {
    const queryBuilder = entityManager ? entityManager.createQueryBuilder() : this.createQueryBuilder()
    await queryBuilder.delete()
                      .from(UserModel)
                      .where('id = :userId', { userId })
                      .execute()
  }

  async receiveAll(): Promise<UserModel[] | undefined> {
    return this.find()
  }
}
