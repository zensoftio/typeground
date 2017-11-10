export default class HttpException {
  constructor(public status: number, public details?: any) {
  
  }
}