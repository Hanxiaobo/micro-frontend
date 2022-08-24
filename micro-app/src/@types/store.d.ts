import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { RouteRecordRaw } from 'vue-router'

declare interface App {
  device: string
  size: string
  themes: string
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
    leftWidth: number
  }
  defaultConfig: any
  tabs: any
  currentTab: any
  defaultTables: any
  tabsNum: number
  showConsole: boolean
  variableList: any
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
  menu: Array
}

declare interface State {
  app: App
  permission: Permission
  tagsView: TagsView
  user: User
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
