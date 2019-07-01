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
import Paths from '../enums/paths'
import { UserService } from '../services'

@RestController
export default class UserController extends BaseController {

  private userService: UserService

  @Autowired('UserService')
  setUserService(service: UserService) {
    this.userService = service
  }

  @PostMapping(Paths.User.Base)
  async createUser(@RequestBody(UserCreateDto) dto: UserCreateDto): Promise<UserDto> {
    return this.userService.createUser(dto)
  }

  @GetMapping(Paths.User.UserId)
  async getUser(@PathVariable('userId', String) userId: string,
                @RequestParam('test', Number) test?: number): Promise<UserDto | undefined> {
    return this.userService.getUser(userId)
  }

  @PutMapping(Paths.User.Base)
  async updateUser(@RequestBody(UserUpdateDto) dto: UserUpdateDto): Promise<UserDto | undefined> {
    return this.userService.updateUser(dto)
  }

  @DeleteMapping(Paths.User.UserId)
  async deleteUser(@PathVariable('userId', String) userId: string): Promise<void> {
    return this.userService.deleteUser(userId)
  }

  @GetMapping(Paths.User.Base)
  async receiveAllUsers() {
    return this.userService.receiveAllUsers()
  }

}
