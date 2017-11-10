import {BaseController} from './common/base'
import {controller, httpGet, httpPost} from '../annotations/controller'
import {UserService} from '../services/index'
import {inject} from '../annotations/di'
import {Pathes} from '../enums/pathes'

@controller
export default class UserController extends BaseController {
  
  private userService: UserService
  
  @inject('UserService')
  setUserService(userService: UserService) {
    this.userService = userService
  }
  
  @httpPost(Pathes.USER.NEW)
  // req: Request, res: Response, next: NextFunction
  protected index = async () => {
    const userModel = await this.userService.createUser()
    
    return userModel.toJSON()
  }
  
  @httpGet(Pathes.USER.LIST)
  // req: Request, res: Response, next: NextFunction
  protected list = async () => {
    const userModelList = await this.userService.list()
    
    return userModelList.map(it => it.toJSON())
  }
}
