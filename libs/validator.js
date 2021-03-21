export const mobileValidator = (rule, value, callback) => {
  if (!/^1[34578]\d{9}$/.test(value)) {
    return callback(new Error('手机号格式不正确'))
  } else {
    return callback()
  }
}

/**
 * 车辆VIN码校验
 * @param {} rule
 * @param {*} value
 * @param {*} callback
 */
export const vinValidator = (rule, value, callback) => {
  // TODO: VIN码校验正则表达式不够严谨，需要完善
  if (!/[a-zA-Z0-9]$/.test(value)) {
    return callback(new Error('只允许英文大写字母、数字'))
  } else {
    return callback()
  }
}
/**
 * URL校验
 * @param {} rule
 * @param {*} value
 * @param {*} callback
 */
export const urlValidator = (rule, value, callback) => {
  console.info('urlValidator')
  const urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\\/?%&=]*)?/
  console.info('urlValidator::', urlReg)
  if (urlReg.test(value)) {
    return callback(new Error('网址格式不正确'))
  }
  return callback()
}
