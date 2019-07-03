import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export default class UserModel {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  name: string

}
