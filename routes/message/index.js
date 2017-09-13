'use strict';
const router = require('koa-router')();
const controller = require('./controller');

router.post('/getMessages', controller.getMessages);

module.exports = router;
