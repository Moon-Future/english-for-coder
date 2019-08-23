const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const { checkToken } = require('./util')

router.get('/wordsList', async (ctx) => {
  try {
    const params = ctx.request.query
    const { search, word, admin, userID } = params
    let letter = params.letter
    let res, temp ={}, result = [],
      sql = `SELECT a.id, a.word, a.letter, a.mean, a.pronounce, a.verify, a.createTime, e.id AS eid, e.en, e.zh, u.id AS userID, u.name, u.avatar FROM word AS a 
      LEFT JOIN word_example AS e ON a.id = e.wordID AND e.off != 1 
      LEFT JOIN user AS u ON a.userID = u.id
      WHERE a.off != 1 AND ${admin ? 'true' : 'a.verify = 1'} `
    if (!search) {
      if (letter === 'hot') {
        sql += 'AND a.counter >= 10'
      } else if (letter === 'all') {

      } else if (userID) {
        sql += 'AND a.userID = ?'
        letter = userID
      } else {
        sql += 'AND a.letter = ?'
      }
    } else {
      sql += 'AND a.word LIKE ?'
      letter = `%${word.trim()}%`
    }
    sql += ' ORDER BY a.createTime'
    res = await query(sql, [letter])

    res.forEach(item => {
      if (!temp[item.id]) {
        temp[item.id] = {
          id: item.id, word: item.word, letter: item.letter, mean: item.mean, pronounce: item.pronounce,
          verify: item.verify, createTime: item.createTime, userID: item.userID, name: item.name, 
          avatar: item.avatar, examples: []}
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
  const userInfo = checkToken(ctx)
  try {
    const data = ctx.request.body
    const word = data.word.trim()
    const mean = data.mean.trim()
    const pronounce = data.pronounce.trim()
    const examples = data.examples
    const admin = userInfo && userInfo.root
    const date = Date.now()
    let id = data.id
    let letter
    let body = {code: 1, message: admin ? '成功' : '谢谢🙏，提交成功，等待审核。'}
    if (word === '') {
      ctx.body = {code: 0, message: '"单词"项不得为空'}
      return
    }
    letter = word[0].toLocaleUpperCase()
    if (id) {
      if (data.operate === '3') { // 删除
        // 管理员、未审批的添加者 可删除
        if (userInfo.root || (data.verify != '1' && userInfo.id == data.userID)) {
          await query(`UPDATE word SET off = 1 WHERE id = ?`, [id])
          await query(`UPDATE word_example SET off = 1 WHERE wordID = ?`, [id])
          body.message = '删除成功'
        } else {
          body = {code: 0, message: '没有权限'}
        }
      } else if (data.operate === '1') { // 更新
        await query(`UPDATE word SET word = ?, letter = ?, mean = ?, pronounce = ?, updateTime = ? WHERE id = ?`, [word, letter, mean, pronounce, date, id])
        body.message = '更新成功'
      }
    } else {
      id = shortid.generate()
      await query(`INSERT INTO word (id, word, letter, mean, pronounce, userID, createTime, verify) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [id, word, letter, mean, pronounce, data.userID, date, admin ? 1 : 0])
    }
    for (let i = 0, len = examples.length; i < len; i++) {
      const example = examples[i]
      const exid = example.id
      const en = example.en.trim()
      const zh = example.zh.trim()
      if (exid) {
        if (example.operate === '3') { // 删除
          await query(`UPDATE word_example SET off = 1 WHERE id = ?`, [exid])
        } else if (example.operate === '1') { // 更新
          if (en === '') { continue }
          await query(`UPDATE word_example SET en = ?, zh = ?, updateTime = ? WHERE id = ?`, [en, zh, date, exid])
        }
      } else {
        if (en === '') { continue }
        await query(`INSERT INTO word_example (id, wordID, en, zh, createTime) VALUES (?, ?, ?, ?, ?)`, 
          [shortid.generate(), id, en, zh, date])
      }
    }
    ctx.body = body
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/changeVerify', async (ctx) => {
  const userInfo = checkToken(ctx)
  if (!userInfo || !userInfo.root) {
    ctx.body = {code: 0, message: '没有权限'}
    return
  }
  try {
    const data = ctx.request.body
    await query(`UPDATE word SET verify = ? WHERE id = ?`, [data.verify, data.id])
    ctx.body = {code: 1, message: '成功'}
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/exportWord', async (ctx) => {
  const userInfo = checkToken(ctx)
  if (!userInfo || !userInfo.root) {
    ctx.body = {code: 0, message: '没有权限'}
    return
  }
  try {
    const jsonData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data.json'), 'utf-8'))
    for (let i = 0, len = jsonData.length; i < len; i++) {
      if (jsonData[i].id) {
        continue
      }
      let item = jsonData[i]
      let { word, mean, pronounce, examples = [] } = item
      let letter = word[0].toLocaleUpperCase()
      let id = shortid.generate()
      item.id = id
      await query(`INSERT INTO word (id, word, letter, mean, pronounce, createTime, verify) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [id, word, letter, mean, pronounce, Date.now(), 1])
      for (let j = 0; j < examples.length; j++) {
        examples[j].id = shortid.generate()
        await query(`INSERT INTO word_example (id, wordID, en, zh, createTime) VALUES (?, ?, ?, ?, ?)`, 
          [examples[j].id, id, examples[j].en, examples[j].zh, Date.now()])
      }
    }
    fs.writeFileSync(path.resolve(__dirname, '../data.json'), JSON.stringify(jsonData), 'utf-8')
    ctx.body = {code: 1, message: '导入完成'}
  } catch(err) {
    throw new Error(err)
  }
})

module.exports = router