import { message } from "ant-design-vue"

export class ApiError extends Error {
  constructor (message, data) {
    super(message)
    this.name = 'ApiError'
    this.data = data
  }
}

function showErrorMessage (msg) {
  message.error({
    content: msg,
    duration: 5
  })
}

export function handleApiError (err, handler) {
  let message = err
  if (err instanceof Error) {
    message = err.message
    if (err.name === 'ApiError') {
      if (handler) {
        if (handler(err) === true) {
          return
        }
      }
      message = err.data.msg || err.message
    }
  }
  showErrorMessage(message)
}

export function handleError (err) {
  handleApiError(err)
}
