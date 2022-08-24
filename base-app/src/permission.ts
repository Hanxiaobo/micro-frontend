import { configure, start, done } from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { ElMessageBox } from 'element-plus'
import store from '@/store'
import router from './router'
// import { getToken, getRoles } from './utils/auth'
import { getNickName, getUrl } from './utils/auth' // get token from cookie
import getPageTitle from './utils/get-page-title'
import { isNullOrEmpty } from './utils/util'
import apps from './childNodes/apps'

const systemMap: any = { // 上报uv pv
  dam: 'dam',
  bolt: 'bolt',
  indicator: 'indicator',
  myflow: 'myflow',
  dds: 'dds'
}
const timer: any = null
configure({ showSpinner: false }) // NProgress Configuration
const childPath = apps.map(app => app.activeRule)
const whiteList = ['/main', '/404'] // no redirect whitelist
router.beforeEach(async (to: any, from: any, next: any) => {
  console.log('beforeEach: from  主应用', from, to)
  start()
  if (history.state && isNullOrEmpty(history.state.current)) { // 处理子应用低版本vue-router跳转报错问题
    Object.assign(history.state, { current: from.fullPath })
  }
  const routes = router.getRoutes().filter((r) => r.path === to.path)
  const isChildApp = childPath.some(item => to.path.startsWith(item))
  // const hasToken = getNickName()
  const hasToken = true

  if (hasToken) { // 已登录
    // if (!store.state.app.menuList) { // 如果menuList为null
    //   await store.dispatch('app/getApps') // 获取菜单
    // }
    const roles = store.state.app.menuList || []
    if (roles.length === 0) { // 用户没有任何应用权限
      if (to.path !== '/main') {
        next({ path: '/main' })
      } else {
        ElMessageBox({
          type: 'info',
          message: `您还没有平台的访问权限，开通权限请发送邮件到
          <a style="color: #00B85C" href="mailto:111?subject=平台权限申请">1111(点击发送)</a>，并抄送领导确认`,
          showConfirmButton: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          cancelButtonText: '取消',
          cancelButtonClass: 'cancelButtonClass'
        })
        done()
      }
    }
    // set page title
    document.title = getPageTitle(to.meta.title)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      done()
    } else {
      // const roles = getRoles()
      if (routes.length || isChildApp) {
        // Permission filtering
        const toRoute: any = routes[0]
        if (isChildApp || toRoute.meta) { // 上报pv uv
          // if (timer) { clearTimeout(timer) }
          // timer = setTimeout(() => {
          //   const pathArr = to.fullPath.split('/')
          //   if (systemMap[pathArr[1]] && pathArr[2]) { // 子应用
          //     console.log(`%cPV上报：${systemMap[pathArr[1]]}`, 'color: blue')
          //     store.dispatch('app/accessLog', { system: systemMap[pathArr[1]], url: to.fullPath })
          //   } else if (!systemMap[pathArr[1]]) {
          //     console.log(`%cPV上报：kael`, 'color: blue')
          //     store.dispatch('app/accessLog', { system: 'kael', url: to.fullPath })
          //   }
          // }, 200)

          next()
        } else {
          next('/401')
        }
      } else {
        // Otherwise jump to 404
        next('/404')
      }
    }
  } else {
    /* has no token*/
    if (whiteList.includes(to.path)) {
      // in the free login whitelist, go directly
      next()
    } else {
      // await store.dispatch('user/login').then(() => {
      //   next({ path: to.path })
      //   done()
      // })
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  done()
})

