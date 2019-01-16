import request from '@/utils/request'
// 超级管理员部分的接口

// 获取社区列表
export function getCommunityList(query) {
  return request({
    url: '/baseCommunity/getCommunityList',
    method: 'get',
    params: query
  })
}

// 添加社区
export function saveCommunityInfo(query) {
  return request({
    url: '/baseCommunity/saveCommunityInfo',
    method: 'post',
    data: query
  })
}

// 修改社区
export function updateCommunityInfo(query) {
  return request({
    url: '/baseCommunity/updateCommunityInfo',
    method: 'post',
    data: query
  })
}

// 删除社区
export function deleteCommunityInfo(query) {
  return request({
    url: '/baseCommunity/deleteCommunityInfo',
    method: 'get',
    params: query
  })
}

// 添加系统用户
export function addSysUser(query) {
  return request({
    url: '/sysuser/addSysUser',
    method: 'post',
    data: query
  })
}

// 删除系统用户
export function deleteSysUser(query) {
  return request({
    url: '/sysuser/deleteSysUser',
    method: 'get',
    params: query
  })
}

// 获取所有非子账户
export function getAllParentUser(query) {
  return request({
    url: '/sysuser/getAllParentUser',
    method: 'get',
    params: query
  })
}
