import * as sinon from 'sinon'

export class MockedUserDefaultRepositoryResults {
  static createEntity = {}
  static getEntity = {}
  static updateEntity = {}
  static deleteEntity = {}
  static getAll = {}
}

export class MockedUserErrorRepositoryResults {
  static createEntity = null
  static getEntity = null
  static updateEntity = null
  static deleteEntity = null
  static getAll = null
}

export class MockedUserDefaultRepository {
  createEntity = sinon.stub().resolves(MockedUserDefaultRepositoryResults.createEntity)
  getEntity = sinon.stub().resolves(MockedUserDefaultRepositoryResults.getEntity)
  updateEntity = sinon.stub().resolves(MockedUserDefaultRepositoryResults.updateEntity)
  deleteEntity = sinon.stub().resolves(MockedUserDefaultRepositoryResults.deleteEntity)
  getAll = sinon.stub().resolves(MockedUserDefaultRepositoryResults.getAll)
}

export class MockedUserErrorRepository {
  createEntity = sinon.stub().resolves(MockedUserErrorRepositoryResults.createEntity)
  getEntity = sinon.stub().resolves(MockedUserErrorRepositoryResults.getEntity)
  updateEntity = sinon.stub().resolves(MockedUserErrorRepositoryResults.updateEntity)
  deleteEntity = sinon.stub().resolves(MockedUserErrorRepositoryResults.deleteEntity)
  getAll = sinon.stub().resolves(MockedUserErrorRepositoryResults.getAll)
}
