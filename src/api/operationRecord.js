// 操作记录
import request from '@/utils/request'

// 查询操作日志
export function getMeterOperLogList(query) {
  return request({
    url: '/meteroperlog/getMeterOperLogList',
    method: 'get',
    params: query
  })
}

// 查询登录日志
export function getLoginList(query) {
  return request({
    url: '/loginInfo/getLoginList',
    method: 'get',
    params: query
  })
}
