// 用户服务接口
import request from '@/utils/request'

// 查询设备的状态
export function getMeterStateList(query) {
  return request({
    url: '/meterInfo/getMeterStateList',
    method: 'get',
    params: query
  })
}

// 点抄
export function readEMCurrentPara(query) {
  return request({
    url: '/deviceCtrl/ReadEMCurrentPara',
    method: 'get',
    params: query,
    timeout: 120000
  })
}

// 拉合闸
export function ctrlEMRelayStatus(query) {
  return request({
    url: '/deviceCtrl/CtrlEMRelayStatus',
    method: 'get',
    params: query,
    timeout: 120000
  })
}

// 远程充值
export function recharge(query) {
  return request({
    url: '/transManagement/Recharge',
    method: 'get',
    params: query,
    timeout: 120000
  })
}

// 查询日报表
export function getDayPageList(query) {
  return request({
    url: '/EM_Report/getDayPageList',
    method: 'get',
    params: query
  })
}

// 查询月报表
export function getMonthReport(query) {
  return request({
    url: '/EM_Report/getMonthReport',
    method: 'get',
    params: query
  })
}

// 充值记录
export function getRechargeRecord(query) {
  return request({
    url: '/transManagement/getPageList',
    method: 'get',
    params: query
  })
}

// 设置结算日和报警金额
export function uplelp(query) {
  return request({
    url: '/baseCommunity/uplelp',
    method: 'get',
    params: query
  })
}

// 查询结算日和报警金额
export function getlelp(query) {
  return request({
    url: '/baseCommunity/getlelp',
    method: 'get',
    params: query
  })
}
