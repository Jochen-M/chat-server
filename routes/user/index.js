'use strict';
const router = require('koa-router')();
const controller = require('./controller');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/search', controller.search);
router.post('/addFriend', controller.addFriend);
router.post('/initFriends', controller.initFriends);

module.exports = router;
