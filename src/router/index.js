import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   设置为true，就不显示在侧边导航栏
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           设置成noredirect就不会显示在面包屑上
* name:'router-name'             如果是keep-alive,必须设置
* meta : {
    title: 'title'               路由对应侧边栏的名字
    icon: 'svg-name'             图标
  }
**/
export const constantRouterMap = [
  { path: '/', component: () => import('@/views/login/index'), hidden: true, meta: { noNeedAuth: true }},

  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    children: [{
      path: 'index',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
  // {
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
  // },
  // {
  //   path: '/assets',
  //   component: Layout,
  //   redirect: '/assets/assets',
  //   meta: { title: '资产管理', icon: 'assets' },
  //   alwaysShow: true,
  //   children: [{
  //     path: 'index',
  //     name: 'Assets',
  //     component: () => import('@/views/assets/index'),
  //     meta: { title: '资产管理' }
  //   }]
  // }
  // {
  //   path: '/contract',
  //   component: Layout,
  //   redirect: '/contract/index',
  //   meta: { title: '合同管理', icon: 'example' },
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Contract',
  //       component: () => import('@/views/contract/index'),
  //       meta: { title: '合同管理' }
  //     },
  //     {
  //       path: 'business',
  //       name: 'Business',
  //       component: () => import('@/views/contract/business'),
  //       meta: { title: '商务方案' }
  //     },
  //     {
  //       path: 'technical',
  //       name: 'Technical',
  //       component: () => import('@/views/contract/technical'),
  //       meta: { title: '技术方案' }
  //     }
  //   ]
  // },
  // {
  //   path: '/userService',
  //   component: Layout,
  //   redirect: '/dashboard/index',
  //   meta: { title: '用户服务', icon: 'service' },
  //   alwaysShow: true,
  //   children: [{
  //     path: 'index',
  //     name: 'UserService',
  //     component: () => import('@/views/userService/index'),
  //     meta: { title: '用户服务' }
  //   }]
  // },

]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/superAdmin',
    component: Layout,
    redirect: '/superAdmin/communityManage',
    meta: { title: '超级管理员', icon: 'user' },
    children: [
      {
        path: 'communityManage',
        name: 'CommunityManage',
        component: () => import('@/views/superAdmin/communityManage'),
        meta: { title: '社区管理' }
      },
      {
        path: 'userManage',
        name: 'UserManage',
        component: () => import('@/views/superAdmin/userManage'),
        meta: { title: '账户管理' }
      }
    ]
  },
  {
    path: '/assets',
    component: Layout,
    redirect: '/assets/index',
    meta: { title: '资产管理', icon: 'assets' },
    alwaysShow: true,
    children: [{
      path: 'index',
      name: 'Assets',
      component: () => import('@/views/assets/index'),
      meta: { title: '资产管理' }
    }]
  },
  {
    path: '/contract',
    component: Layout,
    redirect: '/contract/index',
    meta: { title: '合同管理', icon: 'example' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        name: 'Contract',
        component: () => import('@/views/contract/index'),
        meta: { title: '合同管理' }
      },
      {
        path: 'business',
        name: 'Business',
        component: () => import('@/views/contract/business'),
        meta: { title: '商务方案' }
      },
      {
        path: 'technical',
        name: 'Technical',
        component: () => import('@/views/contract/technical'),
        meta: { title: '技术方案' }
      }
    ]
  },
  {
    path: '/userService',
    component: Layout,
    redirect: '/dashboard/index',
    meta: { title: '用户服务', icon: 'service' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        name: 'UserService',
        component: () => import('@/views/userService/index'),
        meta: { title: '用户服务' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/userService/settings'),
        meta: { title: '用电配置' }
      }
    ]
  },
  {
    path: '/dataService',
    component: Layout,
    redirect: '/dataService/dataSummary',
    meta: { title: '数据服务', icon: 'form' },
    alwaysShow: true,
    children: [
      {
        path: 'dataSummary',
        name: 'DataSummary',
        component: () => import('@/views/dataService/dataSummary'),
        meta: { title: '数据总览' }
      },
      {
        path: 'financialStatements',
        name: 'FinancialStatements',
        component: () => import('@/views/dataService/financialStatements'),
        meta: { title: '财务报表' }
      },
      {
        path: 'operationRecord',
        name: 'OperationRecord',
        component: () => import('@/views/dataService/operationRecord'),
        meta: { title: '操作记录' }
      }
    ]
  }

]
