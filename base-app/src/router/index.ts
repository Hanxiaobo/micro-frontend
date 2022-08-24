import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { qiankunApps, freeApps } from '../childNodes/apps'

const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/main',
    children: [
      {
        path: '/main',
        component: () => import('@/views/main/index.vue'),
        name: 'Main',
        meta: { title: '首页', icon: 'HomeFilled', affix: true }
      },
      {
        path: '/personal-center',
        component: () => import('@/views/personal-center/index.vue'),
        name: 'PersonalCenter',
        meta: { title: '个人中心', icon: 'Tools', roles: ['admin'] }
      },
      {
        path: '/404',
        component: () => import('@/views/error-page/404.vue'),
        meta: {
          title: '404'
        }
      },
      {
        path: '/401',
        component: () => import('@/views/error-page/401.vue'),
        meta: {
          title: '401'
        }
      }
    ]
  }
]

qiankunApps.forEach(item => {
  staticRoutes.push(
    {
      path: `${item.activeRule}/:name?/:id?`,
      component: () => import('@/layout/index.vue')
    }
  )
  // if (item.children) {
  //   item.children.forEach((cItem: string) => {
  //     staticRoutes.push({
  //       path: `${cItem}`,
  //       redirect: `${item.activeRule}${cItem}`
  //     })
  //   })
  // }
})
freeApps.forEach(item => {
  const child = staticRoutes[1].children || []
  child.push(
    {
      path: `${item.activeRule}`,
      component: () => import('@/views/myflow/index.vue'),
      children: []
    }
  )
  if (item.children) {
    item.children.forEach((cItem: string) => {
      const cChild = child[child.length - 1]
      const ccChid = cChild.children || []
      ccChid.push({
        path: `${item.activeRule}${cItem}`,
        component: () => import('@/views/myflow/index.vue')
      })
    })
  }
})

export const constantRoutes = staticRoutes

export const asyncRoutes = []

export const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

export default router
