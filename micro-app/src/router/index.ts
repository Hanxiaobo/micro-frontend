import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
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
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dataQuery',
    children: [
      {
        path: '/dataQuery',
        component: () => import('@/views/data-query/index.vue'),
        name: 'Home',
        meta: { title: '自助查询', icon: 'el-icon-s-home', affix: true }
      }
    ]
  }
]
export const asyncRoutes = []

export const router = createRouter({
  history: createWebHistory((window as any).__POWERED_BY_QIANKUN__ ? '/bolt' : '/'),
  routes: constantRoutes
})

export default router
