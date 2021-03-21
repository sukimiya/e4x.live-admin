import HttpRequest from '@/libs/axios'
// import store from '@/store'
import { ApiError } from '@/libs/api.error'
import { arraybuffer2json } from './util'
const baseURL = process.env.VUE_APP_API_BASE_URL

// 创建一个错误
function createApiError (msg, dataAxios) {
  return new ApiError(msg, dataAxios)
}

const headers = {
  'Content-Type': 'application/json'
  // 'CLIENT-KEY': '1',
  // 'DEVICE-TYPE': 'WEB',
  // 'CONTENT-ENCRYPTED': '0'
}

const before = config => {
  // const token = store.state.user.token
  // if (token) {
  //   config.headers['Authorization'] = `Bearer ${token}`
  // }
  // config.headers['SEND-DATE'] = new Date().valueOf()
}

const callback = response => {
  // console.log(response)
  const { headers } = response
  const { codes = {}, responseType } = response.config

  // dataAxios 是 axios 返回数据中的 data
  const dataAxios = response.data
  let result = dataAxios

  // 下载请求（如果返回内容为json，那么认为是错误信息，对其进行解析并处理）
  if (responseType === 'arraybuffer') {
    if (headers['content-type'] !== 'application/json') {
      return dataAxios
    }

    result = arraybuffer2json(dataAxios)
  }

  // 这个状态码是和后端约定的
  const { code, message } = result
  // 根据 code 进行判断
  if (code === undefined) {
    // 如果没有 code 代表这不是项目后端开发的接口
    return dataAxios
  }

  // 状态码为0代表成功
  if (code === 0) {
    return dataAxios
  }

  // 有 code 代表这是一个后端接口 可以进行进一步的判断
  switch (code) {
    // case API_SUCCESS_CODE:
    //   // [ 示例 ] code === API_SUCCESS_CODE 代表没有错误
    //   return dataAxios
    // case 'xxx':
    //   // [ 示例 ] 其它和后台约定的 code
    //   errorCreate(`[ code: xxx ] ${dataAxios.msg}: ${response.config.url}`)
    //   break
    default:
      // 不是正确的 code
      createApiError(`${message}`, dataAxios)
      break
  }

  handleCodeError(codes[code], message, dataAxios)
  return dataAxios
}

function handleCodeError (cfg, msg, dataAxios) {
  const { pass } = cfg || {}
  if (pass || cfg === true) {
    return
  }
  if (cfg) {
    if (typeof cfg === 'string') {
      msg = cfg
    } else if (cfg.msg) {
      msg = cfg.msg
    }
  }
  throw createApiError(msg, dataAxios)
}

const error = error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 400: error.message = '请求错误'; break
      case 401: error.message = '未授权，请登录'; break
      case 403: error.message = '拒绝访问'; break
      case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
      case 408: error.message = '请求超时'; break
      case 500: error.message = '服务器内部错误'; break
      case 501: error.message = '服务未实现'; break
      case 502: error.message = '网关错误'; break
      case 503: error.message = '服务不可用'; break
      case 504: error.message = '网关超时'; break
      case 505: error.message = 'HTTP版本不受支持'; break
      default: break
    }
  } else {
    switch (error.code || error.message) {
      case 'ECONNABORTED': error.message = (error.message || '').startsWith('timeout') > -1
        // Axios message: timeout of ${timeout}ms exceeded
        ? '网络超时，请重试'
        // Axios message: Request aborted
        : '网络中断，请重试'; break
      case 'Network Error': error.message = '网络异常，请检查网络是否正常后，再重试'; break
      default: break
    }
  }
  return Promise.reject(error)
}

const axios = new HttpRequest({
  baseURL,
  headers,
  before,
  callback,
  error
})

/**
 * 解析响应头(Content-Disposition)获取文件名
 * @param {*} resOrHeaders
 */
export function parseFilenameFromHeader (resOrHeaders = {}) {
  const cd = (resOrHeaders['headers'] || resOrHeaders)['content-disposition']
  return cd ? decodeURI(cd.match(/filename=(.*)/)[1]) : null
}

export function request (method, url, data, opts) {
  return axios.request({
    ...opts,
    url: url,
    method: method || 'get',
    data
  })
}

export function requestApi (method, url, data, opts) {
  return request(method, url, data, opts).then(r => r.data)
}

export function postApi (url, data, opts) {
  return requestApi('post', url, data, opts)
}

export function getApi (url, query, opts) {
  return requestApi('get', url, null, {
    params: query,
    ...opts
  })
}

export function putApi (url, data, opts) {
  return requestApi('put', url, data, opts)
}

export function delApi (url, data, opts) {
  return requestApi('delete', url, data, opts)
}

export function requestArrayBuffer (method, url, data, opts) {
  return request(method, url, data, {
    ...opts,
    responseType: 'arraybuffer'
  })
}

export function downloadBlob (blob, filename) {
  // 兼容IE浏览器
  if (navigator && typeof navigator.msSaveBlob !== 'undefined') {
    navigator.msSaveBlob(blob, filename)
    return
  }
  // 创建新的URL并指向File对象或者Blob对象的地址
  const url = URL.createObjectURL(blob)
  // 创建a标签，用于跳转至下载链接
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)
  // 兼容：某些浏览器不支持HTML5的download属性
  if (typeof link.download === 'undefined') {
    link.setAttribute('target', '_blank')
  }
  // 挂载a标签
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // 释放
  URL.revokeObjectURL(url)
}
/**
 * 转义字符
 * @param {String} str
 */
export function checkParam (str) {
  if (str.indexOf('_') !== -1) {
    return str.replace(/_/g, '/_')
  }
  return str
}
/**
 * 请求下载
 * @param {String} method
 * @param {String} url
 * @param {*} data
 * @param {*} opts
 * @param {String} filename
 */
export async function requestDownload (method, url, data, opts, filename) {
  const res = await requestArrayBuffer(method, url, data, opts)
  filename = parseFilenameFromHeader(res) || filename || 'download'
  downloadBlob(new Blob([res.data], { type: res.headers['content-type'] }), filename)
}

export function getApiResultSuccess () {
  return { code: 0 }
}

export default axios
