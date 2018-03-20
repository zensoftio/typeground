import {BaseController} from '../core/controller/base'
import {RestController, GetMapping, PostMapping} from '../core/annotations/controller'
import {UserService} from '../services'
import {Autowired} from '../core/annotations/di'
import Pathes from '../enums/pathes'
import UserDto from '../dtos/user'

@RestController
export default class UserController extends BaseController {

  private userService: UserService

  @Autowired('UserService')
  setUserService(userService: UserService) {
    this.userService = userService
  }

  @PostMapping(Pathes.User.New)
  protected index = async (): Promise<UserDto> => {
    const userModel = await this.userService.createUser()

    return userModel.toJSON()
  }

  @GetMapping(Pathes.User.List)
  protected list = async () => {
    return await this.userService.list()
  }

  @GetMapping(Pathes.User.ListApi)
  protected listApi = async () => {
    const userModelList = await this.userService.listApi()

    return userModelList.map(it => it.toJSON())
  }
}
