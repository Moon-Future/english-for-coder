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