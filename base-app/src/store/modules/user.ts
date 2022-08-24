import { Module } from 'vuex'
// import { ElMessage } from 'element-plus'
import queryString from 'query-string'
import { User } from '#/store'
import { user_login, user_logout } from '@/api/user'
import { getNickName, getRoles, getUrl, getEmail, getName, setName, setUrl, setNickName, setEmail, removeUrl, removeEmail, removeName, removeNickName, removeSession, setRoles, removeRoles } from '@/utils/auth'

const userModule: Module<User, any> = {
  namespaced: true,
  state: {
    // token: getToken(),
    // roles: getRoles(),
    // name: getName(),
    // avatar: getAvatar(),
    introduction: '',
    userInfo: {
      username: getName(),
      nickName: getNickName(),
      email: getEmail(),
      roleList: JSON.parse(getRoles() || '[]'),
      url: getUrl()
    }
  },
  mutations: {
    SET_USER_INFO: (state, info: object) => {
      state.userInfo = info
    }
  },
  actions: {
    // user login
    login({ commit }) {
      const serviceTicket =
    queryString.parse(window.location.search)['ticket'] === undefined
      ? ''
      : queryString.parse(window.location.search)['ticket']
      const currentUrlEncodeing = window.location.href.replace(/[(\/\?)|&]ticket=(.)*/, '')
      return new Promise((resolve, reject) => {
        user_login({ serviceTicket: serviceTicket, service: currentUrlEncodeing })
          .then((res: any) => {
          // 登录成功后,去掉ticket参数
            if (res) {
              var reponse = res.data
              if (reponse.success) {
                reponse.data.username && setName(reponse.data.username)
                reponse.data.nickName && setNickName(reponse.data.nickName)
                reponse.data.email && setEmail(reponse.data.email)
                reponse.data.roleList && setRoles(JSON.stringify(reponse.data.roleList))
                reponse.data.toUrl && setUrl(reponse.data.toUrl)
                commit('SET_USER_INFO', reponse.data)
                history.pushState(null, '', window.location.href.replace(/[?&]ticket=[^&]*&?/g, ''))
                resolve(res)
              } else {
              // emits('loginEvent', false)
                console.log('cas ticket check:', res.data.msg)
                // ElMessage({
                //   type: 'error',
                //   message: res.data.msg
                // })
                var casUrl = res.data.data.casUrl + 'login?service=' + currentUrlEncodeing
                window.location.href = casUrl
              }
            }
          })
          .catch((errs) => {
            console.log('==>', errs)
            // 用户未登录，跳转到cas 进行登录
            // eslint-disable-next-line no-prototype-builtins
            if (errs.hasOwnProperty('data')) {
              var casUrl = errs.data.data.casUrl + 'login?service=' + currentUrlEncodeing
              window.location.href = casUrl
            }
            reject(errs)
          })
      })
    },

    // user logout
    logout({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        user_logout({ username: state.userInfo.username })
          .then((res: any) => {
            commit('SET_USER_INFO', {
              username: '',
              nickName: '',
              email: ''
            })
            removeEmail()
            removeName()
            removeSession()
            removeNickName()
            removeRoles()
            removeUrl()
            dispatch('tagsView/delAllViews', null, { root: true })
            console.log(res, 'logout')
            window.location.href = res.data.data.casUrl + '?service=' + window.location.href
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }

    // get user info
    // getInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     get_user_info(state.token)
    //       .then((res: any) => {
    //         if (!res) {
    //           reject('Verification failed, please Login again.')
    //         }

    //         const { roles, name, avatar, introduction } = res

    //         // roles must be a non-empty array
    //         if (!roles || roles.length <= 0) {
    //           reject('getInfo: roles must be a non-null array!')
    //         }

    //         commit('SET_NAME', name)
    //         commit('SET_ROLES', roles)
    //         commit('SET_AVATAR', avatar)
    //         commit('SET_INTRODUCTION', introduction)
    //         resolve(res)
    //       })
    //       .catch((error) => {
    //         reject(error)
    //       })
    //   })
    // }
  }
}

export default userModule
