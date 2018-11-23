import socket_io from 'socket.io';

const PORT = 8080;

Meteor.startup(() => {
  // Server
  const io = socket_io(PORT);

  // New client
  io.on('connection', function (socket) {

    socket.on('signal', function (data) {
      socket.to(data.to).emit('signal', data);
    });

    socket.on('close_connection', function(data){
      io.sockets.connected[data.to].disconnect();
      socket.disconnect();
    })
  });
});