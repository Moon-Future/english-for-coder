const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { tokenConfig, githubConfig } = require('../secret')
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
    await query(`INSERT INTO user (id, account, password, name, avatar, email, createTime) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`, [userID, account.trim(), password, name.trim(), '', account, date])
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
    // 登陆时间
    await query(`UPDATE user SET lastTime = ? WHERE id = ?`, [Date.now(), result[0].id])
    const websiteRst = await query(`SELECT * FROM user_website WHERE userID = ?`, [result[0].id])
    const userInfo = {
      id: result[0].id,
      name: result[0].name,
      avatar: result[0].avatar,
      website: websiteRst,
    }
    if (result[0].root == 1) {
      userInfo.root = true
    }
    const token = jwt.sign(userInfo, tokenConfig.privateKey, {expiresIn: '7d'})
    ctx.body = {code: 1, message: '登陆成功', data: {token: 'Bearer ' + token, userInfo}}
  } catch(err) {
    throw new Error(err)
  }
})

router.get('/getUserMore', async (ctx) => {
  try {
    const params = ctx.request.query
    const { userID } = params
    const result = await query(`SELECT * FROM user_website WHERE userID = ?`, [userID])
    ctx.body = {code: 1, data: result}
  } catch(err) {
    throw new Error(err)
  }
})

router.get('/getUserInfo', async (ctx) => {
  try {
    const token = ctx.get('Authorization')
    let userInfo = {}
    if (token === '') {
      ctx.body = {userInfo, loginStatus: false}
    } else {
      try {
        userInfo = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
        ctx.body = {userInfo, loginStatus: true}
      } catch(err) {
        ctx.body = {userInfo, loginStatus: false}
      }
    }
  } catch(err) {
    throw new Error(err)
  }
})

// Github授权登陆
router.get('/githubCallback', async (ctx) => {
  try {
    const host = ctx.get('host')
    const NODE_ENV = host.includes('localhost') ? 'dev' : 'pro' // dev, pro
    const params = ctx.request.query
    const tokenResponse = await axios.post(githubConfig.accessURL, {
      client_id: githubConfig[NODE_ENV].client_id,
      client_secret: githubConfig[NODE_ENV].client_secret,
      code: params.code
    })
    const userResponse = await axios.get(`${githubConfig.tokenURL}${tokenResponse.data}`)
    const userData = userResponse.data
    const userID = userData.id + 'Github'
    const date = Date.now()
    let userInfo = {
      id: userID,
      name: userData.name,
      avatar: userData.avatar_url,
      email: userData.email
    }
    let websiteList = [{name: 'Github', url: userData.html_url}]
    if (userData.blog) {
      websiteList.push({name: 'Blog', url: userData.blog})
    }
    userInfo.website = websiteList

    // 注册
    const result = await query(`SELECT * FROM user WHERE id = ?`, [userID])
    if (result.length === 0) {
      await query(`INSERT INTO user (id, name, avatar, email, createTime) 
        VALUES (?, ?, ?, ?, ?)`, [userID, userInfo.name, userInfo.avatar, userInfo.email, date])
      for (let i = 0, len = websiteList.length; i < len; i++) {
        let item = websiteList[i]
        await query(`INSERT INTO user_website (id, userID, name, url, createTime) 
          VALUES (?, ?, ?, ?, ?)`, [shortid.generate(), userID, item.name, item.url, date])
      }
    } else {
      if (result[0].root == 1) {
        userInfo.root = true
      }
    }
    // 登陆时间
    await query(`UPDATE user SET lastTime = ? WHERE id = ?`, [Date.now(), userID])
    const token = jwt.sign(userInfo, tokenConfig.privateKey, {expiresIn: '7d'})

    ctx.response.redirect(githubConfig[NODE_ENV].redirect + '?token=Bearer ' + token);
  } catch(err) {
    throw new Error(err)
  }
})

module.exports = router