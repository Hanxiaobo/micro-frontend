import axios from 'axios'

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
const tokenOverdueCode = 401 // token过期，重新登录
// axios.defaults.withCredentials = true
const instance = axios.create({
  baseURL: '/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const promiseFun = (method, url, params, resolve, reject) => {
  instance[method](url, params)
    .then(({ data }) => {
      if (data.flag === 'S') {
        resolve(data.data)
      } else if (data.code === tokenOverdueCode) {
        // do something
        reject({ err: data.msg, code: data.code })
      } else {
        if (data.data && data.data.length > 0) {
          console.log('error')
        } else {
          console.log('error')
        }
        const errCode = [403, 404]
        // if (errCode.indexOf(data.code) > -1) {
        //   history.push(`/${data.code}`)
        // }
        reject({ err: data.msg, code: data.code })
      }
    })
    .catch((err) => {
      const errorMsg = JSON.stringify(err)
      const status = err.response && err.response.status
      const errCode = [403, 404, 500]
      if (status === 502) {
        // history.push('/500')
        return
      }
      console.log('error')
      if (errCode.indexOf(status) > -1) {
        // history.push(`/${status}`)
      }
      reject({ err: errorMsg })
    })
}

const promiseFunInit = (method, url, params, resolve, reject) => {
  const param = isObject(params) ? { ...params } : params
  instance[method](url, param)
    .then(({ data }) => {
      resolve({
        data,
      })
    })
    .catch((err) => {
      const errorMsg = JSON.stringify(err)
      console.log('error')
      reject({
        err: errorMsg,
      })
    })
}
export default class Http {
  // 初始化拦截器
  static init() {
    // 拦截请求
    instance.interceptors.request.use((config) => config)

    // 拦截响应
    instance.interceptors.response.use((config) => config)
  }

  // get 方法封装
  static get(url, params = {}) {
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
      promiseFun('get', urlParams, {}, resolve, reject)
    })
  }

  // post 方法封装
  static post(url, params = {}) {
    return new Promise((resolve, reject) => {
      promiseFun('post', url, params, resolve, reject)
    })
  }
  // _get 方法封装(对结果未做任何处理)
  static _get(url, params = {}) {
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
  static _post(url, params = {}) {
    return new Promise((resolve, reject) => {
      promiseFun('post', url, params, resolve, reject)
    })
  }
}
