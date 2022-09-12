import socket_io from 'socket.io';
import { Settings } from './collections/Settings'

import https from 'https'

import { readFileSync } from 'fs'

const [, , host, port] = Meteor.absoluteUrl().match(/([a-zA-Z]+):\/\/([\-\w\.]+)(?:\:(\d{0,5}))?/);

if (
  !Settings.findOne({
    _id: 'socket'
  })
) {
  Settings.insert({
    _id: 'socket',
    port: 'http://localhost:1745', //'https://tvcamtv.com:1745'
    server_port: 1745
  })
}

const PORT = Settings.findOne({
  _id: 'socket'
}).server_port;

if (port != 3000) {

  let { key, cert } = Settings.findOne({ _id: 'ssl_certificates' });

  let server = https.createServer({
    key: readFileSync(key),
    cert: readFileSync(cert)
  }).listen(PORT);
  
  Meteor.startup(() => {
    // Server
    const io = socket_io(server);
    //console.log('io : ', io);
    // New client
    io.on('connection', function (socket) {
      //console.log('socket : ', socket);
      socket.on('signal', function (data) {
        socket.to(data.to).emit('signal', data);
      });

      socket.on('close_connection', function (data) {
        io.sockets.connected[data.to] && io.sockets.connected[data.to].disconnect();
        socket.disconnect();
      });

      socket.on('close_connections', function (data) {
        data.sockets.forEach((socketId) => {
          io.sockets.connected[socketId] && io.sockets.connected[socketId].disconnect();
        });
      });
    });
  });
} else {
  Meteor.startup(() => {
    // Server
    const io = socket_io(PORT);
    //console.log('io : ', io);
    // New client
    io.on('connection', function (socket) {
      //console.log('socket : ', socket);
      socket.on('signal', function (data) {
        socket.to(data.to).emit('signal', data);
      });

      socket.on('close_connection', function (data) {
        io.sockets.connected[data.to] && io.sockets.connected[data.to].disconnect();
        socket.disconnect();
      });

      socket.on('close_connections', function (data) {
        data.sockets.forEach((socketId) => {
          io.sockets.connected[socketId] && io.sockets.connected[socketId].disconnect();
        });
      });
    });
  });
}