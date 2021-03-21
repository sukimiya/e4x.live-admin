import { Modal, confirm } from 'ant-design-vue'
import Vue from 'vue'
import { executeAsync, delay } from './util'

function destoryComponent (cmp) {
  cmp.$destroy()
  if (cmp.$el) {
    cmp.$el.remove()
  }
}

/**
 * 定制Confirm对话框
 * @param {string} message
 * @param {string} [title]
 * @param {*} [options]
 * @returns Promise<boolean>
 */
export function confirm (message, title) {
  return new Promise((resolve, reject) => {
    confirm.confirm({
      title: title || '提示',
      content: message,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        resolve(true)
      },
      onCancel: () => {
        resolve(false)
      }
    })
  })
}

export function showModal (opts = {}) {
  return new Promise((resolve, reject) => {
    const thisModal = new Vue({
      data () {
        return {
          show: true,
          // loading必须设置为true, 否则按确认会自动关闭无法控制！
          loading: true
        }
      },
      render: function (h) {
        return h(Modal, {
          props: {
            value: this.show,
            loading: this.loading,
            closable: opts.closable,
            'mask-closable': opts.closable,
            title: opts.title,
            width: opts.width,
            scrollable: opts.scrollable,
            'footer-hide': opts.footerHide,
            'ok-text': opts.okText,
            'cancel-text': opts.cancelText
          },
          on: {
            'on-ok': async () => {
              try {
                let res = await executeAsync.call(thisModal, opts.onOk, thisModal)
                if (res === false) {
                  return
                }
                this.show = false
                resolve(res === undefined ? true : res)
              } finally {
                // 注意: loading先设置false关闭loading的spin，再设置true防止按确认自动关闭
                this.loading = false
                this.$nextTick(() => {
                  this.loading = true
                })
              }
            },
            'on-cancel': async () => {
              await executeAsync.call(thisModal, opts.onCancel, thisModal)
              resolve(false)
            },
            'on-visible-change': (val) => {
              if (!val) {
                destoryComponent(thisModal)
              }
            }
          }
        }, opts.render ? [opts.render(h)] : [])
      }
    }).$mount()
    window.document.body.append(thisModal.$el)
  })
}

/**
 * 弹框（针对Vue组件）
 * @param {Object|String} modalOpts 弹框参数(或标题)
 * @param {Vue} VueCmp Vue组件
 * @param {Object} cmpOpts Vue组件参数，比如：{ ref: 'xxx', props: { 入参... }, on: { 事件... } }
 * @param {(ok, modal) => Promise|boolean} handler 处理方法(第一个参数是否是确认，第二参数弹框示例，可以通过$refs获取到组件示例(前提组件参数设置ref))
 */
export function showModalForVueCmp (modalOpts, VueCmp, cmpOpts, handler) {
  let title = ''
  if (typeof modalOpts === 'string') {
    title = modalOpts
    modalOpts = {}
  }
  return showModal({
    title,
    onOk: (modal) => {
      return executeAsync(handler, true, modal)
    },
    onCancel: (modal) => {
      return executeAsync(handler, false, modal)
    },
    ...modalOpts,
    render: h => h(VueCmp, cmpOpts)
  })
}

/**
 * animate.css调用封装方法
 * 参考：https://animate.style/
 * @param {Element} elem
 * @param {String} animation
 * @param {String} speed
 * @param {{keep: Boolean, timeout: Number}} opts
 */
export function animateCSS (elem, animation, speed, opts = {}) {
  const prefix = 'animate__'
  return new Promise(async (resolve, reject) => {
    if (!elem || !elem.classList) {
      resolve('fail')
      return
    }

    const animationName = `${prefix}${animation}`
    const speedName = speed ? `${prefix}${speed}` : undefined

    elem.classList.add(`${prefix}animated`, animationName, speedName)

    function handleAnimationEnd () {
      elem.removeEventListener('animationend', handleAnimationEnd)
      if (!opts.keep) {
        elem.classList.remove(`${prefix}animated`, animationName, speedName)
      }
      resolve('end')
    }
    elem.addEventListener('animationend', handleAnimationEnd)
    if (opts.timeout) {
      await delay(opts.timeout)
      resolve('timeout')
      handleAnimationEnd()
    }
  })
}
