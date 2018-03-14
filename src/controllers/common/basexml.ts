import * as express from 'express'
import {router, routerBind} from '../../annotations/controller'
import {HttpException} from '../../exceptions/http'
import Controller from './index'
import {httpErrorHandler} from '../../error-handlers/http'

export class BaseXmlController implements Controller {

  protected static handlers: { path: string, key: string, method: string }[] = []

  errorHandler = httpErrorHandler

  constructor() {
    this.bindRouter()
  }

  response(res: express.Response, options: any) {
    res.type('text/xml')
    res.status(200)
    res.send(options)
  }

  error(res: express.Response, error: HttpException) {
    res.type('text/xml')
    res.status(error.status)
    res.send(error.message)
  }

  bindRouter() {
    routerBind(router, BaseXmlController.handlers, this)
  }
}
