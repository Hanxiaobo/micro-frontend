import { Module } from 'vuex'
import { uuid } from 'vue-uuid'
import { App } from '#/store'
const defaultId = uuid.v1()
const appModule: Module<App, any> = {
  namespaced: true,
  state: {
    device: 'desktop',
    size: 'medium',
    themes: localStorage.getItem('themes') || '',
    sidebar: {
      opened: false,
      withoutAnimation: false,
      leftWidth: 310
    },
    defaultConfig: { // 新开tab的默认数据
      content: '', // sql的内容
      queryType: 'Hive',
      logTimer: null,
      md5: undefined,
      dataSource: 'Hive', // 数据源
      dataCenter: 'BJMD', // 机房
      queryEngine: 'Hive', // 查询引擎
      activeTab: 'third', // 默认选中运行历史
      taskStatus: 'wait', //  'wait' | 'running'
      result: [], // 运行结果
      history: [], // 运行历史
      log: [], // 运行日志
      jobIds: []
    },
    tabs: [ // 存放所有tabs数据
      {
        title: 'New1',
        id: defaultId, // 唯一id
        sqlId: undefined,
        content: '', // sql的内容
        queryType: 'Hive',
        logTimer: null,
        md5: undefined,
        dataSource: 'Hive', // 数据源
        dataCenter: 'BJMD', // 机房
        queryEngine: 'Hive', // 查询引擎
        activeTab: 'third', // 默认选中运行历史
        taskStatus: 'wait', //  'wait' | 'running'
        result: [], // 运行结果
        history: [], // 运行历史
        log: [], // 运行日志
        jobIds: []
      }
    ],
    currentTab: { // 当前打开的窗口
      title: 'New1',
      id: defaultId, // 唯一id
      sqlId: undefined,
      content: '', // sql的内容
      queryType: 'Hive',
      logTimer: null,
      md5: undefined,
      dataSource: 'Hive', // 数据源
      dataCenter: 'BJMD', // 机房
      queryEngine: 'Hive', // 查询引擎
      activeTab: 'third', // 默认选中运行历史
      taskStatus: 'wait', //  'wait' | 'running'
      result: [], // 运行结果
      history: [], // 运行历史
      log: [], // 运行日志
      jobIds: []
    },
    defaultTables: [], // 左侧树的数据，输入代码提示用的
    tabsNum: 1, // 新开tab时，显示名称数量
    showConsole: false,
    variableList: {} // sql变量
  },
  mutations: {
    SET_VARLIST: (state, obj: any) => {
      state.variableList[obj.tabId] = obj.arr
    },
    SET_LEFT_WIDTH: (state, w: number) => {
      state.sidebar.leftWidth = w
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
    SET_THEMES: (state, themes: string) => {
      state.themes = themes
    },
    SET_NUM: (state) => {
      state.tabsNum += 1
    },
    ADD_TABS: (state, obj: any) => {
      const id = uuid.v1()
      const newTabName = ++state.tabsNum
      const item = {
        title: obj.name || `New${newTabName}`,
        content: `select${newTabName}`,
        id: id,
        ...state.defaultConfig,
        ...obj
      }
      state.tabs.push(item)
      state.currentTab = item
    },
    REMOVE_TABS: (state, id: string) => {
      const activeId = state.currentTab.id
      state.tabs = state.tabs.filter((item: any) => {
        return item.id !== id
      })
      if (id === activeId) {
        state.currentTab = state.tabs[state.tabs.length - 1]
      }
      delete state.variableList[id] // 删除该tab的sql变量
    },
    SELECT_TAB: (state, id: string) => {
      state.currentTab = state.tabs.filter((item: any) => {
        return item.id === id
      })[0]
    },
    UPDATE_FORM: (state, obj: any) => {
      const activeId = obj.id
      state.tabs.forEach((item: any, index: number) => {
        if (item.id === activeId) {
          // item = { ...item, ...obj }
          state.tabs.splice(index, 1, { ...item, ...obj })
        }
      })
      if (state.currentTab.id === activeId) {
        state.currentTab = { ...state.currentTab, ...obj }
      }
    },
    SET_CONSOLE: (state, status: boolean) => {
      state.showConsole = status
    },
    COLSE_OTHERS: (state) => {
      const notCloseArr = state.tabs.filter((tab: any) => tab.taskStatus === 'running' || tab.id === state.currentTab.id)
      state.tabs = notCloseArr
      const obj: any = {}
      notCloseArr.forEach((tab: any) => {
        obj[tab.id] = state.variableList[tab.id] || []
      })
      state.variableList = obj // sql变量
    },
    INIT_STORE: (state) => {
      state.tabs = [
        {
          title: 'New1',
          id: defaultId, // 唯一id
          sqlId: undefined,
          content: '', // sql的内容
          queryType: 'Hive',
          logTimer: null,
          md5: undefined,
          dataSource: 'Hive', // 数据源
          dataCenter: 'BJMD', // 机房
          queryEngine: 'Hive', // 查询引擎
          activeTab: 'third', // 默认选中运行历史
          taskStatus: 'wait', //  'wait' | 'running'
          result: [], // 运行结果
          history: [], // 运行历史
          log: [], // 运行日志
          jobIds: []
        }
      ] // 开的tab窗口们
      state.currentTab = {
        title: 'New1',
        id: defaultId, // 唯一id
        sqlId: undefined,
        content: '', // sql的内容
        queryType: 'Hive',
        logTimer: null,
        md5: undefined,
        dataSource: 'Hive', // 数据源
        dataCenter: 'BJMD', // 机房
        queryEngine: 'Hive', // 查询引擎
        activeTab: 'third', // 默认选中运行历史
        taskStatus: 'wait', //  'wait' | 'running'
        result: [], // 运行结果
        history: [], // 运行历史
        log: [], // 运行日志
        jobIds: []
      } // 当前打开的窗口
      state.defaultTables = [] // 左侧树的数据，输入代码提示用的
      state.tabsNum = 1
    }
  },
  actions: {
    setVarList({ commit }, obj: any) {
      commit('SET_VARLIST', obj)
    },
    setLeftWidth({ commit }, w: number) {
      commit('SET_LEFT_WIDTH', w)
    },
    initStore({ commit }) {
      commit('INIT_STORE')
    },
    setConsole({ commit }, status: boolean) {
      commit('SET_CONSOLE', status)
    },
    updateForm({ commit }, obj: any) {
      commit('UPDATE_FORM', obj)
    },
    selectTab({ commit }, id: string) {
      commit('SELECT_TAB', id)
    },
    removeTab({ commit }, id: string) {
      commit('REMOVE_TABS', id)
    },
    addTabs({ commit }, tab: any) {
      commit('ADD_TABS', tab)
    },
    setTabsNum({ commit }) {
      commit('SET_NUM')
    },
    setThemes({ commit }, themes: string) {
      commit('SET_THEMES', themes)
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
    closeOthers({ commit }) {
      commit('COLSE_OTHERS')
    }
  }
}

export default appModule
