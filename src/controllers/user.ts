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
import UserDto, {UserCreateDto} from '../dtos/user'

@RestController
export default class UserController extends BaseController {

  private userService: UserService

  @Autowired('UserService')
  setUserService(userService: UserService) {
    this.userService = userService
  }

  @PostMapping(Pathes.User.New)
  async index(@PathVariable('projectId', Number) projectId: number,
              @RequestBody(UserCreateDto) userCreateDto: UserCreateDto,
              @RequestParam('test', Number) test?: number): Promise<UserDto> {
    console.log(projectId, test, userCreateDto)
    const userModel = await this.userService.createUser(userCreateDto)

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
