import {Attr} from '../core/annotations/entity'

export default class UserDto {
  id: string
  name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }
}

export class UserCreateDto {
  @Attr()
  name: string
}

export class UserUpdateDto {
  @Attr()
  id: string

  @Attr()
  name: string
}
