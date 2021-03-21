/**
 * 生成枚举(类似Typescript的枚举用法)
 * @template T
 * @param {T} enumObj
 * @returns T
 */
export function createEnum (enumObj) {
  if (typeof enumObj !== 'object') return enumObj
  Object.keys(enumObj).forEach(prop => {
    enumObj[enumObj[prop]] = prop
  })
  return enumObj
}

/**
 * @typedef {(node:any) => string} F
 * @param {{id?:F ,label?:F, children?:F}} map
 */
export function createTreeSelectNormalizer (map = {}) {
  return (node) => {
    node = {
      id: map.id ? map.id(node) : node.id,
      label: map.label ? map.label(node) : node.label || node.name,
      children: map.children ? map.children(node) : node.children
    }
    if (node.children && !node.children.length) {
      delete node.children
    }
    return node
  }
}

/**
 * 判断传入参数是否是PromiseLike对象
 * 代码来自： https://github.com/then/is-promise/blob/master/index.js
 * @param {*} obj
 * @returns {boolean}
 */
export function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

/**
 * 转成Promise对象(如果已是Promise则不变)
 * @param {*} obj
 * @returns {PromiseLike<*>}
 */
export function toPromise (obj) {
  return isPromise(obj) ? obj : Promise.resolve(obj)
}

/**
 * 判断传入参数是否是方法
 * @param {*} func
 * @returns {boolean}
 */
export function isFunc (func) {
  return typeof func === 'function'
}

/**
 * 执行异步方法(非方法正常返回)
 * @param {*} method
 * @returns {Promise<any>}
 */
export function executeAsync (method) {
  if (!isFunc(method)) return Promise.resolve(method)
  return toPromise(method.apply(this, Array.prototype.slice.call(arguments, 1)))
}

/**
 * 延时等待(毫秒)
 * @param {Number} ms
 * @returns {Promise}
 */
export function delay (ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

/**
 * 获取值(如果传入参数是方法那么执行方法，否则返回传入参数)
 * @param {*} valOrFunc
 */
export function getValueOrExecFunc (valOrFunc, ...args) {
  return isFunc(valOrFunc) ? valOrFunc.apply(this, args) : valOrFunc
}

/**
 * 设置数组(传入参数替换数组内容)
 * @param {*} array
 * @param  {...any} items
 */
export function setArray (array, ...items) {
  array.splice(0, array.length, ...items)
}

/**
 * Blob对象转换成JSON对象
 * @param {Blob} blob
 */
export function blob2json (blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    // 成功回调
    reader.onload = ({ target: result }) => resolve(JSON.parse(result))
    // 失败回调
    reader.onerror = err => reject(err)
    reader.readAsText(blob)
  })
}

/**
 * ArrayBuffer对象转换成JSON对象
 * @param {ArrayBuffer} buffer
 */
export function arraybuffer2json (buffer) {
  var enc = new TextDecoder('utf-8')
  // 转化成json对象
  return JSON.parse(enc.decode(new Uint8Array(buffer)))
}

export function toFormData (form) {
  const formData = new FormData()
  Object.keys(form).forEach(key => formData.set(key, form[key]))
  return formData
}

export function verfyUndefined (obj) {
  if (obj === 'undefined' || obj === undefined || obj === null) {
    return null
  }
  return obj
}

export function setObjPorperty (obj, name, value, reqired = true) {
  if (verfyUndefined(value) !== null) {
    obj[name] = value
  } else if (reqired) {
    obj[name] = ''
  }
}

export function toURLParams (url, data) {
  let res = url
  let first = true
  for (let att in data) {
    if (verfyUndefined(data[att]) !== null) {
      if (first) {
        res = res + '?' + att + '=' + data[att]
        first = false
      } else {
        res = res + '&' + att + '=' + data[att]
      }
    }
  }
  return res
}

export function getRandomColor (alpha = 0.5) {
  let r = parseInt(Math.random() * 256)
  let g = parseInt(Math.random() * 256)
  let b = parseInt(Math.random() * 256)
  let a = parseInt(256 * alpha)
  if (alpha === 1.0) {
    return '#' + r.toString(16) + '' + g.toString(16) + '' + b.toString(16)
  } else {
    return '#' + r.toString(16) + '' + g.toString(16) + '' + b.toString(16) + '' + a.toString(16)
  }
}
/**
 * item:
 *  id: 标识符
 *  pid: 父id
 *  label: 标签
 * @param {*} data
 * @param {*} pid
 * @returns [] 树状数组
 */
export const mapTreeNodes = (data, pid) => {
  let result = []
  let temp = null
  for (let i = 0; i < data.length; i++) {
    if (data[i].pid === pid) {
      let obj = { label: data[i].label, id: data[i].id }
      temp = mapTreeNodes(data, obj.id)
      if (temp && temp.length > 0) {
        obj.children = temp
      }
      result.push(obj)
    }
  }
  return result
}
/**
 * digital formatter
 * @param {*} val 一个数字
 * @returns String
 */
export const formatter = (val) => {
  const n = val.toString().split('').reverse()
  const segs = []
  while (n.length) segs.push(n.splice(0, 3).join(''))
  return segs.join(',').split('').reverse().join('')
}
