import http from 'http';
import socket_io from 'socket.io';

const PORT = 8080;

Meteor.startup(() => {
  // Server
  const server = http.createServer();
  const io = socket_io(server);

  let counter = 0;

  // New client
  io.on('connection', function (socket) {
    console.log('Connection with ID:', socket.id, Object.keys(io.sockets.connected));
    Object.keys(io.sockets.connected).forEach(function (socketId) {
      if (socketId != socket.id){
        console.log('Advertising peer %s to %s', socket.id, sock.id);
        io.sockets.connected[socketId].emit('peer', {
          peerId: socket.id,
          initiator: true
        });
        socket.emit('peer', {
          peerId: socketId,
          initiator: false
        });
      }
    });

    socket.on('signal', function (data) {
      var sock = io.sockets.connected[data.peerId];
      if (!sock) {
        return;
      }
      console.log('Proxying signal from peer %s to %s', socket.id, sock.id);

      sock.emit('signal', {
        signal: data.signal,
        peerId: socket.id
      });
    });
  });

  // Start server
  try {
    server.listen(PORT);
  } catch (e) {
    console.error(e);
  }
});