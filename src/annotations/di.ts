import 'reflect-metadata'

interface Constructor {
  new (): any
}

export const injectionList: Map<string, Constructor> = new Map()

export const injectorList: Function[] = []

export const injectable = (qualifier: string) => (constructor: any) => {
  injectionList.set(qualifier, new constructor())
}

export const inject = (qualifier: string) => (target: any, propertyKey: string | symbol) => {
  if (target[propertyKey]) {
    injectorList.push(() => target[propertyKey](injectionList.get(qualifier)))
  }
}
