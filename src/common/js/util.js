function checkType(val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

export function deepClone(obj) {
  if (typeof obj !== 'object') {
    return obj
  }
  let ret = checkType(obj) === 'Object' ? {} : []
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (checkType(obj[i]) === 'Object' || checkType(obj[i]) === 'Array') {
        ret[i] = deepClone(obj[i])
      } else {
        ret[i] = obj[i]
      }
    }
  }
  return ret
}

export function dateFormat(date, format) {
  date = typeof date === 'number' ? new Date(date) : date
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  if(/(y+)/i.test(format)){
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for(let k in o){
    if(new RegExp('(' + k + ')').test(format)){
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

export function timeAgo(date) {
  const now = Date.now()
  const diff = now - date
  if (diff <= 1000 * 60) {
    return '刚刚'
  }
  if (diff <= 1000 * 60 * 60) {
    return parseInt(diff / (1000 * 60)) + '分钟前'
  }
  if (diff <= 1000 * 60 * 60 * 24) {
    return parseInt(diff / (1000 * 60 * 60)) + '小时前'
  }
  if (diff <= 1000 * 60 * 60 * 24 * 30) {
    return parseInt(diff / (1000 * 60 * 60 * 24)) + '月前'
  }
  if (diff <= 1000 * 60 * 60 * 24 * 30 * 12) {
    return parseInt(diff / (1000 * 60 * 60 * 24 * 30)) + '年前'
  }
}