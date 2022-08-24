export default {
  mounted(el: any, binding: any) {
    let wait = 500
    _handleParams(el, binding)
    el.removeEventListener('click', () => {})
    el.addEventListener('click', (e: Event) => {
      if (binding.modifiers.stop) e.stopPropagation()
      if (binding.modifiers.prev) e.preventDefault()
      const nowTime = new Date().getTime()
      if (el.callbackParams && el.callbackParams.length > 0) {
        wait = el.callbackParams[0]
        if (!el.preTime || nowTime - el.preTime > wait) {
          el.preTime = nowTime
          el.callback(...el.callbackParams.slice(1))
        }
      } else {
        if (!el.preTime || nowTime - el.preTime > wait) {
          el.preTime = nowTime
          el.callback()
        }
      }
    })
  },
  updated(el: any, binding: any) {
    _handleParams(el, binding)
  },
  unmounted(el: any) {
    el.removeEventListener('click', () => {})
  }
}

function _handleParams(el: any, binding: any) {
  el.callbackParams = []
  if (Array.isArray(binding.value)) {
    if (typeof binding.value[0] === 'function') {
      el.callback = binding.value[0]
    }
    if (binding.value.length > 1) {
      el.callbackParams = binding.value.slice(1)
    }
  } else if (typeof binding.value === 'function') {
    el.callback = binding.value
  } else {
    console.error('The v-throttle command must have a parameter function')
  }
}
