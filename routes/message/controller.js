'use strict';
const mongoose = require('mongoose');
require('../../models/message.model');
const Message = mongoose.model('Message');
const LIMIT_COUNT = 30;

exports.getMessages = async (ctx) => {
  let f_uid = ctx.request.body.f_uid;
  let t_uid = ctx.request.body.t_uid;
  let messages = await Message
    .find({
      $or: [
        {f_user: f_uid, t_user: t_uid},
        {f_user: t_uid, t_user: f_uid}
      ]
    })
    .sort({created_at: -1})
    .limit(LIMIT_COUNT);
  ctx.response.body = {status: 200, message: '获取聊天记录成功', messages: messages};
};

exports.getRequests = async (ctx) => {
  let t_uid = ctx.request.body.t_uid;
  let requests = await Message
    .find({t_user: t_uid, type: 'request'})
    .populate('f_user')
    .sort({created_at: 1});
  ctx.response.body = {status: 200, message: '获取好友请求成功', requests: requests};
};

exports.initChats = async (ctx) => {
  let user_id = ctx.request.body.user_id;
  let messages = await Message
    .find({
      $or: [
        {f_user: user_id},
        {t_user: user_id}
      ]
    })
    .populate('f_user')
    .populate('t_user');
  let chats = {};
  for(let message of messages) {
    if(message.f_user._id == user_id)
      chats[message.t_user._id] = message;
    if(message.t_user._id == user_id)
      chats[message.f_user._id] = message;
  }
  ctx.response.body = {status: 200, message: '初始化聊天信息成功', chats: chats};
};
