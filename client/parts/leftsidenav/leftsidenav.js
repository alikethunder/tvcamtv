import Peer from 'simple-peer';
import {
  Streams
} from '../../collections/Streams'
import {
  deviceId
} from '../../js/deviceId'

Template.leftsidenav.onCreated(function () {
  let t = this;

});

Template.leftsidenav.onRendered(function () {
  let t = this;
  t.$('.collapsible').collapsible();

  /*
  const PORT = 8080;
  let socket = require('socket.io-client')(`http://localhost:${PORT}`);

  socket.on('connect', function () {
    console.log('Connected to signalling server, self id : %s', socket.id);
  });

  let streams = Template.leftsidenav.__helpers.get('streams').call();

  streams.forEach(stream => {
    console.log("stream : ", stream);
    if (stream.deviceId == deviceId) {
      /// source pc
  
      start_video(t.stream, stream.constraints, 'output').then((stream) => {
        t.stream = stream;
        let peer = new Peer({
          initiator: true,
          stream: stream
        });
  
        peer.on('signal', function(data){
          socket.emit('signal', {signal: data, id: socket.id, initiator: true});
        });
        socket.on('signal', function(data){
          //peer.signal(data.signal)
          console.log('initiator socket signal : ', data);
        });
      });
  
    } else {
      // receiver pc
      let peer = new Peer();
  
      peer.on('signal', function(data){
        socket.emit('signal', {signal: data, peerId: socket.id});
      });
      
      peer.on('stream', function(stream){
        document.getElementById('output').srcObject = stream;
      });
  
      socket.on('signal', function(data){
        //peer.signal(data.signal)
        console.log('receiver socket signal : ', data);
      });
    }
  });
  */
});

Template.leftsidenav.helpers({
  streams() {
    return Streams.find().fetch()
  }
});