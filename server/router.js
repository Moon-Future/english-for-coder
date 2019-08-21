const Router = require('koa-router')
const word = require('./api/word')
const user = require('./api/user')
const comment = require('./api/comment')
const router = new Router({
  prefix: '/api'
})

router.use('/word', word.routes())
router.use('/user', user.routes())
router.use('/comment', comment.routes())

module.exports = router