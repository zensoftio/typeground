export default class Paths {
  static userBaseUrl = '/users'

  static user = class {
    static base = Paths.userBaseUrl
    static userId = `${Paths.userBaseUrl}/:userId`
    static sendMessage = `${Paths.userBaseUrl}/doSendMessage`
    static apiRequest = `${Paths.userBaseUrl}/doApiRequest`
  }
}
