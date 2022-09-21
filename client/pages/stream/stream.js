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
import {
  ServerDate
} from '../../../lib/collections/serverDate';
import {
  Settings
} from '../../collections/Settings'

Template.stream.onCreated(function () {
  let t = this;

  t.clean_data = function () {
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

  t.autorun(() => {
    t.subscribe('stream', Router.current().params._id);
    t.subscribe('peers', Router.current().params._id);
  });

  ['beforeunload', 'unload', 'pagehide'].forEach((ev) => {
    window.addEventListener(ev, function () {
      Blaze.remove(t.view);
    });
  });

  t.variables = {
    devices: new ReactiveVar({}),
    record_in_progress: new ReactiveVar(false),
    recorded_blobs: new ReactiveVar([]),
    record_started: undefined,
    record_finished: undefined,
    channel_loading: new ReactiveVar(true)
  };
  t.mediaRecorder;
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
  let serverDate = ServerDate.findOne().date;

  t.autorun(() => {
    if (Router.current().params._id) {
      Materialize.updateTextFields();
      if (t.socket || t.peerId || t.stream) {
        t.clean_data();
      }

      let stream = Tracker.nonreactive(() => {
        return Template.stream.__helpers.get('stream').call()
      });
      t.subscribe('source', stream.deviceId);
      //console.log('stream : ', stream);

      if (stream.deviceId == deviceId) {
        //source pc
        t.variables.channel_loading.set(false);
        t.variables.constraints = stream.constraints;
        start_video(t.stream, t.variables.constraints, 'output').then((stream) => {
          t.stream = stream;
        });
      } else {
        // receiver pc
        const {PORT} = Settings.findOne({
          _id: 'socket'
        });
        t.socket = require('socket.io-client')(`${window.location.protocol}//${window.location.hostname}:${PORT}`);
        //console.log('socket : ', t.socket);
        t.socket.on('connect', function () {
          //console.log('socket connected');
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
              t.variables.channel_loading.set(false);
              t.stream = stream;
              Meteor.defer(() => { document.getElementById('output').srcObject = stream; })
            });
          });
        });
      }
    }
  });

  //reload page if stream constraints changed & if this is a peer
  t.autorun(() => {
    if (Router.current().params._id) {
      if (Tracker.nonreactive(() => {
        return Template.stream.__helpers.get('stream').call()
      }).deviceId != deviceId) {
        Streams.find({
          _id: Router.current().params._id
        }).observeChanges({
          changed(id, stream) {
            if (stream.constraints) {
              //console.log('changed');
              location.reload()
            }
          }
        });
      }
    }
  });
});

Template.stream.onDestroyed(function () {
  let t = this;
  t.clean_data();
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
  record_in_progress() {
    return Template.instance().variables.record_in_progress.get()
  },
  recording() {
    return Template.instance().variables.recorded_blobs.get().length
  },
  channel_loading() {
    return Template.instance().variables.channel_loading.get()
  }
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
  'click .start_record'(e, t) {
    t.variables.record_in_progress.set(true);
    t.variables.record_started = ServerDate.findOne().date;
    t.variables.recorded_blobs.set([])
    t.mediaRecorder = new MediaRecorder(t.stream, {
      mimeType: 'video/webm'
    });
    t.mediaRecorder.ondataavailable = function (ev) {
      if (ev.data && ev.data.size > 0) {
        let b = t.variables.recorded_blobs.get();
        b.push(ev.data);
        t.variables.recorded_blobs.set(b);
      }
    }
    t.mediaRecorder.start(10);
    t.record_timeout = Meteor.setTimeout(() => {
      $('.stop_record').click();
      $('.download_record').click();
      Meteor.setTimeout(() => {
        $('.start_record').click()
      }, 100);
    }, 3600000);
  },
  'click .stop_record'(e, t) {
    Meteor.clearTimeout(t.record_timeout);
    t.variables.record_in_progress.set(false);
    t.mediaRecorder.stop();
    t.variables.record_finished = ServerDate.findOne().date;
  },
  'click .download_record'(e, t) {
    t.variables.record_finished = t.variables.record_in_progress.get() ? ServerDate.findOne().date : t.variables.record_finished || ServerDate.findOne().date;

    let url = window.URL.createObjectURL(new Blob(t.variables.recorded_blobs.get(), {
      type: 'video/webm'
    }));
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.target = '_blank';
    a.download = `${$('#name').val()} - ${moment(t.variables.record_started).format('D MMM YYYY HH:mm:ss')} - ${moment(t.variables.record_finished).format('D MMM YYYY HH:mm:ss')}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  },
});