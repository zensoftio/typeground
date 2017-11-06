import 'reflect-metadata'
import {useFactory} from 'di-typescript'

interface Constructor {
  new (): any
}

const injectionList: Map<string, Constructor> = new Map()

export const i = (inter: string) => (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
  useFactory(
    () => {
      const constructor = injectionList.get(inter)
      if (!constructor) {
        throw new Error(`There is no implementation for ${inter}`)
      }
      return new constructor()
    }
  )(target, propertyKey, parameterIndex)
}

export const injectable = (inter: string) => (constructor: Constructor) => {
  injectionList.set(inter, constructor)
}