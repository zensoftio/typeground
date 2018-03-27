import {BaseController} from '../core/controller/base'
import {
  GetMapping,
  PathVariable,
  PostMapping,
  RequestBody,
  RequestParam,
  RestController
} from '../core/annotations/controller'
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
  async index(@PathVariable('projectId') projectId: number,
              @RequestParam('test') test: number,
              @RequestBody('body') body: { some: number }): Promise<UserDto> {
    console.log(projectId, test, body)
    const userModel = await this.userService.createUser()

    return userModel.toJSON()
  }

  @GetMapping(Pathes.User.List)
  list() {
    return this.userService.list()
  }

  @GetMapping(Pathes.User.ListApi)
  async listApi() {
    const userModelList = await this.userService.listApi()

    return userModelList.map(it => it.toJSON())
  }
}
