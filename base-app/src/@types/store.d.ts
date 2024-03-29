import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { RouteRecordRaw } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

declare interface State {
  app: App
  permission: Permission
  tagsView: TagsView
  user: User
}

declare interface App {
  device: string
  size: string
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  },
  loading: boolean
  dayWord: any
  accessInfo: any
  menuList: any
  msgList: any
  openNewsModal: boolean
  hasToDo: number
  myDoing: number
  themes: string
  childRouter: string
}

declare interface Permission {
  routes: RouteRecordRaw[]
  addRoutes: RouteRecordRaw[]
}

declare interface TagsView {
  visitedViews: any[]
  cachedViews: any[]
}

declare interface User {
  // token: string | undefined
  // roles: string | undefined
  // name: string | undefined
  // avatar: string | undefined
  introduction: string,
  userInfo: any
}
