import http from 'http';
import socket_io from 'socket.io';

const PORT = 8080;

Meteor.startup(() => {
  // Server
  const server = http.createServer();
  const io = socket_io(server);

  // New client
  io.on('connection', function (socket) {
    console.log('%s Peer Connected', socket.id);
    console.log('connected sockets : ', Object.keys(io.sockets.connected));

    socket.on('new_peer', function (data) {
      io.sockets.connected[data.socketId].emit('new_peer_connected', {
        id: socket.id
      })
    });

    socket.on('signal', function (data) {
      //console.log('server socket signal received : ', data);
      io.sockets.connected[data.socketId].emit('signal', data);
    });
  });

  // Start server
  try {
    server.listen(PORT);
  } catch (e) {
    console.error(e);
  }
});