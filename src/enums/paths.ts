export default class Paths {
  static UserBaseUrl = '/users'

  static User = class {
    static Base = Paths.UserBaseUrl
    static UserId = `${Paths.UserBaseUrl}/:userId`
    static SendMessage = `${Paths.UserBaseUrl}/doSendMessage`
  }
}
