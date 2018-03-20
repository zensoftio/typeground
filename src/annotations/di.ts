import 'reflect-metadata'

export const injectionList: Map<string, any> = new Map()

export const injectorList: Function[] = []

const InjectionFabric = (qualifier: string, constructor: any) => {
  injectionList.set(qualifier, new constructor())
}

export const ComponentByName = (qualifier: string) => (constructor: any) => InjectionFabric(qualifier, constructor)

export const Component = (constructor: any) => InjectionFabric(constructor.name, constructor)

export const Autowired = (qualifier: string) => (target: any, propertyKey: string | symbol) => {
  if (target[propertyKey]) {
    injectorList.push(() => target[propertyKey](injectionList.get(qualifier)))
  }
}
