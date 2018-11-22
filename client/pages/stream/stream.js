import Peer from 'simple-peer';
import {
  deviceId
} from '../../js/deviceId'
import {
  start_video
} from '../../js/start_video'
import {
  Streams
} from '../../collections/Streams'

Template.stream.onCreated(function () {
  let t = this;

  t.subscribe('stream', Router.current().params._id);
  t.subscribe('peers', Router.current().params._id);


  /*window.addEventListener('beforeunload', function () {
    Meteor.call('remove_remote_peer_desc', t.peerId);
  });*/

  t.variables = {
    devices: new ReactiveVar({})
  };

  t.stream;

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach((device, index) => {
      let d = t.variables.devices.get();
      d[device.kind] = d[device.kind] ? d[device.kind] : [];
      d[device.kind].push(device);
      t.variables.devices.set(d);
      if (index == devices.length - 1) {
        Meteor.setTimeout(() => {
          t.$('select').material_select();
        }, 0);
      }
    });
  });
});

Template.stream.onRendered(function () {
  let t = this;
  Materialize.updateTextFields();

  let s = Template.stream.__helpers.get('stream').call();
  console.log('stream : ', s);
  const PORT = 8080;
  let socket = require('socket.io-client')(`http://localhost:${PORT}`);

  socket.on('connect', function () {
    console.log('Connected to signalling server, self id : %s', socket.id);

    if (s.deviceId == deviceId) {
      /// source pc
      t.variables.constraints = s.constraints;
      start_video(t.stream, t.variables.constraints, 'output').then((stream) => {
        t.stream = stream;

        socket.on('new_peer', function (data) {
          let peer = new Peer({
            initiator: true,
            stream: stream
          });
          peer.on('signal', function (data) {
            socket.emit('signal', {
              signal: data,
              id: socket.id,
              initiator: true
            });
          });
          socket.on('signal', function (data) {
            //console.log('initiator socket signal received : ', data);
            peer.signal(data.signal);
          });
        });
      });
    } else {
      // receiver pc
      let peer = new Peer();

      peer.on('signal', function (data) {
        socket.emit('signal', {
          id: socket.id,
          signal: data
        })
      });

      socket.on('signal', function (data) {
        //console.log('receiver socket signal  received : ', data);
        peer.signal(data.signal);
      });

      peer.on('stream', function(stream){
        document.getElementById('output').srcObject = stream;
      });
    }
  });
});

Template.stream.onDestroyed(function () {
  let t = this;
});

Template.stream.helpers({
  stream() {
    return Streams.findOne({
      _id: Router.current().params._id
    })
  },
  sameDevice(devId) {
    let t = Template.instance();

    if (deviceId == devId) {
      Meteor.setTimeout(() => {
        t.$('select').material_select();
      }, 0)
    }
    return deviceId == devId
  },
  video() {
    return Template.instance().variables.devices.get()['videoinput']
  },
  audio() {
    return Template.instance().variables.devices.get()['audioinput']
  },
});

Template.stream.events({
  'click .remove_stream'(e, t) {
    Meteor.call('remove_stream', Router.current().params._id, function (err, res) {
      if (!err) {
        Materialize.toast('Канал удален', 1000);
        Router.go('/add_stream');
      } else console.log(err);
    })
  },
  'blur #name'(e, t) {
    Meteor.call('update_stream_name', Router.current().params._id, e.target.value);
  },
  'change select'(e, t) {
    t.variables.constraints[e.target.id] = !!e.target.value ? {
      deviceId: e.target.value
    } : false;
    Meteor.call('update_constraints', Router.current().params._id, t.variables.constraints, function (err, res) {
      if (!err) {
        start_video(t.stream, t.variables.constraints, 'output').then(res => t.stream = res);
      } else console.log(err);
    });
  },
});