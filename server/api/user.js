const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const shortid = require('shortid')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { checkToken, dateFormat } = require('./util')
const { tokenConfig, githubConfig } = require('../secret')
const { transporter, mailOptions } = require('./email')
const cosUpload = require('./tencentCloud')

function websiteFormat(str) {
  let websiteList = []
  let websiteSplit = str.replace(/\n/g, '').trim().split(/,|;/)
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
  return websiteList
}

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
    if (account.trim().length > 100) {
      ctx.body = {code: 0, message: '用户长度在 1 到 100 个字符'}
      return
    }
    let websiteList = websiteFormat(website)
    let userID = shortid.generate()
    await query(`INSERT INTO user (id, account, password, name, avatar, email, createTime) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`, [userID, account.trim(), password, name.trim().slice(0, 10), '', account.trim(), date])
    for (let i = 0, len = websiteList.length; i < len; i++) {
      let item = websiteList[i]
      await query(`INSERT INTO user_website (id, userID, name, url, createTime) 
        VALUES (?, ?, ?, ?, ?)`, [shortid.generate(), userID, item.name, item.url, date])
    }
    ctx.body = {code: 1, message: '注册成功'}
    mailOptions.subject = 'English4Coder 有新的注册用户'
    mailOptions.html = `
      <h1>新注册用户</h1>
      <p>账户: ${account}</p>
      <p>昵称: ${name}</p>
      <p>时间: ${dateFormat(new Date(), 'yyyy-MM-dd hh:mm')}</p>
    `
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    })
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
      account: result[0].account,
      name: result[0].name,
      avatar: result[0].avatar,
      createTime: result[0].createTime,
      email: result[0].email || result[0].account,
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

router.get('/getUser', async (ctx) => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    ctx.body = {code: 0, message: '请先登陆'}
    return
  }
  if (!userInfo.root) {
    ctx.body = {code: 0, message: '没有权限'}
    return
  }
  try {
    let rst = await query(`SELECT * FROM user WHERE off != 1`)
    ctx.body = {code: 1, data: rst}
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
      account: 'Github',
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
      userInfo.avatar = result[0].avatar
      userInfo.name = result[0].name
      userInfo.email = result[0].email
      userInfo.createTime = result[0].createTime
    }
    // 登陆时间
    await query(`UPDATE user SET lastTime = ? WHERE id = ?`, [Date.now(), userID])
    const token = jwt.sign(userInfo, tokenConfig.privateKey)

    ctx.response.redirect(githubConfig[NODE_ENV].redirect + '?token=Bearer ' + token);
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/updateUserInfo', async (ctx) => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    ctx.body = {code: 0, message: '请先登陆'}
    return
  }
  try {
    const data = ctx.request.body
    const { info, name, email, website, old, newPass, reNew } = data
    let token, flag = false
    if (info) { // 信息更新
      if (email.trim().length > 100) {
        ctx.body = {code: 0, message: '邮箱长度在 1 到 100 个字符'}
        return
      }
      // 信息是否更新
      if (userInfo.name !== name || userInfo.email !== email) {
        await query(`UPDATE user SET name = ?, email = ? WHERE id = ?`, [name.trim().slice(0, 10), email.trim(), userInfo.id])
        userInfo.name = name
        userInfo.email = email
        flag = true
      }
      // website是否更新
      let webstr = ''
      userInfo.website.forEach(item => {
        webstr += `[${item.name}](${item.url})`
      })
      if (webstr !== website.trim().replace(/\n|,/g, '')) {
        let websiteList = websiteFormat(website)
        await query(`DELETE FROM user_website WHERE userID = ?`, [userInfo.id])
        for (let i = 0, len = websiteList.length; i < len; i++) {
          let item = websiteList[i]
          await query(`INSERT INTO user_website (id, userID, name, url, createTime)
            VALUES (?, ?, ?, ?, ?)`, [shortid.generate(), userInfo.id, item.name, item.url, userInfo.createTime])
        }
        userInfo.website = websiteList
        flag = true
      }
      if (flag) {
        token = jwt.sign(userInfo, tokenConfig.privateKey)
        ctx.body = {code: 1, message: '信息修改成功', data: {userInfo, token: 'Bearer ' + token} }
      } else {
        ctx.body = {code: 1, message: '无需更新'}
      }
    } else { // 修改密码
      if (userInfo.id.includes('Github')) {
        ctx.body = {code: 0, message: 'Github用户'}
        return
      }
      if (newPass !== reNew) {
        ctx.body = {code: 0, message: '两次密码不同'}
        return
      }
      const rst = await query(`SELECT * FROM user WHERE id = ? AND password = ?`, [userInfo.id, old])
      if (rst.length === 0) {
        ctx.body = {code: 0, message: '原密码错误'}
        return
      }
      await query(`UPDATE user SET password = ? WHERE id = ?`, [newPass, userInfo.id])
      ctx.body = {code: 1, message: '密码修改成功'}
    }
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/upload', async (ctx) => {
  const userInfo = checkToken(ctx)
  if (!userInfo) {
    ctx.body = {code: 0, message: '请先登陆'}
    return
  }
  try {
    const file = ctx.request.files.file
    let token
    if (file.size / 1024 > 500) {
      ctx.body = {code: 0, message: '上传头像图片大小不能超过 500kb!'}
      return
    }
    const result = await cosUpload(userInfo.id + '.jpg', file.path)
    let avatar = '', code = 1, message = '上传成功'
    if (result.statusCode === 200) {
      avatar = 'https://' + result.Location + '?r=' + Math.random()
      userInfo.avatar = avatar
      token = jwt.sign(userInfo, tokenConfig.privateKey)
      await query(`UPDATE user SET avatar = ? WHERE id = ?`, [avatar, userInfo.id])
    } else {
      code = 0
      message = '上传失败'
    }
    ctx.body = {code, message, data: {avatar, token: 'Bearer ' + token}}
  } catch(err) {
    throw new Error(err)
  }
})

module.exports = router