import { Column, Entity } from 'typeorm'

@Entity('users')
export default class UserModel {

  @Column({ type: 'varchar' })
  name: string

}
