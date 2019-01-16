import request from '@/utils/request'

// 增加合同模板
export function saveContractTemp(query) {
  return request({
    url: '/basecontracttemp/saveContractTemp',
    method: 'post',
    data: query
  })
}

// 删除合同模板
export function deleteContractTemp(query) {
  return request({
    url: '/basecontracttemp/deleteContractTemp',
    method: 'get',
    params: query
  })
}

// 修改合同模板
export function updateContractTemp(query) {
  return request({
    url: '/basecontracttemp/updateContractTemp',
    method: 'post',
    data: query
  })
}

// 查询合同模板
export function getContractTempCondition(query) {
  return request({
    url: '/basecontracttemp/getContractTempCondition',
    method: 'get',
    params: query
  })
}

// 增加收费方案
export function saveCost(query) {
  return request({
    url: '/basecostplan/saveCost',
    method: 'post',
    data: query
  })
}

// 删除收费方案
export function deleteCost(query) {
  return request({
    url: '/basecostplan/deleteCost',
    method: 'get',
    params: query
  })
}
// 查询收费方案
export function getCostPlanCondition(query) {
  return request({
    url: '/basecostplan/getCostPlanCondition',
    method: 'get',
    params: query
  })
}

// 收费方案类型列表
export function listCostType(query) {
  return request({
    url: '/basecostplan/ListCostType',
    method: 'get',
    params: query
  })
}

// 新增物业租赁合同(甲方信息)
export function savePropertyLeasingContract(query) {
  return request({
    url: '/basepropertyleasingcontract/savePropertyLeasingContract',
    method: 'post',
    data: query
  })
}

// 更新物业租赁合同（乙方信息）
export function savePLCYi(query) {
  return request({
    url: '/basepropertyleasingcontract/savePLCYi',
    method: 'post',
    data: query
  })
}

// 删除物业租赁合同
export function deletePropertyLeasingContract(query) {
  return request({
    url: '/basepropertyleasingcontract/deletePropertyLeasingContract',
    method: 'get',
    params: query
  })
}

// 查询物业租赁合同
export function getPropertyLeasingContract(query) {
  return request({
    url: '/basepropertyleasingcontract/getPropertyLeasingContract',
    method: 'get',
    params: query
  })
}

// 启动物业租赁合同
export function updataStart(query) {
  return request({
    url: '/basepropertyleasingcontract/updataStart',
    method: 'get',
    params: query
  })
}

// 获取房间资产
export function getHouses(query) {
  return request({
    url: '/basepropertyleasingcontract/getHouses',
    method: 'get',
    params: query
  })
}

// 根据费用类别选择方案
export function getCoTyPL(query) {
  return request({
    url: '/basecostplan/getCoTyPL',
    method: 'get',
    params: query
  })
}

// 根据房间和收费类型选择设备列表
export function getHouAss(query) {
  return request({
    url: '/basepropertyleasingcontract/getHouAss',
    method: 'post',
    data: query
  })
}

// 保存合同技术方案
export function saveRentlInt(query) {
  return request({
    url: '/basepropertyleasingcontract/saveRentlInt',
    method: 'post',
    data: query
  })
}

