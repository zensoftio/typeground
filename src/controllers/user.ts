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
  // req: Request, res: Response, next: NextFunction
  protected index = async () => {
    const userModel = await this.userService.create()
    
    return userModel.toJSON()
  }
  
  @httpGet('/')
  // req: Request, res: Response, next: NextFunction
  protected list = async () => {
    const userModelList = await this.userService.list()
    
    return userModelList.map(it => it.toJSON())
  }
}

export default UserController
