import {expect} from 'chai'
import 'mocha'
import DefaultUserService from '../../services/impl/user'
import UserModel from '../../models/user'


const defaultUserRepository = {
  getAllResult: [],
  getAll: function () {
    return Promise.resolve(this.getAllResult)
  },
  createEntity: function () {
    return Promise.resolve(new UserModel())
  }
}

describe('DefaultUserService', () => {

  it('DefaultUserService::listApi', async () => {

    const defaultUserService = new DefaultUserService()

    defaultUserService.setUserRepository(defaultUserRepository)

    const userList = await defaultUserService.listApi()

    expect(userList)
      .to
      .equal(defaultUserRepository.getAllResult)
  })

})
