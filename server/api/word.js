const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')

router.get('/wordsList', async (ctx) => {
  try {
    const data = ctx.request.query
    const { search, word, admin } = data
    let letter = data.letter
    let sql, res, temp ={}, result = []
    if (!search) {
      if (letter === 'hot') {
        sql = `SELECT a.id, a.word, a.letter, a.mean, a.pronounce, e.id AS eid, e.en, e.zh, u.id AS userID, u.name, u.avatar FROM words AS a 
          LEFT JOIN examples AS e ON a.id = e.wordID AND e.off != 1 
          LEFT JOIN user AS u ON a.userID = u.id
          WHERE a.off != 1 AND ${admin ? 'true AND' : 'a.verify = 1 AND'} a.counter >= 10`
      } else if (letter === 'all') {
        sql = `SELECT a.id, a.word, a.letter, a.mean, a.pronounce, a.verify, e.id AS eid, e.en, e.zh, u.id AS userID, u.name, u.avatar FROM words AS a 
          LEFT JOIN examples AS e ON a.id = e.wordID AND e.off != 1 
          LEFT JOIN user AS u ON a.userID = u.id
          WHERE a.off != 1 AND ${admin ? 'true' : 'a.verify = 1'}`
      } else {
        sql = `SELECT a.id, a.word, a.letter, a.mean, a.pronounce, e.id AS eid, e.en, e.zh, u.id AS userID, u.name, u.avatar FROM words AS a 
          LEFT JOIN examples AS e ON a.id = e.wordID AND e.off != 1 
          LEFT JOIN user AS u ON a.userID = u.id 
          WHERE a.off != 1 AND ${admin ? 'true AND' : 'a.verify = 1 AND'} a.letter = ?`
      }
    } else {
      sql = `SELECT a.id, a.word, a.letter, a.mean, a.pronounce, e.id AS eid, e.en, e.zh, u.id AS userID, u.name, u.avatar FROM words AS a 
        LEFT JOIN examples AS e ON a.id = e.wordID AND e.off != 1 
        LEFT JOIN user AS u ON a.userID = u.id 
        WHERE a.off != 1 AND ${admin ? 'true AND' : 'a.verify = 1 AND'} a.word LIKE ?`
      letter = `%${word.trim()}%`
    }
    res = await query(sql, [letter])

    res.forEach(item => {
      if (!temp[item.id]) {
        temp[item.id] = {
          id: item.id, word: item.word, letter: item.letter, mean: item.mean, pronounce: item.pronounce,
          verify: item.verify, userID: item.userID, name: item.name, avatar: item.avatar, examples: []}
        result.push(temp[item.id])
      }
      if (item.eid) {
        temp[item.id].examples.push({id: item.eid, en: item.en, zh: item.zh})
      }
    })

    ctx.body = {code: 1, data: result}
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
    const admin = data.admin
    const date = Date.now()
    let id = data.id
    let letter
    if (word === '') {
      ctx.body = {code: 0, message: '"单词"项不得为空'}
      return
    }
    letter = word[0].toLocaleUpperCase()
    if (id) {
      if (data.operate === '3') { // 删除
        await query(`UPDATE words SET off = 1 WHERE id = ?`, [id])
        await query(`UPDATE examples SET off = 1 WHERE wordID = ?`, [id])
      } else if (data.operate === '1') { // 更新
        await query(`UPDATE words SET word = ?, letter = ?, mean = ?, pronounce = ?, updateTime = ? WHERE id = ?`, [word, letter, mean, pronounce, date, id])
      }
    } else {
      id = shortid.generate()
      await query(`INSERT INTO words (id, word, letter, mean, pronounce, userID, createTime, verify) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [id, word, letter, mean, pronounce, data.userID, date, admin ? 1 : 0])
    }
    for (let i = 0, len = examples.length; i < len; i++) {
      const example = examples[i]
      const exid = example.id
      const en = example.en.trim()
      const zh = example.zh.trim()
      if (exid) {
        if (example.operate === '3') { // 删除
          await query(`UPDATE examples SET off = 1 WHERE id = ?`, [exid])
        } else if (example.operate === '1') { // 更新
          if (en === '') { continue }
          await query(`UPDATE examples SET en = ?, zh = ?, updateTime = ? WHERE id = ?`, [en, zh, date, exid])
        }
      } else {
        if (en === '') { continue }
        await query(`INSERT INTO examples (id, wordID, en, zh, createTime) VALUES (?, ?, ?, ?, ?)`, 
          [shortid.generate(), id, en, zh, date])
      }
    }
    ctx.body = {code: 1, message: admin ? '成功' : '谢谢🙏，提交成功，等待审核。'}
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/changeVerify', async (ctx) => {
  try {
    const data = ctx.request.body
    await query(`UPDATE words SET verify = ? WHERE id = ?`, [data.verify, data.id])
    ctx.body = {code: 1, message: '成功'}
  } catch(err) {
    throw new Error(err)
  }
})

module.exports = router