import axios, { AxiosInstance } from 'axios'
import { RequestException, ResponseException, SettingUpRequestException } from '../exceptions/request'

interface RequestHeaders {
  [key: string]: string
}

interface RequestParams {
  [key: string]: any
}

interface RequestData {
  [key: string]: any
}

interface RequestOptions {
  headers: RequestHeaders,
  params?: RequestParams;
  data?: RequestData;
}

interface RequestInterface {
  get(url: string, options?: RequestOptions): Promise<any>

  delete(url: string, options?: RequestOptions): Promise<any>

  post(url: string, data: RequestData, options?: RequestOptions): Promise<any>

  put(url: string, data: RequestData, options?: RequestOptions): Promise<any>

  patch(url: string, data: RequestData, options?: RequestOptions): Promise<any>
}

export default class Request implements RequestInterface {
  baseURL: string
  defaultHeaders: object
  axios: AxiosInstance

  constructor(baseURL: string, defaultHeaders: object = {}) {
    this.baseURL = baseURL
    this.defaultHeaders = defaultHeaders
    this.init()
  }

  init() {
    const axiosInstance = axios.create({
                                         baseURL: this.baseURL,
                                         headers: this.defaultHeaders
                                       })
    axiosInstance.interceptors.response.use(response => response.data,
                                            (error) => {
                                              if (error.response) {
                                                return Promise.reject(
                                                  new ResponseException(error.response.data || error.response)
                                                )
                                              } else if (error.request) {
                                                return Promise.reject(new RequestException(error.request))
                                              } else {
                                                return Promise.reject(new SettingUpRequestException(error.message))
                                              }
                                            })
    this.axios = axiosInstance
  }

  async get(url: string, options?: RequestOptions): Promise<any> {
    return await this.axios.get(url, options)
  }

  async delete(url: string, options?: RequestOptions): Promise<any> {
    return await this.axios.delete(url, options)
  }

  async post(url: string, data?: RequestData, options?: RequestOptions): Promise<any> {
    return await this.axios.post(url, data, options)
  }

  async put(url: string, data?: RequestData, options?: RequestOptions): Promise<any> {
    return await this.axios.put(url, data, options)
  }

  async patch(url: string, data?: RequestData, options?: RequestOptions): Promise<any> {
    return await this.axios.patch(url, data, options)
  }

}
