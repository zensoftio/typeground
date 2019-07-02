import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import 'mocha'
import * as sinonChai from 'sinon-chai'
import { UserRepository } from '../../repositories/'
import DefaultUserService from '../../services/impl/user'
import {
  MockedUserDefaultRepository,
  MockedUserDefaultRepositoryResults,
  MockedUserErrorRepository
} from '../mockdata/repositories/user.mockdata'
import { MockedAmqpDefaultService } from '../mockdata/services/amqp.mockdata'
import { DummyData, UserCreateDto, UserUpdateDto } from '../mockdata/common.mockdata'

chai.should()
chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('DefaultUserService: successful cases', () => {
  let service: DefaultUserService
  let repository: UserRepository

  let amqpService: MockedAmqpDefaultService

  beforeEach(() => {
    service = new DefaultUserService()
    repository = new MockedUserDefaultRepository()
    service.setUserRepository(repository)

    amqpService = new MockedAmqpDefaultService()
    service.setAmqpService(amqpService)
  })

  it('createUser: should succeed to get a correct result', async () => {
    const result = await service.createUser(UserCreateDto)
    repository.createEntity.should.have.been.calledOnce
    return result.should.be.eq(MockedUserDefaultRepositoryResults.createEntity)
  })

  it('getUser: should succeed to get a correct result', async () => {
    const result = await service.getUser(DummyData.entryId)
    repository.getEntity.should.have.been.calledOnce
    return result.should.be.eq(MockedUserDefaultRepositoryResults.getEntity)
  })

  it('updateUser: should succeed to get a correct result', async () => {
    const result = await service.updateUser(UserUpdateDto)
    repository.updateEntity.should.have.been.calledOnce
    return result.should.be.eq(MockedUserDefaultRepositoryResults.updateEntity)
  })

  it('deleteUser: should succeed to get a correct result', async () => {
    await service.deleteUser(DummyData.entryId)
    repository.deleteEntity.should.have.been.calledOnce
  })

  it('getAllUsers: should succeed to get a correct result', async () => {
    const result = await service.getAllUsers()
    repository.getAll.should.have.been.calledOnce
    return result.should.be.eq(MockedUserDefaultRepositoryResults.getAll)
  })

  it('sendAmqpMessage: should succeed to get a correct result', async () => {
    await service.sendAmqpMessage(DummyData.entryMessage)
    amqpService.sendMessage.should.have.been.calledOnce
  })
})

describe('DefaultUserService: failed cases', () => {
  let service: DefaultUserService
  let repository: UserRepository

  let amqpService: MockedAmqpDefaultService

  beforeEach(() => {
    service = new DefaultUserService()
    repository = new MockedUserErrorRepository()
    service.setUserRepository(repository)

    amqpService = new MockedAmqpDefaultService()
    service.setAmqpService(amqpService)
  })

  it('getUser: should failed to get a correct result', async () => {
    return service.getUser(DummyData.entryId)
                  .should.be
                  .rejectedWith(`User not found by this id: ${DummyData.entryId}`)
  })

  it('updateUser: should failed to get a correct result', async () => {
    return service.updateUser(UserUpdateDto)
                  .should.be
                  .rejectedWith(`User not found by this id: ${UserUpdateDto.id}`)
  })
})
