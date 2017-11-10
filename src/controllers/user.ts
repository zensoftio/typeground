import {BaseController} from './common/base'
import {controller, httpGet, httpPost} from '../annotations/controller'
import {UserService} from '../services/index'
import {inject} from '../annotations/di'
import Pathes from '../enums/pathes'

@controller
export default class UserController extends BaseController {
  
  private userService: UserService
  
  @inject('UserService')
  setUserService(userService: UserService) {
    this.userService = userService
  }
  
  @httpPost(Pathes.User.New)
  // req: Request, res: Response, next: NextFunction
  protected index = async () => {
    const userModel = await this.userService.createUser()
    
    return userModel.toJSON()
  }
  
  @httpGet(Pathes.User.List)
  // req: Request, res: Response, next: NextFunction
  protected list = async () => {
    return await this.userService.list()
  }
  
  @httpGet(Pathes.User.ListApi)
  // req: Request, res: Response, next: NextFunction
  protected listApi = async () => {
    const userModelList = await this.userService.listApi()
    
    return userModelList.map(it => it.toJSON())
  }
}
