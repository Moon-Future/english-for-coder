const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')

router.get('/wordsList', async (ctx) => {
  try {
    const data = ctx.request.query
    const letter = data.letter
    let sql, res, temp ={}, result = []
    if (letter === 'hot') {
      sql = `SELECT a.id, a.word, a.letter, a.mean, a.pronounce, e.id AS eid, e.en, e.zh FROM words AS a LEFT JOIN examples AS e ON a.id = e.wordID AND e.off != 1 WHERE a.counter >= 10 AND a.off != 1`
    } else {
      sql = `SELECT a.id, a.word, a.letter, a.mean, a.pronounce, e.id AS eid, e.en, e.zh FROM words AS a LEFT JOIN examples AS e ON a.id = e.wordID AND e.off != 1 WHERE  a.letter = ? AND a.off != 1`
    }
    res = await query(sql, [letter])

    res.forEach(item => {
      if (!temp[item.id]) {
        temp[item.id] = {id: item.id, word: item.word, letter: item.letter, mean: item.mean, pronounce: item.pronounce, examples: [] }
        result.push(temp[item.id])
      }
      if (item.eid) {
        temp[item.id].examples.push({id: item.eid, en: item.en, zh: item.zh})
      }
    })

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
        await query(`UPDATE words SET off = 1 WHERE id = ?`, [id])
        await query(`UPDATE examples SET off = 1 WHERE wordID = ?`, [id])
      } else if (data.operate === '1') { // 更新
        await query(`UPDATE words SET word = ?, letter = ?, mean = ?, pronounce = ?, updateTime = ? WHERE id = ?`, [word, letter, mean, pronounce, date, id])
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
    ctx.body = {code: 200, message: '成功'}
  } catch(err) {
    throw new Error(err)
  }
})

module.exports = router