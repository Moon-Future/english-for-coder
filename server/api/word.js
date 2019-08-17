const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')

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

router.post('/editWord', async (ctx) => {
  try {
    const data = ctx.request.body
    const word = data.word.trim()
    const mean = data.mean.trim()
    const pronounce = data.pronounce.trim()
    const examples = data.examples
    const date = Date.now()
    let id = data.id
    let letter
    if (word === '') {
      ctx.body = {code: 500, message: '"单词"项不得为空'}
      return
    }
    letter = word[0].toLocaleUpperCase()
    if (id) {
      if (data.operate === '3') { // 删除

      } else { // 更新

      }
    } else {
      id = shortid.generate()
      await query(`INSERT INTO words (id, word, letter, mean, pronounce, createTime) VALUES (?, ?, ?, ?, ?, ?)`, 
        [id, word, letter, mean, pronounce, date])
    }
    for (let i = 0, len = examples.length; i < len; i++) {
      const example = examples[i]
      const exid = example.id
      const en = example.en.trim()
      const zh = example.zh.trim()
      if (example.operate === '3' && exid) { // 删除
        await query(`DELETE FROM examples WHERE id = ?`, [exid])
        continue
      }
      if (en === '') {
        continue
      }
      if (exid) { // 更新

      } else { // 新增
        await query(`INSERT INTO examples (id, wordID, en, zh, createTime) VALUES (?, ?, ?, ?, ?)`, 
          [shortid.generate(), id, en, zh, date])
      }
    }
    ctx.body = {code: 200, message: '成功'}
  } catch(err) {
    throw new Error(err)
  }
})

module.exports = router