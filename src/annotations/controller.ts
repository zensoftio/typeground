import {NextFunction, Request, Response, Router} from 'express'
import {injectable} from './di'

const http = (method: string) => (path: string) => (target: any, key: string) => {
  target.constructor.handlers.push({path, key, method: method, filter: target.constructor.name})
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

export const routerBind = (router: any, handlers: any, controller: any) =>
  handlers.filter(({filter}: { filter: any }) => filter === controller.constructor.name)
          .forEach(
            (it: any) => router[it.method](
              it.path,
              async (req: Request, res: Response, next: NextFunction) =>
                controller.response(res, await controller[it.key](req, res, next))
            )
          )

