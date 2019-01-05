// 获取设备类型
export function getDeviceType(index) {
  var deviceType = ''
  switch (index) {
    case 1001:
      deviceType = '集中器'
      break
    case 1501:
      deviceType = '网关'
      break
    case 2001:
      deviceType = '电表'
      break
    case 2501:
      deviceType = '水表'
      break
    case 3001:
      deviceType = '路灯'
      break
    default:
      deviceType = '未知'
  }
  return deviceType
}

// 获取运行状态
export function getStatus(index) {
  var status = ''
  switch (index) {
    case '0':
      status = '停运'
      break
    case '1':
      status = '运行'
      break
    default:
      status = ''
  }
  return status
}

// 反编译运行状态
export function getStatusNumber(status) {
  var num = ''
  console.log(status)
  switch (status) {
    case '停运':
      num = 0
      break
    case '运行':
      num = 1
      break
    default:
      num = 100
  }
  return num
}

// 获取商务方案状态
export function getBusinessStatus(index) {
  var status = ''
  switch (index) {
    case 0:
      status = '未启用'
      break
    case 1:
      status = '启用'
      break
    default:
      status = ''
  }
  return status
}

// 反编译商务方案状态
export function getBusinessStatusNumber(status) {
  var num = ''
  switch (status) {
    case '未启用':
      num = 0
      break
    case '启用':
      num = 1
      break
    default:
      num = ''
  }
  return num
}

// 合同状态
export function getContractStatus(index) {
  var status = ''
  switch (index) {
    case 0:
      status = '未启用'
      break
    case 1:
      status = '启用'
      break
    case 2:
      status = '未完成'
      break
    default:
      status = ''
  }
  return status
}

// 深度复制一个非非数组的对象
export function objDeepCopy(source) {
  var sourceCopy = {}
  for (var item in source) sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
  return sourceCopy
}
