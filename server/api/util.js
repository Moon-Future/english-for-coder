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

module.exports = { checkToken }