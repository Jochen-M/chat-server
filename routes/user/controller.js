'use strict';
const mongoose = require('mongoose');
require('../../models/user.model');
const User = mongoose.model('User');
require('../../models/message.model');
const Message = mongoose.model('Message');
const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify);

const config = require('../config');
const sort = require('../../utils/sort');

exports.login = async (ctx) => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let user = await User.findOne({username: username});
  if(user) {
    if(password == user.password) {
      let payload = {
        user_id: user._id,
      }
      let token = jwt.sign(payload, config().secret, {expiresIn: '12h'});
      ctx.response.body = {
        status: 200,
        message: '登录成功',
        token: token,
        user_id: user._id,
        username: user.username
      };
    } else {
      ctx.response.body = {status: 403, message: '密码错误'};
    }
  } else {
    ctx.response.body = {status: 403, message: '用户不存在'};
  }
};

exports.register = async (ctx) => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let exist_user = await User.findOne({username: username});
  if(!exist_user) {
    let user = new User({
      username: username,
      password: password
    });
    // TODO 加密
    await user.save();
    ctx.response.body = {status: 200, message: '注册成功'};
  } else {
    ctx.response.body = {status: 403, message: '该用户名已被注册'};
  }
};

exports.search = async (ctx) => {
  let token = ctx.header.authorization;
  if(token) {
    let payload = await verify(token.split(' ')[1], config().secret);    // 解密，获取payload
    if(payload) {
      let user_id = ctx.request.body.user_id;
      let search_text = ctx.request.body.search_text;
      let user = await User.findOne({_id: user_id}).populate('friends', '_id');
      let friends = [user_id];
      for(let i = 0; i < user.friends.length; i++) {
        friends.push(user.friends[i]._id);
      }
      let users = await User.find({_id: {$nin: friends}, username: {$regex: search_text, $options: 'i'}}).sort({username: 1});
      ctx.response.body = {status: 200, message: '搜索成功', users: users};
    } else {
      ctx.response.body = {status: 401, message: '认证失效'};
    }
  } else {
    ctx.response.body = {status: 401, message: '认证错误'};
  }
};

exports.dealRequest = async (ctx) => {
  let token = ctx.header.authorization;
  if(token) {
    let payload = await verify(token.split(' ')[1], config().secret);    // 解密，获取payload
    if(payload) {
      let agree = ctx.request.body.agree;
      let f_uid = ctx.request.body.f_uid;
      let t_uid = ctx.request.body.t_uid;
      console.log(f_uid);
      console.log(t_uid);
      await Message.remove({f_user: f_uid, t_user: t_uid});
      if(agree) {
        await User.update({_id: f_uid}, {$push: {friends: t_uid}});
        await User.update({_id: t_uid}, {$push: {friends: f_uid}});
        ctx.response.body = {status: 200, message: '添加好友成功'};
      } else {
        ctx.response.body = {status: 200, message: '已拒绝好友请求'};
      }
    } else {
      ctx.response.body = {status: 401, message: '认证失效'};
    }
  } else {
    ctx.response.body = {status: 401, message: '认证错误'};
  }
};

exports.initFriends = async (ctx) => {
  let token = ctx.header.authorization;
  if(token) {
    let payload = await verify(token.split(' ')[1], config().secret);    // 解密，获取payload
    if(payload) {
      let user_id = ctx.request.body.user_id;
      let user = await User
        .findOne({_id: user_id})
        .populate('friends');
      let friends = user.friends.sort(sort.sortByUsername);
      ctx.response.body = {status: 200, message: '初始化好友列表成功', friends: friends};
    } else {
      ctx.response.body = {status: 401, message: '认证失效'};
    }
  } else {
    ctx.response.body = {status: 401, message: '认证错误'};
  }
};

exports.getUserById = async (ctx) => {
  let token = ctx.header.authorization;
  if(token) {
    let payload = await verify(token.split(' ')[1], config().secret);    // 解密，获取payload
    if(payload) {
      let user_id = ctx.request.body.user_id;
      let user = await User.findOne({_id: user_id});
      ctx.response.body = {status: 200, message: '获取成功', user: user};
    } else {
      ctx.response.body = {status: 401, message: '认证失效'};
    }
  } else {
    ctx.response.body = {status: 401, message: '认证错误'};
  }
};
