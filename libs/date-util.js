import dayjs from 'dayjs'

/**
 * 获取Api表示Date的数值
 * @param {Number|String|Date} val
 * @param {Number=} defVal
 */
export function dateValueOfApi (val, defVal) {
  const d = dayjs(val)
  return d.isValid() ? d.valueOf() / 1000 : defVal
}

function toDayjsFromApi (val) {
  return dayjs(typeof val === 'number'
    ? val * 1000
    : val)
}

/**
 * 获取Date类型(转换API数值)
 * @param {Number|String|Date} val
 * @param {Date=} defVal
 */
export function toDateFromApi (val, defVal) {
  const d = toDayjsFromApi(val)
  return d.isValid() ? d.toDate() : defVal
}

/**
 * 格式化日期输出日期格式
 * @param {Number|String|Date} val
 * @param {String=} format
 */
export function formatDate (val, format = 'YYYY-MM-DD') {
  const d = toDayjsFromApi(val)
  return d.isValid() ? d.format(format) : ''
}

/**
 * 格式化日期输出日期时间格式
 * @param {Number|String|Date} val
 * @param {String=} format
 */
export function formatDateTime (val, format = 'YYYY-MM-DD HH:mm:ss') {
  return formatDate(val, format)
}

/**
 * 字符转日期
 * @param {String} val
 * @returns {Date}
 */
export function String2Date (val) {
  if (val === null) {
    return null
  }
  let str = val.replace(/-/g, '/')
  return new Date(str)
}
