import { Transaction } from 'typeorm'

const IS_TEST = typeof process.env.IS_TEST === 'string' ? process.env.IS_TEST === 'true' : process.env.IS_TEST

export const Transactional = (connectionName?: string) => (target: any, key: string, descriptor: any): any => {
  return !IS_TEST ? Transaction(connectionName)(target, key, descriptor) : (() => () => target[key]) as any
}
