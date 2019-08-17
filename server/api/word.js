const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')

router.get('/wordsList', async (ctx) => {
  try {
    const data = ctx.request.query
    const letter = data.letter
    let sql, result
    if (letter === 'hot') {
      sql = `SELECT * FROM words WHERE counter >= 10`
    } else {
      sql = `SELECT * FROM words WHERE letter = ?`
    }
    result = await query(sql, [letter])
    ctx.body = {code: 200, data: result}
  } catch(err) {
    throw new Error(err)
  }
})

module.exports = router