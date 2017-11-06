import {Column, Model, Table} from 'sequelize-typescript'

@Table({tableName: 'users'})
export default class UserModel extends Model<UserModel> {
  
  /* fields */
  @Column
  name: string
  
  /* methods */
  setName() {
  
  }
  
  /* repository */
  
  // async is needed for getting rid of Bluebird which is part of a sequelize
  static async getAll() {
    // we need to specify generic type for sequelize
    return await UserModel.all<UserModel>()
  }
  
}
