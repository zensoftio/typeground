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
import Injectables from '../enums/injectables'
import Paths from '../enums/paths'
import { UserService } from '../services'

@RestController
export default class UserController extends BaseController {

  private userService: UserService

  @Autowired(Injectables.services.user)
  setUserService(service: UserService) {
    this.userService = service
  }

  @PostMapping(Paths.user.base)
  async createUser(@RequestBody(UserCreateDto) dto: UserCreateDto): Promise<UserDto> {
    return this.userService.createUser(dto)
  }

  @GetMapping(Paths.user.userId)
  async getUser(@PathVariable('userId', String) userId: string): Promise<UserDto> {
    return this.userService.getUser(userId)
  }

  @PutMapping(Paths.user.base)
  async updateUser(@RequestBody(UserUpdateDto) dto: UserUpdateDto): Promise<UserDto> {
    return this.userService.updateUser(dto)
  }

  @DeleteMapping(Paths.user.userId)
  async deleteUser(@PathVariable('userId', String) userId: string): Promise<void> {
    return this.userService.deleteUser(userId)
  }

  @GetMapping(Paths.user.base)
  async getAllUsers() {
    return this.userService.getAllUsers()
  }

  @PostMapping(Paths.user.sendMessage)
  async sendMessage(@RequestParam('message', String) message?: string): Promise<void> {
    this.userService.sendAmqpMessage(message || 'test message')
  }

}
