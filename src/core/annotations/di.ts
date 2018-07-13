import 'reflect-metadata'
import { getCustomRepository } from 'typeorm'

const DEFAULT_INITIALIZER = (constructor: any): any => new constructor()

export const injectionList: Map<string, any> = new Map()

export const injectorList: Function[] = []

const InjectionFabric = (qualifier: string, constructor: any, initializer = DEFAULT_INITIALIZER) => {
  injectionList.set(qualifier, initializer(constructor))
}

export const ComponentByName = (qualifier: string, initializer = DEFAULT_INITIALIZER) =>
  (constructor: any) => InjectionFabric(qualifier, constructor, initializer)

export const RepositoryByName = (qualifier: string) =>
  (constructor: any) => InjectionFabric(qualifier, constructor, getCustomRepository as any)

export const Component = (constructor: any, initializer = DEFAULT_INITIALIZER) =>
  InjectionFabric(constructor.name, constructor, initializer)

export const Autowired = (qualifier: string) => (target: any, propertyKey: string | symbol) => {
  if (target[propertyKey]) {
    injectorList.push(() => target[propertyKey](injectionList.get(qualifier)))
  }
}
