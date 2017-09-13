const router = require('koa-router')()
const user = require('./user');
const message = require('./message');

router.use('/user', user.routes(), user.allowedMethods());
router.use('/message', message.routes(), message.allowedMethods());

module.exports = router
