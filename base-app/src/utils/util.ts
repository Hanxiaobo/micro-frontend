const getQueryStringByName = function (name: string) {
  var result = location.search.match(new RegExp('[?&]' + name + '=([^&]+)', 'i'))
  if (result == null || result.length < 1) {
    return ''
  }
  return result[1]
}

const transformData = function (data: any) {
  const params = new FormData()
  for (const item in data) {
    params.append(item, data[item])
  }
  return params
}

const DateFormat = function (date: any, fmt: string) {
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss'
  if (date === null || typeof date === 'undefined' || date === '') {
    return null
  } else {
    // 时间要转成obj，否则报错
    date = new Date(date)
  }
  var o: any = {
    'M+': date.getMonth() + 1, // 月
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return fmt
}

const isObject = function (obj: object) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
const isNullOrEmpty = function (obj: any) {
  const result = (obj == null || obj === 'null' || obj === undefined || obj === 'undefined' || typeof obj === 'undefined' || obj === '' || JSON.stringify(obj) === '{}' || JSON.stringify(obj) === '[]')
  if (result && (obj !== 0 || obj !== '0')) {
    return result
  }
  return false
}
// const notifier = require('node-notifier')
// const notify = function (obj: any) {
//   notifier.notify(
//     {
//       title: 'My awesome title' + obj,
//       message: 'Hello from node, Mr. User!',
//       sound: true, // Only Notification Center or Windows Toasters
//       wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
//     }
//   )
// }

const isInLastThreeDays = (d: any) => {
  let td: any = new Date()
  td = new Date(td.getFullYear(), td.getMonth(), td.getDate())
  let od: any = new Date(d)
  od = new Date(od.getFullYear(), od.getMonth(), od.getDate())
  const xc: any = (od - td) / 1000 / 60 / 60 / 24
  if (xc < -2) {
    return false
  } else if (xc < -1) {
    return true
  } else if (xc < 0) {
    return true
  } else if (xc === 0) {
    return true
  } else if (xc < 2) {
    return false
  } else if (xc < 3) {
    return false
  } else {
    return false
  }
}

const envFn = () => {
  let env = 'test'
  const isProd = window.location.hostname === 'aaaa.com'
  const isDev = window.location.hostname === 'bbb.net'
  if (isDev) {
    env = 'uat'
  }
  if (isProd) {
    env = 'prod'
  }
  return env
}

export { getQueryStringByName, transformData, DateFormat, isObject, isInLastThreeDays, isNullOrEmpty, envFn }
