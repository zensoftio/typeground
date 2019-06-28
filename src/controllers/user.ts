import { BaseController } from '../core/controller/base'
import {
  DeleteMapping,
  GetMapping,
  PathVariable,
  PostMapping,
  PutMapping,
  RequestBody,
  RequestParam,
  RestController
} from '../core/annotations/controller'
import { Autowired } from '../core/annotations/di'
import UserDto, { UserCreateDto, UserUpdateDto } from '../dtos/user'
import Pathes from '../enums/pathes'
import { UserService } from '../services'

@RestController
export default class UserController extends BaseController {

  private userService: UserService

  @Autowired('UserService')
  setUserService(userService: UserService) {
    this.userService = userService
  }

  @PostMapping(Pathes.User.Base)
  async createUser(@RequestBody(UserCreateDto) dto: UserCreateDto): Promise<UserDto> {
    return this.userService.createUser(dto)
  }

  @GetMapping(Pathes.User.UserId)
  async receiveUser(@PathVariable('userId', String) userId: string): Promise<UserDto | undefined> {
    return this.userService.receiveUser(userId)
  }

  @PutMapping(Pathes.User.Base)
  async updateUser(@RequestBody(UserUpdateDto) dto: UserUpdateDto): Promise<UserDto | undefined> {
    return this.userService.updateUser(dto)
  }

  @DeleteMapping(Pathes.User.UserId)
  async deleteUser(@PathVariable('userId', String) userId: string): Promise<void> {
    return this.userService.deleteUser(userId)
  }

  @GetMapping(Pathes.User.Base)
  async receiveAllUsers() {
    return this.userService.receiveAllUsers()
  }

  @PostMapping(Pathes.User.New)
  async index(@PathVariable('projectId', Number) projectId: number,
              @RequestBody(UserCreateDto) userCreateDto: UserCreateDto,
              @RequestParam('test', Number) test?: number): Promise<UserDto> {
    console.log(projectId, test, userCreateDto)
    return await this.userService.createUser(userCreateDto)
  }
}
