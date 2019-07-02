export default class ErrorsConstants {

  static amqp = class {
    static configNotFound = 'No configuration for amqp was found!'
    static connectionError = 'Error during connecting to the service. Please check configurations.'
    static consumerError = 'Consumer error'
    static noExchangeForName = 'No exchange for name'
    static noQueueForName = 'There is no queue for name'
    static noQueueWithName = 'No such queue with name'
    static somethingWentWrong = 'something went wrong'
    static tryingReconnect = 'trying to reconnect'
  }

  static user = class {
    static notFoundById = 'User not found by this id'
  }

}
