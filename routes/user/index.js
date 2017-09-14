'use strict';
const router = require('koa-router')();
const controller = require('./controller');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/search', controller.search);
router.post('/dealRequest', controller.dealRequest);
router.post('/initFriends', controller.initFriends);
router.post('/getUserById', controller.getUserById);

module.exports = router;
