import BaseService from '../core/service/base'
import { default as UserDto, UserCreateDto, UserUpdateDto } from '../dtos/user'

export interface UserService extends BaseService {
  createUser(dto: UserCreateDto): Promise<UserDto>

  getUser(userId: string): Promise<UserDto>

  updateUser(dto: UserUpdateDto): Promise<UserDto>

  deleteUser(userId: string): Promise<void>

  getAllUsers(): Promise<UserDto[]>

  getAllUsersByApiRequest(): Promise<UserDto[]>

  sendAmqpMessage(message: string): Promise<void>
}
