export default class Injectables {

  static repositories = class {
    static user = 'UserRepository'
  }

  static services = class {
    static amqp = 'AmqpService'
    static user = 'UserService'
  }

}
