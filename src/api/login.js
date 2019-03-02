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

// 获取对应用户的菜单（暂时）
export function getUserMenuList(query) {
  return request({
    url: '/menu/getUserMenuList',
    method: 'get',
    params: query
  })
}

export function logout(query) {
  return request({
    url: '/sysuser/logout',
    method: 'get',
    params: query
  })
}

// 修改密码
export function updateSysUserPassword(query) {
  return request({
    url: '/sysuser/updateSysUserPassword',
    method: 'post',
    params: query
  })
}
