import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'
// Progress 进度条样式

// const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (window.sessionStorage.getItem('token')) {
    // next()
    // 没有获取到listData的时候
    if (store.getters.listData.length === 0) {
      var params = {
        // userId:window.sessionStorage.getItem('userId')
        userId: 1
      }
      store.dispatch('getUserMenuList', params).then(result => {
        console.log('getUserMenuList')
        store.dispatch('GenerateRoutes', store.getters.listData).then(() => {
          console.log(store.getters.addRouters)
          router.addRoutes(store.getters.addRouters)
          next({ ...to, replace: true })// hack方法 确保addRoutes已完成
        })
      })
    } else {
      next()
    }
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
