import { Module } from 'vuex'
import { App } from '#/store'
import { get_word, access_info, getMenuList, get_list_msg, access_log } from '@/api/main'
import { getName } from '@/utils/auth'

const appModule: Module<App, any> = {
  namespaced: true,
  state: {
    device: 'desktop',
    size: 'medium',
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    loading: false,
    dayWord: { author: '', content: '' },
    accessInfo: { pv: 0, uv: 0 },
    // menuList: null, // 为了每次刷新时重新请求menulist
    menuList: [{
      title: '111',
      bg: require('@img/zzcx.png'),
      desc: '111',
      // entry: pathMap.bolt,
      entry: 'http://localhost:3003/',
      showInMain: true,
      container: '#bolt',
      name: '/bolt',
      children: ['/dataQuery'],
      type: 'qiankun'
    },
    {
      title: '数据可视化',
      bg: '',
      desc: '',
      container: '#rawgraphs',
      // entry: pathMap.rawgraphs,
      entry: 'http://localhost:3000/',
      showInMain: false,
      name: '/rawgraphs',
      // children: [],
      type: 'qiankun'
    }],
    msgList: {},
    openNewsModal: false,
    hasToDo: 0, // 我的待办
    myDoing: 0, // 我发起的处理中的流程
    themes: '', // 主题
    childRouter: ''
  },
  mutations: {
    SET_THEMES: (state, themes: string) => {
      state.themes = themes
    },
    TOGGLE_NEWS_MODAL: (state, status: boolean) => {
      state.openNewsModal = status
    },
    TOGGLE_SIDEBAR: (state) => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation: boolean) => {
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device: string) => {
      state.device = device
    },
    SET_SIZE: (state, size: string) => {
      state.size = size
    },
    SET_LOADING: (state, loading: boolean) => {
      state.loading = loading
    },
    SET_DAY_WORD: (state, dayWord: any) => {
      state.dayWord = dayWord
    },
    SET_ACCESS: (state, d: any) => {
      state.accessInfo = d
    },
    SET_APPS: (state, d: any) => {
      state.menuList = d
    },
    SET_MSG: (state, d: any) => {
      state.msgList = d
    },
    SET_HAS_TODO: (state, status: number) => {
      state.hasToDo = status
    },
    SET_MY_DOING: (state, status: number) => {
      state.myDoing = status
    },
    SET_CHILD_ROUTER: (state, str: string) => {
      state.childRouter = str
    }
  },
  actions: {
    setChildRouter({ commit }, str: string) {
      commit('SET_CHILD_ROUTER', str)
    },
    setThemes({ commit }, str: string) {
      commit('SET_THEMES', str)
    },
    setHasToDo({ commit }, status: number) {
      commit('SET_HAS_TODO', status)
    },
    setMyDoing({ commit }, status: number) {
      commit('SET_MY_DOING', status)
    },
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, withoutAnimation: boolean) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device: string) {
      commit('TOGGLE_DEVICE', device)
    },
    setSize({ commit }, size: string) {
      commit('SET_SIZE', size)
    },
    setLoading({ commit }, loading: boolean) {
      commit('SET_LOADING', loading)
    },
    getWord({ commit }) {
      return new Promise((resolve, reject) => {
        get_word()
          .then((res: any) => {
            commit('SET_DAY_WORD', res.data)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getPUV({ commit }) {
      return new Promise((resolve, reject) => {
        access_info()
          .then((res: any) => {
            commit('SET_ACCESS', res.data || { pv: 0, uv: 0 })
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getApps({ commit }) {
      return new Promise((resolve, reject) => {
        getMenuList({ userName: getName(), productCode: 'KAEL', level: '1', request_url: '', request_channel: '' })
          .then((res: any) => {
            commit('SET_APPS', res.data)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMsgs({ commit }, params) {
      return new Promise((resolve, reject) => {
        get_list_msg(params)
          .then((res: any) => {
            commit('SET_MSG', res.data)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // eslint-disable-next-line no-empty-pattern
    accessLog({ }, params) {
      access_log({ url: params.url, system: params.system })
    },
    toggleNewsModal({ commit }, status) {
      commit('TOGGLE_NEWS_MODAL', status)
    }
  }
}

export default appModule
