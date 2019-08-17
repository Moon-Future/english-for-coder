const Router = require('koa-router')
const word = require('./api/word')
const router = new Router({
  prefix: '/api'
})

router.use('/word', word.routes())

module.exports = router