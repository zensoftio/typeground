import {NextFunction, Request, Response, Router} from 'express'
import {injectable} from './di'
import Controller from '../controllers/common'

const http = (method: string) => (path: string) => (target: any, key: string) => {
  target.constructor.handlers.push({path, key, method, filter: target.constructor.name})
}

export const httpGet = http('get')

export const httpPost = http('post')

export const httpPut = http('put')

export const httpDelete = http('delete')

export const httpPatch = http('patch')

export const httpOptions = http('options')

export const httpHead = http('head')

export const httpAll = http('all')

export const router = Router()

export const controller = (constructor: any) => injectable(constructor.name)(constructor)

export const routerBind = (router: any, handlers: any, controller: Controller) =>
  handlers.filter(({filter}: { filter: any }) => filter === controller.constructor.name)
          .forEach(
            (it: any) => router[it.method](
              it.path,
              async (req: Request, res: Response, next: NextFunction) => {
                try {
                  controller.response(res, await (controller as any)[it.key](req, res, next))
                } catch (e) {
                  controller.error(res, controller.errorHandler(e))
                }
              }
            )
          )

