const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const { transporter, mailOptions, sendMsg } = require('./email')

router.post('/register', async (ctx) => {
  try {
    const data = ctx.request.body
    const { account, password, rePassword, name, website } = data
    const date = Date.now()
    const result = await query(`SELECT * FROM user WHERE account = ?`, [account])
    if (result.length !== 0) {
      ctx.body = {code: 0, message: '用户已存在'}
      return
    }
    await query(`INSERT INTO user (id, account, password, name, avatar, createTime) 
      VALUES (?, ?, ?, ?, ?, ?)`, [shortid.generate(), account.trim(), password, name.trim(), '', date])
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

module.exports = router