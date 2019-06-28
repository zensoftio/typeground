export default class Pathes {
  static UserBaseUrl = '/users'

  static User = class {
    static Base = Pathes.UserBaseUrl
    static UserId = `${Pathes.UserBaseUrl}/:userId`

    static New = '/project/:projectId'
  }
}
