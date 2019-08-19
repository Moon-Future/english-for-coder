const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const jwt = require('jsonwebtoken')
const { tokenConfig } = require('../secret')
const { transporter, mailOptions, sendMsg } = require('./email')

router.post('/register', async (ctx) => {
  try {
    const data = ctx.request.body
    let { account, password, rePassword, name, website } = data
    const date = Date.now()
    const result = await query(`SELECT * FROM user WHERE account = ?`, [account])
    if (result.length !== 0) {
      ctx.body = {code: 0, message: '用户已存在'}
      return
    }
    if (password !== rePassword) {
      ctx.body = {code: 0, message: '两次密码不同'}
      return
    }
    let websiteList = []
    let websiteSplit = website.replace(/\n/, '').trim().split(/,|;/)
    for (let i = 0, len = websiteSplit.length; i < len; i++) {
      let item = websiteSplit[i]
      let name = item.match(/\[(.*?)\]/) && item.match(/\[(.*?)\]/)[1].trim()
      let url = item.match(/\((.*?)\)/) && item.match(/\((.*?)\)/)[1].trim()
      if (name && url) {
        websiteList.push({name, url})
      }
      if (websiteList.length === 3) {
        break;
      }
    }
    let userID = shortid.generate()
    await query(`INSERT INTO user (id, account, password, name, avatar, createTime) 
      VALUES (?, ?, ?, ?, ?, ?)`, [userID, account.trim(), password, name.trim(), '', date])
    for (let i = 0, len = websiteList.length; i < len; i++) {
      let item = websiteList[i]
      await query(`INSERT INTO user_website (id, userID, name, url, createTime) 
        VALUES (?, ?, ?, ?, ?)`, [shortid.generate(), userID, item.name, item.url, date])
    }
    ctx.body = {code: 1, message: '注册成功'}
    // mailOptions.html = `
    //   <h1>${sendMsg.newUser}</h1>
    //   <p>${sendMsg.email}: ${account}</p>
    //   <p>${sendMsg.name}: ${name}</p>
    //   <p>${sendMsg.time}: ${new Date()}</p>
    // `
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     return console.log(error);
    //   }
    // })
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/login', async (ctx) => {
  try {
    const data = ctx.request.body
    const { account, password } = data
    const result = await query(`SELECT * FROM user WHERE account = ? AND password = ?`, [account, password])
    if (result.length === 0) {
      ctx.body = {code: 0, message: '用户名或密码有误'}
      return
    }
    const websiteRst = await query(`SELECT * FROM user_website WHERE userID = ?`, [result[0].id])
    const userInfo = {
      id: result[0].id,
      name: result[0].name,
      avatar: result[0].avatar,
      website: websiteRst
    }
    const token = jwt.sign(userInfo, tokenConfig.privateKey, {expiresIn: '1d'})
    ctx.body = {code: 1, message: '登陆成功', data: {token, userInfo}}
  } catch(err) {
    throw new Error(err)
  }
})

module.exports = router