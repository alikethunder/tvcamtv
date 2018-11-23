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
  t.autorun(() => {
    t.subscribe('stream', Router.current().params._id);
    t.subscribe('peers', Router.current().params._id);
  });

  window.addEventListener('beforeunload', function () {
    t.peerId && Meteor.call('remove_receiver', t.peerId);
    t.socket && t.socket.emit('close_connection', {
      to: t.to
    });
    t.stream && t.stream.getTracks().forEach(track => track.stop());
    delete t.socket;
    delete t.peerId;
    delete t.stream;
    delete t.to
  });

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

  t.autorun(() => {
    if (Router.current().params._id) {
      Materialize.updateTextFields();
      if (t.socket || t.peerId || t.stream) {
        // close previous collection && clear all its data
        t.peerId && Meteor.call('remove_receiver', t.peerId);
        t.socket && t.socket.emit('close_connection', {
          to: t.to
        });
        t.stream && t.stream.getTracks().forEach(track => track.stop());
        delete t.socket;
        delete t.peerId;
        delete t.stream;
        delete t.to
      }

      let stream = Template.stream.__helpers.get('stream').call();
      //console.log('stream : ', stream);

      if (stream.deviceId == deviceId) {
        //source pc
        t.variables.constraints = stream.constraints;
        start_video(t.stream, t.variables.constraints, 'output').then((stream) => {
          t.stream = stream;
        });
      } else {
        // receiver pc
        const PORT = 8080;
        t.socket = require('socket.io-client')(`http://localhost:${PORT}`);
        t.socket.on('connect', function () {
          t.peerId = new Mongo.ObjectID()._str;
          Meteor.call('add_receiver', t.peerId, stream._id, stream.deviceId, stream.constraints, t.socket.id, function () {
            let peer = new Peer();
            peer.on('signal', function (data) {
              t.socket.emit('signal', {
                signal: data,
                to: t.to, //to
              })
            });

            t.socket.on('signal', function (data) {
              peer.signal(data.signal);
              t.to = data.from;
            });

            peer.on('stream', function (stream) {
              t.stream = stream;
              document.getElementById('output').srcObject = stream;
            });
          });
        });

        //reload page if stream constraints changed
        t.autorun(()=>{
          Streams.find({
            _id: Router.current().params._id
          }).observeChanges({
            changed(id, stream){
              if (stream.constraints){
                location.reload()
              }
            }
          })
        });
      }
    }
  });

});

Template.stream.onDestroyed(function () {
  let t = this;
  t.peerId && Meteor.call('remove_receiver', t.peerId);
  t.socket && t.socket.emit('close_connection', {
    to: t.to
  });
  t.stream && t.stream.getTracks().forEach(track => track.stop());
  delete t.socket;
  delete t.peerId;
  delete t.stream;
  delete t.to
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