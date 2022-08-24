import { registerMicroApps, start, initGlobalState, MicroAppStateActions } from 'qiankun'
import { getEmail, getName, getNickName } from '../utils/auth'
import { freeApps } from './apps'

// 初始化 state
const actions: MicroAppStateActions = initGlobalState({ user: { }})

actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log('main-app', state, prev)
  // if (state.router !== prev.router)
})
actions.setGlobalState({
  user: { nickName: getNickName(), username: getName(), email: getEmail() },
  themes: window.localStorage.getItem('themes'),
  router: ''
})
registerMicroApps(freeApps.filter(app => app.type === 'qiankun'), {
  // qiankun 生命周期钩子 - 子节点加载前
  beforeLoad: (app) => {
    console.log(`%cbeforeLoad：${app.name}`, 'color: green')
    return Promise.resolve()
  },
  // qiankun 生命周期钩子 - 子节点挂载后
  afterMount: () => {
    return Promise.resolve()
  }
})
export {
  actions
}
export default start
