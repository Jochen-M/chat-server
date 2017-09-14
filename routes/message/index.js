'use strict';
const router = require('koa-router')();
const controller = require('./controller');

router.post('/getMessages', controller.getMessages);
router.post('/getRequests', controller.getRequests);

module.exports = router;
