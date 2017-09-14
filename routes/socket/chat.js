'use strict';

const mongoose = require('mongoose');
require('../../models/message.model');
const Message = mongoose.model('Message');

let onlineList = {};

module.exports = async(io) => {
  try {
    io.on('connect', function(socket) {

      console.log('User ' + socket.id + ' connected.');
      console.log(onlineList);

      socket.on('online', function(uid) {
        onlineList[uid] = socket.id;
        console.log(uid + ' online.');
        console.log(onlineList);
      });

      socket.on('message', function(f_uid, t_uid, message) {
        console.log(f_uid + '-' + t_uid + ': ' + message);

        // 存入数据库
        new Message({
          f_user: f_uid,
          t_user: t_uid,
          content: message
        }).save();

        if(onlineList[t_uid] && onlineList[t_uid] != null) {
          io.to(onlineList[t_uid]).emit('msg', f_uid, t_uid, message);
        }
      });

      socket.on('add-friend', function(f_uid, t_uid, request_info) {
        console.log(f_uid + '-' + t_uid + ': ' + request_info);
        if(onlineList[t_uid] && onlineList[t_uid] != null) {
          io.to(onlineList[t_uid]).emit('friend-request', f_uid, request_info);
        } else {
          // 存入数据库
          new Message({
            f_user: f_uid,
            t_user: t_uid,
            content: request_info,
            type: 'request'
          }).save();
        }
      });

      socket.on('disconnect', function() {
        console.log('User ' + socket.id + ' disconnected.');
        for(let user of Object.entries(onlineList)) {
          if(socket.id == user[1]) {
            onlineList[user[0]] = null;
          }
        }
        console.log(onlineList);
      })

      socket.on('leave', function(uid) {
        io.to(onlineList[uid]).emit('disconnect');
        onlineList[uid] = null;
        console.log('User ' + socket.id + ' leaved.');
        console.log(onlineList);
      })
    })
  } catch(err) {
    console.log(err);
  }
}
