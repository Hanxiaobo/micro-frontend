import { registerMicroApps, start, initGlobalState, MicroAppStateActions } from 'qiankun'
import store from '@/store'
import { getEmail, getName, getNickName } from '../utils/auth'
import { qiankunApps } from './apps'
import router from '@/router'

const setLoading = (loading: boolean) => {
  store.dispatch('app/setLoading', loading)
}
// 初始化 state
const actions: MicroAppStateActions = initGlobalState({
  user: { nickName: getNickName(), username: getName(), email: getEmail() },
  themes: window.localStorage.getItem('themes'),
  router: '',
  hasToDo: 0,
  myDoing: 0
})

actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log('main-app', state, prev, '===================')
  if (state.hasToDo !== prev.hasToDo) {
    store.dispatch('app/setHasToDo', state.hasToDo)
  }
  if (state.myDoing !== prev.myDoing) {
    store.dispatch('app/setMyDoing', state.myDoing)
  }
  if (state.themes !== prev.themes) {
    store.dispatch('app/setThemes', state.themes)
  }

  if (state.router) {
    router.push(state.router)
    // actions.setGlobalState({ router: '' })
  }
  // if (state.router !== prev.router) {
  //   store.dispatch('app/setChildRouter', state.router)
  // }
})
// actions.setGlobalState({
//   user: { nickName: getNickName(), username: getName(), email: getEmail() },
//   themes: window.localStorage.getItem('themes'),
//   router: '',
//   hasToDo: false
// })
// && roles.some(r => r.productCode === app.productCode)
const roles = store.state.app.menuList
const roleApps = qiankunApps.filter(app => app.type === 'qiankun' && app.container !== '#free-app' && roles.some((r: { name: string }) => r.name === app.activeRule))

registerMicroApps(roleApps, {
  // qiankun 生命周期钩子 - 子节点加载前
  beforeLoad: (app) => {
    setLoading(true)
    console.log(`%cbeforeLoad：${app.name}`, 'color: green')
    return Promise.resolve()
  },
  // qiankun 生命周期钩子 - 子节点挂载后
  afterMount: () => {
    setLoading(false)
    return Promise.resolve()
  }
})
export {
  actions
}
export default start
