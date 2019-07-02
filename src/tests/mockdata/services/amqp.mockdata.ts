import * as sinon from 'sinon'

export class MockedAmqpDefaultServiceResults {
  static sendMessage = {}
  static subscribe = {}
  static ackMessage = {}
  static nackMessage = {}
}

export class MockedAmqpErrorServiceResults {
  static sendMessage = null
  static subscribe = null
  static ackMessage = null
  static nackMessage = null
}

export class MockedAmqpDefaultService {
  postConstruct = sinon.stub().resolves()
  sendMessage = sinon.stub().resolves(MockedAmqpDefaultServiceResults.sendMessage)
  subscribe = sinon.stub().resolves(MockedAmqpDefaultServiceResults.subscribe)
  ackMessage = sinon.stub().resolves(MockedAmqpDefaultServiceResults.ackMessage)
  nackMessage = sinon.stub().resolves(MockedAmqpDefaultServiceResults.nackMessage)
}

export class MockedAmqpErrorService {
  postConstruct = sinon.stub().resolves()
  sendMessage = sinon.stub().resolves(MockedAmqpErrorServiceResults.sendMessage)
  subscribe = sinon.stub().resolves(MockedAmqpErrorServiceResults.subscribe)
  ackMessage = sinon.stub().resolves(MockedAmqpErrorServiceResults.ackMessage)
  nackMessage = sinon.stub().resolves(MockedAmqpErrorServiceResults.nackMessage)
}
