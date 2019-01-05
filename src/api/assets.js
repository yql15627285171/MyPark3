import request from '@/utils/request'

/**
 * 获取资产列表
 */
export function getPageList(query) {
  return request({
    url: '/meterInfo/getPageList',
    method: 'get',
    params: query
  })
}

/**
 * 添加房间
 */
export function postCommHouseInfo(query) {
  return request({
    url: '/baseCommHouse/postCommHouseInfo',
    method: 'post',
    data: query
  })
}
/**
 * 修改房间
 */
export function updateMH(query) {
  return request({
    url: '/baseCommHouse/updateMH',
    method: 'post',
    data: query
  })
}

/**
 * 删除房间
 */
export function deleteMHInfo(query) {
  return request({
    url: '/meterInfo/deleteMHInfo',
    method: 'get',
    params: query
  })
}

/**
 * 获取社区对应的街栋
 */
export function getBuildingList(query) {
  return request({
    url: '/baseCommHouse/getBuildingList',
    method: 'get',
    params: query
  })
}

/**
 * 获取街栋对应的房间
 */
export function getHouseByBuilding(query) {
  return request({
    url: '/baseCommHouse/getHouseByBuilding',
    method: 'get',
    params: query
  })
}

/**
 * 添加设备
 */
export function saveMeterInfo(query) {
  return request({
    url: '/meterInfo/saveMeterInfo',
    method: 'post',
    data: query
  })
}
/**
 * 修改设备
 */
export function updateMeterInfo(query) {
  return request({
    url: '/meterInfo/updateMeterInfo',
    method: 'post',
    data: query
  })
}

/**
 * 删除设备
 */
export function deleteMeterInfo(query) {
  return request({
    url: '/meterInfo/deleteMeterInfo',
    method: 'get',
    params: query
  })
}
/**
 *启用设备，判断该设备是否属于该社区
 */
export function enableDevice(query) {
  return request({
    url: '/deviceCtrl/EnableDevice',
    method: 'get',
    params: query
  })
}
