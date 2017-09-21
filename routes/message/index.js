'use strict';
const router = require('koa-router')();
const controller = require('./controller');

router.post('/getMessages', controller.getMessages);
router.post('/getRequests', controller.getRequests);
router.post('/initChats', controller.initChats);

module.exports = router;
