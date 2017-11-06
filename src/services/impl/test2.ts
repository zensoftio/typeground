import {TestService, TestService2} from '../index'
import {inject, injectable} from '../../annotations/di'
import BaseService from './common/base'

@injectable('TestService2')
export default class DefaultTestService2 extends BaseService implements TestService2 {
  
  private testService: TestService
  
  constructor() {
    super()
    console.log('create DefaultTestService2')
  }
  
  @inject('TestService')
  setTestService2(testService: TestService) {
    this.testService = testService
  }
  
  test2(): void {
    return
  }
}
