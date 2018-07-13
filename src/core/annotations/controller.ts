import 'reflect-metadata'
import {NextFunction, Request, Response, Router} from 'express'
import {Component} from './di'
import Controller from '../controller/index'
import {instantiateJson} from './entity'

const HANDLER_LIST = Symbol('handler_list')
const BASE_PATH = Symbol('base_path')
const PATH_VARIABLES = Symbol('path_variables')
const REQUEST_PARAM = Symbol('request_param')
const REQUEST_BODY = Symbol('request_body')

const mapping = (method: string) => (path: string) => (target: any, key: string) => {
  if (!Reflect.hasMetadata(HANDLER_LIST, target)) {
    Reflect.defineMetadata(HANDLER_LIST, [], target)
  }
  const basePath = Reflect.getMetadata(BASE_PATH, target) || ''
  const handlerList = Reflect.getMetadata(HANDLER_LIST, target)
  handlerList.push({path: `${basePath}${path}`, key, method, filter: target.constructor.name})
}

export const RequestMapping = (path: string) => (target: any) => {
  Reflect.defineMetadata(BASE_PATH, path, target)
}

export const GetMapping = mapping('get')

export const PostMapping = mapping('post')

export const PutMapping = mapping('put')

export const DeleteMapping = mapping('delete')

export const PatchMapping = mapping('patch')

export const OptionsMapping = mapping('options')

export const HeadMapping = mapping('head')

export const AllMapping = mapping('all')

export const router = Router()

export const RestController = Component

interface Parameter {
  field: string
  method: string | symbol
  index: number
  type: 'body' | 'params' | 'query'
  constructor: Function
}

const parameterStrategyMap = {
  body: (parameter: Parameter, req: Request) => {
    return instantiateJson(req.body, parameter.constructor)
  },
  params: (parameter: Parameter, req: Request) => {
    return parameter.constructor(req.params[parameter.field])
  },
  query: (parameter: Parameter, req: Request) => {
    return parameter.constructor(req.body[parameter.field] || req.query[parameter.field])
  }
}

const parameterStrategy = (parameter: Parameter, req: Request) => {
  return parameterStrategyMap[parameter.type](parameter, req)
}

const getArgsFromMetadata = (controller: Controller) => {
  const metadataParams: Parameter[] = Reflect.getMetadata(REQUEST_PARAM, controller) || []
  const metadataBody: Parameter[] = Reflect.getMetadata(REQUEST_BODY, controller) || []
  const metadataPath: Parameter[] = Reflect.getMetadata(PATH_VARIABLES, controller) || []
  return ([] as Parameter[]).concat(metadataBody, metadataParams, metadataPath)
                            .sort(((a, b) => a.index < b.index ? -1 : 1))
}

export const routerBind = (router: any, controller: Controller) =>
  Reflect.getMetadata(HANDLER_LIST, controller)
         .filter(({filter}: { filter: any }) => filter === controller.constructor.name)
         .forEach(
           (it: any) => router[it.method](
             it.path,
             async (req: Request, res: Response, next: NextFunction) => {
               try {
                 const metadata = getArgsFromMetadata(controller)
                 const args = metadata.filter(({ method }) => method === it.key)
                                      .map((it: Parameter) => parameterStrategy(it, req))
                 controller.response(res, await (controller as any)[it.key].bind(controller)(...args))
               } catch (e) {
                 controller.error(res, controller.errorHandler(e))
               }
             }
           )
         )

const argAnnotation = (key: symbol, type: 'body' | 'params' | 'query') =>
  (field: string, constructor: Function) => (target: Object, method: string | symbol, index: number) => {
    if (!Reflect.getMetadata(key, target)) {
      Reflect.defineMetadata(key, [], target)
    }
    const metadata: Parameter[] = Reflect.getMetadata(key, target)
    metadata.push({field, method, index, type, constructor})
  }

export const RequestParam = argAnnotation(REQUEST_PARAM, 'query')

export const PathVariable = argAnnotation(PATH_VARIABLES, 'params')

export const RequestBody = (constructor: Function) => (target: Object, method: string | symbol, index: number) => {
  if (!Reflect.getMetadata(REQUEST_BODY, target)) {
    Reflect.defineMetadata(REQUEST_BODY, [], target)
  }
  const metadata: Parameter[] = Reflect.getMetadata(REQUEST_BODY, target)
  metadata.push({field: '', method, index, type: 'body', constructor})
}
