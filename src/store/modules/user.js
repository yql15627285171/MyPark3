import { login, logout, getUserMenuList } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: window.sessionStorage.getItem('token'),
    name: '',
    avatar: '',
    roles: [],
    listData: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LIST_DATA: (state, listData) => {
      state.listData = listData
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          // const data = response.data
          // setToken(data.token)
          window.sessionStorage.setItem('token', response.token)
          commit('SET_TOKEN', response.token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户菜单列表
    getUserMenuList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getUserMenuList(params).then(response => {
          commit('SET_LIST_DATA', response.menuList)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      var params = {
        userId: window.sessionStorage.getItem('userId')
      }
      return new Promise((resolve, reject) => {
        logout(params).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          // removeToken()
          window.sessionStorage.removeItem('token')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        // removeToken()
        window.sessionStorage.removeItem('token')
        resolve()
      })
    }
  }
}

export default user
