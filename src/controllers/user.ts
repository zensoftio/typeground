import {BaseController} from './common/base'
import {controller, httpGet, httpPost} from '../annotations/controller'
import {UserService} from '../services/index'
import {inject} from '../annotations/di'

@controller
class UserController extends BaseController {
  
  private userService: UserService
  
  constructor() {
    super()
    console.log('create UserController')
  }
  
  @inject('UserService')
  setUserService(userService: UserService) {
    this.userService = userService
  }
  
  @httpPost('/')
  // req: Request, res: Response, next: NextFunction
  protected index = async () => {
    const userModel = await this.userService.createUser()
    
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
