import 'reflect-metadata'

const ATTRIBUTE_LIST = Symbol('attribute_list')

interface AttributeDefinitionOptions {
  type?: Function
  optional?: boolean
  defaultValue?: any
}

class AttributeDefinition {
  constructor(public type: Function,
              public name: string | symbol,
              public generic?: Function,
              public options: AttributeDefinitionOptions = {}) {
  }
}

export const attr = (options?: Function | AttributeDefinitionOptions) => (target: Object, propertyKey: string | symbol) => {
  if (!Reflect.get(target, ATTRIBUTE_LIST)) {
    Reflect.set(target, ATTRIBUTE_LIST, [])
  }

  const type = options instanceof Function ? options : options && options.type

  const attributeList = Reflect.get(target, ATTRIBUTE_LIST)

  attributeList.push(new AttributeDefinition(
    Reflect.getMetadata('design:type', target, propertyKey),
    propertyKey,
    type,
    options instanceof Function ? undefined : options
  ))
}

interface StrategyList {
  [key: string]: (json: any, attribute: AttributeDefinition, constructor: Function) => void
}

const strategyGenerator = (entityResolver: (json: any, constructor: Function) => any,
                           propertyResolver: (json: any, attribute: AttributeDefinition, constructor: Function) => any): StrategyList => {
  return {
    Array: (json: any, attribute: AttributeDefinition, constructor: Function) => {
      if (!(json instanceof Array)) {
        throw new Error(`${constructor.name}::${attribute.name} is not an Array`)
      }
      return json.map((it: any) => {
        if (!attribute.generic) {
          throw new Error(`${constructor.name}::${attribute.name} has not specified type`)
        }
        return propertyResolver(
          it,
          new AttributeDefinition(attribute.generic, `${attribute.name}[]`), attribute.generic
        )
      })
    },

    Boolean: (json: any, attribute: AttributeDefinition) =>
      (json instanceof String) ? attribute.type(json === 'true') : attribute.type(json),

    String: (json: any, attribute: AttributeDefinition) => attribute.type(json),

    Object: (json: any, attribute: AttributeDefinition) => attribute.type(json),

    Number: (json: any, attribute: AttributeDefinition, constructor: Function) => {
      const number = attribute.type(json)
      if (Number.isNaN(number)) {
        throw new Error(`${constructor.name}::${attribute.name} is not a Number`)
      }
      return number
    },

    Default: (json: any, attribute: AttributeDefinition) => entityResolver(json, attribute.type)
  }
}

const checkProperty = (json: any, attribute: AttributeDefinition, constructor: Function) => {
  if (json === null || json === undefined) {
    if (attribute.options.optional) {
      // todo: refactor this - we should not mutate arguments
      json = attribute.options.defaultValue
    } else {
      throw new Error(`${constructor.name}::${attribute.name} is not optional field`)
    }
  }
  const checkPropertyStrategyList = strategyGenerator(checkJson, checkProperty)
  const checkPropertyStrategy = checkPropertyStrategyList[attribute.type.name] || checkPropertyStrategyList.Default
  return checkPropertyStrategy(json, attribute, constructor)
}

export const checkJson = (json: any = {}, constructor: Function) => {
  const attributeList: AttributeDefinition[] = Reflect.get(constructor.prototype, ATTRIBUTE_LIST)
  return attributeList.map(attribute => checkProperty(json[attribute.name], attribute, constructor))
}

const instantiateProperty = (json: any, attribute: AttributeDefinition, constructor: Function) => {
  if (json === null || json === undefined) {
    if (attribute.options.optional) {
      // todo: refactor this - we should not mutate arguments
      json = attribute.options.defaultValue
    } else {
      throw new Error(`${constructor.name}::${attribute.name} is not optional field`)
    }
  }
  const checkPropertyStrategyList = strategyGenerator(<any>instantiateJson, instantiateProperty)
  const checkPropertyStrategy = checkPropertyStrategyList[attribute.type.name] || checkPropertyStrategyList.Default
  return checkPropertyStrategy(json, attribute, constructor)
}

export const instantiateJson = <T>(json: any = {}, constructor: any): T => {
  const attributeList: AttributeDefinition[] = Reflect.get(constructor.prototype, ATTRIBUTE_LIST)
  const instance = new constructor()
  attributeList.forEach(
    attribute => instance[attribute.name] = instantiateProperty(json[attribute.name], attribute, constructor)
  )
  return instance
}
