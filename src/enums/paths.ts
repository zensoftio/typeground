export default class Paths {
  static apiV1BaseUrl = '/api/v1'
  static userBaseUrl = `${Paths.apiV1BaseUrl}/users`

  static user = class {
    static base = Paths.userBaseUrl
    static userId = `${Paths.userBaseUrl}/:userId`
    static sendMessage = `${Paths.userBaseUrl}/doSendMessage`
    static apiRequest = `${Paths.userBaseUrl}/doApiRequest`
  }
}
