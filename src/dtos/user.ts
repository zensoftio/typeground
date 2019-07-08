import { IsDefined, IsString, IsUUID, MaxLength } from 'class-validator'

export default class UserDto {
  @IsDefined()
  @IsUUID()
  id: string

  @IsDefined()
  @IsString()
  @MaxLength(255)
  name: string

  constructor({ id, name }: UserDto) {
    this.id = id
    this.name = name
  }
}

export class UserCreateDto {
  @IsDefined()
  @IsString()
  @MaxLength(255)
  name: string

  constructor({ name }: UserCreateDto) {
    this.name = name
  }
}

export class UserUpdateDto {
  @IsDefined()
  @IsUUID()
  id: string

  @IsDefined()
  @IsString()
  @MaxLength(255)
  name: string

  constructor({ id, name }: UserUpdateDto) {
    this.id = id
    this.name = name
  }
}
