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

let io = require('socket.io-client');

Template.source.onCreated(function () {
  let t = this;
  t.subscribe('device_peers', deviceId);
});

Template.source.onRendered(function () {
  let t = this;
  const PORT = 8080;

  Tracker.autorun(() => {

    //peers to this device streams
    let peers = Peers.find({
      deviceId
    }).fetch();

    peers.forEach((peer) => {
      console.log(peer);
      //start socket
      let socket = io(`http://localhost:${PORT}`);
      socket.on('connect', function () {
        console.log(socket.id);
        navigator.mediaDevices.getUserMedia(peer.constraints)
          .then(function (stream) {
            let source_peer = new Peer({
              initiator: true,
              stream: stream
            });

            source_peer.on('signal', function (data) {
              socket.emit('signal', {
                signal: data,
                to: peer.socketId, //to
                from: socket.id
              });
            });

            socket.on('signal', function (data) {
              source_peer.signal(data.signal);
            });
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    });
  });
});