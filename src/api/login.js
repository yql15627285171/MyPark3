import request from '@/utils/request'

// post:参数名包含在data里
// get:参数包含在params里
export function login(username, password) {
  return request({
    url: '/sysuser/syslogin',
    method: 'get',
    params: {
      username: username,
      password: password
    }
    // data: {
    //   username: username,
    //   password: password
    // }
  })
}

// 获取所有的菜单（暂时）
export function getAllMenuList() {
  return request({
    url: '/menu/getAllMenuList',
    method: 'get'
  })
}

export function logout(query) {
  return request({
    url: '/sysuser/logout',
    method: 'get',
    params: query
  })
}
