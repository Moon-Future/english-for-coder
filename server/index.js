const Koa = require('koa')
const app = new Koa()
const cors = require('koa2-cors') // 解决跨域
// const bodyParser = require('koa-bodyparser')  // 解析POST请求数据
const koaBody = require('koa-body') // 可以上传文件
const static = require('koa-static')  // 关联静态文件
const path = require('path')
const router = require('./router')

app.use(cors({}))
// app.use(bodyParser())
app.use(koaBody({
  multipart: true
}))
app.use(static(path.join(__dirname, '../dist'))); // 部署上线时读取静态文件
app.use(router.routes()).use(router.allowedMethods())

app.listen(8887, () => {
  console.log('listen at port 8887...')
})