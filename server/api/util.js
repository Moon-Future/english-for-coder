const query = require('../database/init')
const jwt = require('jsonwebtoken')
const { tokenConfig, githubConfig } = require('../secret')

// 验证是否登陆
function checkToken(ctx) {
  const token = ctx.get('Authorization')
  if (token === '') {
    return false
  }
  try {
    const userInfo = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
    return userInfo
  } catch(err) {
    return false
  }
}

function dateFormat(date, format) {
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

module.exports = { checkToken, dateFormat }