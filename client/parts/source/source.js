import Peer from 'simple-peer';
import {
  Streams
} from '../../collections/Streams'
import {
  Peers
} from '../../collections/Peers'
import {
  deviceId
} from '../../js/deviceId'
import {
  Settings
} from '../../collections/Settings'

let io = require('socket.io-client');

Template.source.onCreated(function () {
  let t = this;
  t.subscribe('device_peers', deviceId);
  
  Meteor.call('add_source', deviceId);

  window.addEventListener('beforeunload', function () {
    Meteor.call('remove_source', deviceId);
  });
});

Template.source.onRendered(function () {
  let t = this;
  const PORT = Settings.findOne({
    _id: 'socket'
  }).port;
  t.connections = {};

  Peers.find({
    deviceId
  }).observeChanges({
    added(_id, peer) {
      //console.log('peer added : ', _id, peer);
      //start socket
      t.connections[_id] = {};
      t.connections[_id].socket = io(PORT);
      //console.log('socket : ', t.connections[_id].socket);
      t.connections[_id].socket.on('connect', function () {
        //console.log(t.connections[_id].socket.id);
        navigator.mediaDevices.getUserMedia(peer.constraints)
          .then(function (stream) {
            t.connections[_id].peer = new Peer({
              initiator: true,
              stream: stream
            });

            t.connections[_id].peer.on('signal', function (data) {
              t.connections[_id].socket.emit('signal', {
                signal: data,
                to: peer.socketId, //to
                from: t.connections[_id].socket.id
              });
            });

            t.connections[_id].socket.on('signal', function (data) {
              t.connections[_id].peer.signal(data.signal);
            });
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    },
    removed(_id) {
      //console.log('peer removed : ', _id);
      t.connections[_id].socket.close();
      t.connections[_id].peer.destroy();
    }
  });
});

Template.source.onDestroyed(function(){
  let t = this;

  Meteor.call('remove_source', deviceId);
});