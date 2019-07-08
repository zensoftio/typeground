import 'reflect-metadata'
import { validate } from 'class-validator'

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

export const Attr = (options?: Function | AttributeDefinitionOptions) => (target: Object, propertyKey: string | symbol) => {
  if (!Reflect.hasMetadata(ATTRIBUTE_LIST, target)) {
    Reflect.defineMetadata(ATTRIBUTE_LIST, [], target)
  }

  const type = options instanceof Function ? options : options && options.type

  const attributeList = Reflect.getMetadata(ATTRIBUTE_LIST, target)

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
        throw new Error(`${constructor.name}::${attribute.name.toString()} is not an Array`)
      }
      return json.map((it: any) => {
        if (!attribute.generic) {
          throw new Error(`${constructor.name}::${attribute.name.toString()} has not specified type`)
        }
        return propertyResolver(
          it,
          new AttributeDefinition(attribute.generic, `${attribute.name.toString()}[]`), attribute.generic
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
        throw new Error(`${constructor.name}::${attribute.name.toString()} is not a Number`)
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
      throw new Error(`${constructor.name}::${attribute.name.toString()} is not optional field`)
    }
  }
  const checkPropertyStrategyList = strategyGenerator(checkJson, checkProperty)
  const checkPropertyStrategy = checkPropertyStrategyList[attribute.type.name] || checkPropertyStrategyList.Default
  return checkPropertyStrategy(json, attribute, constructor)
}

export const checkJson = (json: any = {}, constructor: Function) => {
  const attributeList: AttributeDefinition[] = Reflect.getMetadata(ATTRIBUTE_LIST, constructor)
  return attributeList.map(attribute => checkProperty(json[attribute.name.toString()], attribute, constructor))
}

const instantiateProperty = (json: any, attribute: AttributeDefinition, constructor: Function) => {
  if (json === null || json === undefined) {
    if (attribute.options.optional) {
      // todo: refactor this - we should not mutate arguments
      json = attribute.options.defaultValue
    } else {
      throw new Error(`${constructor.name}::${attribute.name.toString()} is not optional field`)
    }
  }
  const checkPropertyStrategyList = strategyGenerator(<any>instantiateJson, instantiateProperty)
  const checkPropertyStrategy = checkPropertyStrategyList[attribute.type.name] || checkPropertyStrategyList.Default
  return checkPropertyStrategy(json, attribute, constructor)
}

export const instantiateJson = async <T>(json: any = {}, constructor: any): Promise<T> => {
  const instance = new constructor(json)
  return validate(instance)
    .then(errors => {
      if (errors.length > 0) {
        const constraint = errors[0].constraints
        const errorMessage = Object.keys(constraint).map(key => constraint[key]).join(', ')
        console.error(`Validation failed: ${errorMessage}`)
        throw new Error(`Validation failed: ${errorMessage}`)
      }
      return instance
    })
}
