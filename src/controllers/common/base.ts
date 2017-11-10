import {Response} from 'express'
import {router, routerBind} from '../../annotations/controller'
import HttpException from '../../exceptions/http-exception'

export class BaseController {
  
  protected static handlers: { path: string, key: string, method: string }[] = []
  
  constructor() {
    this.bindRouter()
  }
  
  protected response(res: Response, options: any) {
    res.json(options)
  }
  
  protected error(res: Response, error: HttpException) {
    res.status(error.status)
    res.json(error.details)
  }
  
  private bindRouter() {
    routerBind(router, BaseController.handlers, this)
  }
}
