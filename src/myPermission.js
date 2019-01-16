import router from './router'

import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'
// Progress 进度条样式

// const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (window.sessionStorage.getItem('token')) {
    // console.log('已登录')
    next()
  } else {
    // console.log('未登录')
    if (to.meta.noNeedAuth) {
      next()
    } else {
      next({
        path: '/'
        // query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
