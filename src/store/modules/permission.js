/**
 *过滤路由
 */
import { asyncRouterMap, constantRouterMap } from '@/router'
/* Layout */
// import Layout from '@/views/layout/Layout'

const permission = {
  state: {
    routers: constantRouterMap, // 显示的路由
    addRouters: [] // 添加的路由
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
        for (var listIndex in data) {
          var listItem = data[listIndex]
          for (var routerIndex in asyncRouterMap) {
            var routerItem = asyncRouterMap[routerIndex]
            if (listItem.name === routerItem.meta.title) {
              const accessedChildren = []
              for (var listChildrenIndex in listItem.list) {
                var listChildrenItem = listItem.list[listChildrenIndex]
                for (var routerChildrenIndex in routerItem.children) {
                  var routerChildrenItem = routerItem.children[routerChildrenIndex]
                  if (listChildrenItem.name === routerChildrenItem.meta.title) {
                    accessedChildren.push(routerChildrenItem)
                  }
                }
              }
              routerItem.children = accessedChildren
              accessedRouters.push(routerItem)
            }
          }
        }

        var e1 = { path: '/404', component: () => import('@/views/404'), hidden: true }
        var e2 = { path: '*', redirect: '/404', hidden: true }

        // var e3 = {
        //   path: '/superAdmin',
        //   component: Layout,
        //   redirect: '/superAdmin/communityManage',
        //   meta: { title: '超级管理员', icon: 'user' },
        //   children: [
        //     {
        //       path: 'communityManage',
        //       name: 'CommunityManage',
        //       component: () => import('@/views/superAdmin/communityManage'),
        //       meta: { title: '社区管理' }
        //     },
        //     {
        //       path: 'userManage',
        //       name: 'UserManage',
        //       component: () => import('@/views/superAdmin/userManage'),
        //       meta: { title: '账户管理' }
        //     }
        //   ]
        // }
        accessedRouters.push(e1)
        accessedRouters.push(e2)
        // accessedRouters.push(e3)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
