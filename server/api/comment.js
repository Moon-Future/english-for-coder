const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const { checkToken } = require('./util')

router.get('/getComment', async (ctx) => {
  try {
    const params = ctx.request.query
    let result = await query(`SELECT w.id, w.wordID, w.userID, w.comment, w.toUser, w.like, w.createTime,
      u.name, u.avatar
      FROM word_comment AS w 
      LEFT JOIN user AS u ON w.userID = u.id
      WHERE w.wordID = ? ORDER BY w.createTime`, [params.wordID])
    ctx.body = {code: 1, data: result}
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/writeComment', async (ctx) => {
  if (!checkToken(ctx)) {
    ctx.body = {code: 0, message: '请先登陆'}
    return
  }
  try {
    const data = ctx.request.body
    let { wordID, userID, comment, toUser = '' } = data
    let id = shortid.generate()
    let date = Date.now()
    comment = comment.trim().slice(0, 500)
    await query(`INSERT INTO word_comment (id, wordID, userID, comment, toUser, createTime) 
    VALUES (?, ?, ?, ?, ?, ?)`, [id, wordID, userID, comment, toUser, date])
    ctx.body = {code: 1, message: '成功', data: {id, createTime: date}}
  } catch(err) {
    throw new Error(err)
  }
})

module.exports = router