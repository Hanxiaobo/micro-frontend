import './public-path'
import { createApp } from 'vue'
// element-plus
// import ElementPlus from 'element-plus'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
import SkUI from 'sk-ui'
import 'sk-ui/lib/bundle.css'
// import 'element-plus/dist/index.css'
// import * as Icons from '@element-plus/icons-vue'

// global css
import './styles/index.scss'
import './styles/themes.css'
import './assets/fonts/iconfont.css'
import './assets/fonts/iconfont.js'

import App from './App.vue'
import { router } from './router'
import store from './store'
import Directives from './directive'

// permission control
import './permission'

// utils
import { DateFormat } from './utils/util'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

let instance: any = null

function render(props: any = {}) {
  const { container } = props
  // 当为微服务主节点情况下访问，会设置二级路径，而直接访问时没有二级路径，此处需要根据实际情况修改

  instance = createApp(App)

  instance.use(SkUI)
    .use(Directives)
    .use(router)
    .use(store)
    .provide('$DateFormat', DateFormat)
  instance.mount(container ? container.querySelector('#app') : '#app')
  // const Icon = (props: { name: string; size: number | string; color: string }) => {
  //   const { name, size, color } = props
  //   return createVNode(
  //     ElIcon,
  //     {
  //       size: size || 16,
  //       color
  //     },
  //     () => createVNode(Icons[name as keyof typeof Icons])
  //   )
  // }

  // instance.component('I', Icon)
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render()
}

export const bootstrap = async (): Promise<void> => {
  console.log('%c ', 'color: green ', 'bolt app bootstraped')
}

const storeTest = (props: any): void => {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value: any, prev: any) => {
        if (value.themes !== prev.themes) {
          store && store.dispatch(`app/setThemes`, localStorage.getItem('themes'))
          console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev)
        }
        if (value.router && value.router.startsWith('/bolt')) {
          // const arr = value.router.split('bolt')
          // router.push(arr[1])
          props.setGlobalState({ router: '' })
        }
      },
      true
    )
  // props.setGlobalState &&
  // props.setGlobalState({
  //   childApp: props.name,
  //   user: {
  //     name: props.name
  //   }
  // })
}

export const mount = async (props: any): Promise<void> => {
  storeTest(props)
  render(props)
  instance.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange
  instance.config.globalProperties.$setGlobalState = props.setGlobalState
}

export const unmount = async (): Promise<void> => {
  store.dispatch('app/initStore')
  instance.unmount()
  instance._container.innerHTML = ''
  instance = null
}
