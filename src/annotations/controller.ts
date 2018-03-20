import 'reflect-metadata'
import {NextFunction, Request, Response, Router} from 'express'
import {Component} from './di'
import Controller from '../controllers/common'

const HANDLER_LIST = Symbol('handler_list')
const BASE_PATH = Symbol('base_path')

const mapping = (method: string) => (path: string) => (target: any, key: string) => {
  if (!Reflect.hasMetadata(HANDLER_LIST, target)) {
    Reflect.defineMetadata(HANDLER_LIST, [], target)
  }
  const basePath = Reflect.getMetadata(BASE_PATH, target) || ''
  const handlerList = Reflect.getMetadata(HANDLER_LIST, target)
  handlerList.push({path: `${basePath}${path}`, key, method, filter: target.constructor.name})
}

const RequestMapping = (path: string) => (target: any) => {
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

export const routerBind = (router: any, controller: Controller) =>
  Reflect.getMetadata(HANDLER_LIST, controller)
         .filter(({filter}: { filter: any }) => filter === controller.constructor.name)
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

