import { createApp, createVNode } from 'vue'

// element-plus
import ElementPlus, { ElIcon } from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'
import * as Icons from '@element-plus/icons-vue'
// import lingxiUI from '@shuke/lingxi-ui'
import './assets/fonts/iconfont.css'
import './assets/fonts/iconfont.js'
import './assets/flowFonts/iconfont.css'
// import './assets/fonts/elementuifont.css'
// global css
import './styles/index.scss'
import './styles/themes.css'

import App from './App.vue'
import router from './router'
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

const app = createApp(App)

const Icon = (props: { name: string; size: number | string; color: string }) => {
  const { name, size, color } = props
  return createVNode(
    ElIcon,
    {
      size: size || 16,
      color
    },
    () => createVNode(Icons[name as keyof typeof Icons])
  )
}

app.component('I', Icon)

app.use(ElementPlus, { locale }).use(Directives).use(router as any).use(store as any).provide('$DateFormat', DateFormat).mount('#app')

export default app
