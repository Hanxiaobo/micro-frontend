import { Module } from 'vuex'
import { User } from '#/store'
import { queryUserList } from '@/api/data-query'

const userModule: Module<User, any> = {
  namespaced: true,
  state: {
    menu: [],
  },
  mutations: {
    SET_MENU: (state, menu: Array<any>) => {
      state.menu = menu
    },
  },
  actions: {
    // get menu
    async queryMenu({ commit }) {
      const menu = await queryUserList({})
      commit('SET_MENU', menu)
    }
  }
}

export default userModule
