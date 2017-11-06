import {Request, Response} from 'express'
import {BaseController} from './common/base'
import {controller, httpGet, httpPost} from '../annotations/controller'
import {UserService} from '../services/index'
import {Inject} from 'di-typescript'
import {i} from '../annotations/di'

@Inject
@controller
class UserController extends BaseController {
  
  constructor(@i('UserService') private userService: UserService) {
    super()
  }
  
  @httpPost('/')
  protected index = async (req: Request, res: Response) => {
    const userModel = await this.userService.create()
    
    this.response(res, userModel.toJSON())
  }
  
  @httpGet('/')
  protected list = async (req: Request, res: Response) => {
    const userModelList = await this.userService.list()
    
    this.response(res, userModelList.map(it => it.toJSON()))
  }
}

export default UserController
