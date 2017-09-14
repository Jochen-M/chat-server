### Socket 消息类型定义
#### Server:
+ connection: client connect to server
+ disconnect: client unusual log out
+ message(fid, tid, msg): message from client
+ online: client log in (online)
+ leave: client usual log out (offline)
+ add-friend: add new friend request

#### Client
+ connect: client connect to server
+ msg(fid, tid, msg): message from server
+ disconnect: server disconnect
+ friend-request: add new friend request
