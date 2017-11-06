import {TestService, TestService2} from '../index'
import {inject, injectable} from '../../annotations/di'
import BaseService from './common/base'

@injectable('TestService')
export default class DefaultTestService extends BaseService implements TestService {
  
  private testService2: TestService2
  
  constructor() {
    super()
    console.log('create DefaultTestService')
  }
  
  @inject('TestService2')
  setTestService2(testService2: TestService2) {
    this.testService2 = testService2
  }
  
  test(): void {
    return this.testService2.test2()
  }
}
