import axios from 'axios'
// import store from '~~/store'
// import { Spin } from 'view-design'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  // if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (options) {
    this.options = options || {}
    this.before = options.before
    this.callback = options.callback
    this.error = options.error
    delete options.before
    delete options.callback
    delete options.error
    this.queue = {}
  }
  getDefaultOptions () {
    const config = {
      ...this.options,
      headers: {
        ...this.options.headers
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      if (this.before) {
        this.before(config)
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      if (this.callback) {
        this.callback(res)
      }
      return res
    }, error => {
      this.destroy(url)
      if (this.error) {
        this.error(error)
      }
      let { response, config, message } = error
      if (!response) {
        response = {
          statusText: message,
          status: 0,
          request: { responseURL: config && config.url }
        }
      }
      addErrorLog(response)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    const defs = this.getDefaultOptions()
    options = Object.assign({}, defs, options, {
      headers: {
        ...defs.headers,
        ...options.headers
      }
    })
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
