// 处理时间格式的js文档
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取时分格式
export function hourAndMinute(date) {
  var hour = date.getHours()
  var minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
}
