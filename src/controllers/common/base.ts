import {Response} from 'express'
import {router, routerBind} from '../../annotations/controller'

export class BaseController {
  
  protected static handlers: { path: string, key: string, method: string }[] = []
  
  constructor() {
    this.bindRouter()
  }
  
  protected response(res: Response, options: any) {
    res.json(options)
  }
  
  private bindRouter() {
    routerBind(router, BaseController.handlers, this)
  }
}
