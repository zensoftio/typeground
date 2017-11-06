import {NextFunction, Request, Response} from 'express'

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

export const routeList: any[] = []

export const controller = (constructor: Function) => {
  routeList.push(constructor)
}

export const routerBind = (router: any, handlers: any, route: any) =>
  handlers.filter(({filter}: { filter: any }) => filter === route.constructor.name)
          .forEach(
            (it: any) => router[it.method](
              it.path,
              async (req: Request, res: Response, next: NextFunction) =>
                route.response(res, await route[it.key](req, res, next))
            )
          )

