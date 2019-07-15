import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 */
@Entity('users')
export default class UserModel {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  name: string

}
