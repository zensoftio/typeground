import * as express from 'express'
import {router, routerBind} from '../annotations/controller'
import {HttpException} from '../exceptions/http'
import Controller from './index'
import {httpErrorHandler} from '../../error-handlers/http'

export class BaseController implements Controller {

  errorHandler = httpErrorHandler

  constructor() {
    this.bindRouter()
  }

  response(res: express.Response, options: any) {
    res.status(200)
    res.json(options)
  }

  error(res: express.Response, error: HttpException) {
    res.status(error.status)
    res.json(error.message)
  }

  bindRouter() {
    routerBind(router, this)
  }
}
