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

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
