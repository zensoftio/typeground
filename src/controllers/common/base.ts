import {Response, Router} from 'express'
import {routerBind} from '../../annotations/controller'
import {Injector} from 'di-typescript'

export class BaseController {
  
  protected static handlers: { path: string, key: string, method: string }[] = []
  
  public static create(router: Router) {
    const injector = new Injector()
    const indexRoute = injector.get(this)
    routerBind(router, this.handlers, indexRoute)
  }
  
  protected response(res: Response, options: any) {
    res.json(options)
  }
}
