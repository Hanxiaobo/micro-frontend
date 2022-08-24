import axios from 'axios'
import { ElMessage } from 'element-plus'
import { isObject } from './util'
import router from '../router/index'
// import { baseUrl } from '@/config'
import { removeNickName } from './auth'
// import { projectUrl } from '../router/configs'
const projectUrl = ''
// const successCode = 20000
const errCode: any = []
const instance: any = axios.create({
  baseURL: '/bolt_api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

const promiseFun = (method: string, url: string, params: {}, cancelToken: any, resolve: { (value: unknown): void; (value: unknown): void; (value: unknown): void; (value: unknown): void; (arg0: any): void }, reject: { (reason?: any): void; (reason?: any): void; (reason?: any): void; (reason?: any): void; (arg0: string): void }) => {
  instance[method](url, params, { cancelToken }).then(({ data }: any) => {
    if (!data.code && data.flag === 'S') {
      resolve(data.data)
    } else {
      const msg = data.msg
      if (data.code === '302') {
        removeNickName()
        location.reload()
      } else {
        if (msg) {
          ElMessage({
            type: 'error',
            message: msg
          })
        }
      }
      if (errCode.indexOf(data.code) > -1) {
        router.push(`${projectUrl}/${data.code}`)
      }
      reject({ err: msg, code: data.code })
    }
  }).catch((err: { response: { status: any } }) => {
    if (axios.isCancel(err)) {
      reject('用户取消请求')
      return
    }
    const errorMsg = JSON.stringify(err)
    const status = err.response && err.response.status
    if (status === 502) {
      router.push(`${projectUrl}/500`)
      return
    }
    if (errCode.indexOf(status) > -1) {
      router.push(`${projectUrl}/${status}`)
    }
    reject({ err: errorMsg })
  })
}

const promiseFunInit = (method: string, url: string, params: {}, resolve: { (value: unknown): void; (value: unknown): void; (arg0: { data: any }): void }, reject: { (reason?: any): void; (reason?: any): void; (arg0: { err: string }): void }) => {
  const param = isObject(params) ? { ...params } : params
  instance[method](url, param).then(({ data }: any) => {
    resolve({
      data
    })
  }).catch((err: any) => {
    const errorMsg = JSON.stringify(err)
    // message.error('无法连接服务器,请检查您的网络连接')
    reject({
      err: errorMsg
    })
  })
}
export default class Http {
  // 初始化拦截器
  static init() {
    // 拦截请求
    instance.interceptors.request.use((config: any) =>

      config)
    // 拦截响应
    instance.interceptors.response.use((config: any) => config)
  }

  // get 方法封装
  static get(url: string, params: any = {}, cancelToken: any) {
    let urlParams = ''
    if (Object.keys(params).length > 0) {
      url += url.indexOf('?') > -1 ? '' : '?'
      let paramsKey = []
      paramsKey = Object.keys(params)
      for (let key = 0; key < paramsKey.length; key++) {
        url = `${url}${paramsKey[key]}=${params[paramsKey[key]]}&`
      }
      urlParams = url.substring(0, url.length - 1)
    } else {
      urlParams = url
    }
    return new Promise((resolve, reject) => {
      promiseFun('get', urlParams, {}, cancelToken, resolve, reject)
    })
  }

  // post 方法封装
  static post(url: string, params = {}, cancelToken: any) {
    return new Promise((resolve, reject) => {
      promiseFun('post', url, params, cancelToken, resolve, reject)
    })
  }

  // put 方法封装
  static put(url: string, params = {}, cancelToken: any) {
    return new Promise((resolve, reject) => {
      promiseFun('put', url, params, cancelToken, resolve, reject)
    })
  }
  // delete 方法封装
  static delete(url: string, params = {}, cancelToken: any) {
    return new Promise((resolve, reject) => {
      promiseFun('delete', url, params, cancelToken, resolve, reject)
    })
  }
  // _get 方法封装(对结果未做任何处理)
  static _get(url: string, params: any = {}) {
    let urlParams = ''
    if (Object.keys(params).length > 0) {
      url += url.indexOf('?') > -1 ? '' : '?'
      let paramsKey = []
      paramsKey = Object.keys(params)
      for (let key = 0; key < paramsKey.length; key++) {
        url = `${url}${paramsKey[key]}=${params[paramsKey[key]]}&`
      }
      urlParams = url.substring(0, url.length - 1)
    } else {
      urlParams = url
    }
    return new Promise((resolve, reject) => {
      promiseFunInit('get', urlParams, {}, resolve, reject)
    })
  }
  // _post 方法封装(对结果未做任何处理)
  static _post(url: string, params = {}) {
    return new Promise((resolve, reject) => {
      promiseFunInit('post', url, params, resolve, reject)
    })
  }
}
