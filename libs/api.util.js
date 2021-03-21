import { message } from 'ant-design-vue'
import { confirm } from './ui-util'
import { executeAsync } from './util'

export const API_SUCCESS_CODE = 0
export const API_ERROR_CODE = -1
export const API_TOKEN_NOT_VALID_ERROR = '020001'

/**
 * 执行API
 * @async
 * @param {string} actionName
 * @param {() => Promise<T>} executor
 * @param {{showSuccessMsg:boolean, successMsg:string, success: {(result : T) => T | any}, fail: {(error: any) => T | any}, showFailureMsg:boolean, failureMsg:string}} opts
 * @returns {Promise<T>}
 */
export async function executeApi (actionName, executor, opts = {}) {
  opts = Object.assign({
    success: undefined,
    showSuccessMsg: opts.successMsg !== undefined,
    successMsg: `${actionName}成功`,
    fail: undefined,
    showFailureMsg: true,
    failureMsg: `${actionName}失败`
  }, opts)
  try {
    let res = await executeAsync(executor)
    try {
      if (opts.success === undefined) {
        return res
      }
      return await executeAsync(opts.success, res)
    } finally {
      if (opts.showSuccessMsg) {
        message.success({
          content: opts.successMsg,
          type: 'success',
          duration: 2
        })
      }
    }
  } catch (err) {
    try {
      if (opts.fail === undefined) {
        throw err
      }
      return await executeAsync(opts.fail, err)
    } finally {
      if (opts.showFailureMsg) {
        handleApiError(opts.failureMsg, err)
      }
    }
  }
}

/**
 * 执行Api查询通用逻辑
 * @param {string} target
 * @param {(any, number, number)=>Promise} queryApi
 * @param {object} query
 * @param {{currentPage:number, pageSize:number, total:number}} paging
 * @param {boolean} resetPaging
 */
export async function executeQueryPage (target, queryApi, query, paging, resetPaging) {
  const { currentPage, pageSize } = paging
  const pageNum = resetPaging ? 1 : currentPage
  const res = await executeApi(
    `获取${target}列表`,
    queryApi({
      ...query,
      page: pageNum,
      rows: pageSize
    }), { success: res => res.data, fail: null })
  if (!res) return null
  const records = res.rows || findArrayPropVal(res) || []
  paging.total = res.total || records.length
  paging.currentPage = res.page || pageNum
  return records
}

/**
 * 查找对象上是数组的属性值
 * @param {*} obj
 */
function findArrayPropVal (obj) {
  return Object.values(obj).find(v => v && v.length !== undefined)
}

export function executeQuery (target, queryApi, query) {
  return executeApi(
    `获取${target}列表`,
    typeof queryApi === 'function' ? queryApi(query) : queryApi, { success: res => res.data, fail: null }
  )
}

// export async function executeSave (target, saveApi, data, form) {
//   if (form && form.validate) {
//     let valid = await form.validate()
//     if (!valid) return false
//   }
//   return executeApi(`保存${target}`, saveApi(data), true, false, {
//     showSuccessMsg: true
//   })
// }

/**
 * 执行Api删除通用逻辑
 * @param {string} target
 * @param {(...any) => Promise} apiFunc
 * @param  {string|number} id
 */
export async function executeDelete (target, apiFunc, id) {
  const actionName = '删除'
  // 确认
  let confirmed = await confirm(`您确定要${actionName} ${target} 吗? `, '删除确认')
  if (!confirmed) return false
  // 执行
  let deleted = await executeApi(
    actionName + target,
    apiFunc(id),
    { success: ({ code }) => code === 0, fail: false }
  )
  return !!deleted
}

function handleApiError (msg, err) {
  let innerMsg = null
  if (err instanceof Error) {
    innerMsg = err.message
    if (err.name === 'ApiError' && err.data) {
      innerMsg = err.data.msg || innerMsg
      if (err.data.code === API_TOKEN_NOT_VALID_ERROR) {
        // TODO: 注销登录
        // context.$message.error('登录信息已失效，需重新登录系统', { duration: 10 * 1000 })
        // context.$store.dispatch('d2admin/account/logout', {
        //   confirm: false
        // })
        return
      }
    }
  }
  message.error({
    content: innerMsg ? `${msg}:${innerMsg}` : msg,
    duration: 5
  })
}
