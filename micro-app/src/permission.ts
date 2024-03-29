import { configure, start, done } from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import router from './router'
// import store from '@/store'
import { getRoles } from './utils/auth' // get token from cookie
import getPageTitle from './utils/get-page-title'

configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login', '/dataQuery'] // no redirect whitelist

router.beforeEach(async (to: any, from: any, next) => {
  console.log('beforeEach: from', from)
  // start progress bar
  start()
  document.title = getPageTitle(to.meta.title)
  if (to.path === '/login') {
    // if is logged in, redirect to the home page
    next({ path: '/' })
    done()
  } else {
    // store.dispatch('user/queryMenu')
    const roles = getRoles()
    const routes = router.getRoutes().filter((r) => r.path === to.path)
    console.log(router.getRoutes(), 'routes')
    if (routes.length) {
      // Permission filtering
      const toRoute: any = routes[0]
      if ((toRoute.meta && !toRoute.meta.roles) || (toRoute.meta && toRoute.meta.roles.includes(roles))) {
        next()
      } else {
        next('/401')
      }
    } else {
      // Otherwise jump to 404
      next('/404')
    }
  }
  // determine whether the user has logged in
  // const hasToken = getToken()
  // if (hasToken) {
  //   // set page title
  //   document.title = getPageTitle(to.meta.title)
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     done()
  //   } else {
  //     const roles = getRoles()
  //     const routes = router.getRoutes().filter((r) => r.path === to.path)
  //     if (routes.length) {
  //       // Permission filtering
  //       const toRoute: any = routes[0]
  //       if ((toRoute.meta && !toRoute.meta.roles) || (toRoute.meta && toRoute.meta.roles.includes(roles))) {
  //         next()
  //       } else {
  //         next('/401')
  //       }
  //     } else {
  //       // Otherwise jump to 404
  //       next('/404')
  //     }
  //   }
  // } else {
  //   /* has no token*/
  //   if (whiteList.includes(to.path)) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next('/login')
  //     done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  done()
})
