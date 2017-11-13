import {Column, Model, Table} from 'sequelize-typescript'

@Table({tableName: 'users'})
export default class UserModel extends Model<UserModel> {
  
  @Column
  name: string
}
