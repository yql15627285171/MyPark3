/**
 *过滤路由
 */
import { asyncRouterMap, constantRouterMap } from '@/router'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const accessedRouters = []
        for (var listItem in data) {
          for (var routerItem in asyncRouterMap) {
            if (listItem.name === routerItem.meta.name) {
              const accessedChildren = []
              for (var listChildren in listItem.lists) {
                for (var routerChildren in routerItem.children) {
                  if (listChildren.name === routerChildren.meta.name) {
                    accessedChildren.push(routerChildren)
                  }
                }
              }
              routerItem.children = accessedChildren
              accessedRouters.push(routerItem)
            }
          }
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
