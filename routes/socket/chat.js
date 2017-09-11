'use strict';

let onlineList = [];

module.exports = async(io) => {
  try {
    io.on('connect', function(socket) {

      console.log('User ' + socket.id + ' connected.');
      onlineList.push(socket.id);

      socket.on('message', function(f_uid, t_uid, message) {
        io.to(onlineList[0]).emit('msg', message);
      });

      socket.on('disconnect', function(data) {
        console.log('User ' + socket.id + ' disconnected.');
        let index = onlineList.indexOf(socket.id);
        if(index != -1){
          onlineList.splice(index, 1);
          socket.leave(socket.id);
        }
      })

      console.log(onlineList);
    })
  } catch(err) {
    console.log(err);
  }
}
