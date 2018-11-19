///// add code for reloading all remote peers on source page reload ///////

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
  Peers
} from '../../collections/Peers'

Template.stream.onCreated(function () {
  let t = this;

  t.subscribe('stream', Router.current().params._id);
  t.subscribe('peers', Router.current().params._id);

  window.addEventListener('beforeunload', function () {
    Meteor.call('remove_remote_peer_desc', t.peerId);
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
  Materialize.updateTextFields();
  let s = Template.stream.__helpers.get('stream').call();

  console.log(s);

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };

  const configuration = {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  };

  if (s.deviceId == deviceId) {
    t.variables.constraints = s.constraints;
    let remote_peer_desc = Streams.findOne();

    //peer connection pc1

    let p = new RTCPeerConnection(configuration);
    start_video(t.stream, t.variables.constraints, 'output').then((res) => {
      t.stream ? t.stream.getTracks().forEach(track => p.removeTrack(track, t.stream)) : false;
      t.stream = res;
      t.stream.getTracks().forEach(track => p.addTrack(track, t.stream));
      p.addEventListener('icecandidate', function (e) {
        console.log(e);
        p.addIceCandidate(e.candidate)
      });
      p.createOffer(offerOptions).then((desc) => {
        console.log(desc);
        p.setLocalDescription(desc);
        Meteor.call('update_local_peer_desc', desc.sdp, s._id);



        Tracker.autorun(() => {
          t.remote_peer = Peers.findOne({
            streamId: Router.current().params._id
          });
          console.log(t.remote_peer);
          if (t.remote_peer) {
            p.setRemoteDescription({
              sdp: t.remote_peer.sdp,
              type: 'answer'
            })
          }
        });

      });
    });


  } else {
    // peer connection pc2

    let p = new RTCPeerConnection(configuration);
    p.addEventListener('track', e => document.getElementById('output').srcObject = e.streams[0]);
    p.addEventListener('icecandidate', function (e) {
      console.log(e);
      p.addIceCandidate(e.candidate)
    });
    p.setRemoteDescription({
      sdp: s.sdp,
      type: 'offer'
    }).then(() => {
      return p.createAnswer()
    }).then((ans) => {
      console.log(ans);
      p.setLocalDescription(ans).then((a)=>{
        t.remote_peer_desc = {
          deviceId: deviceId,
          sdp: ans.sdp,
          streamId: s._id
        };
        Meteor.call('add_remote_peer_desc', t.remote_peer_desc, function (err, res) {
          t.peerId = res;
        });
      });
      
    });
  }
});

Template.stream.onDestroyed(function () {
  let t = this;
  if (t.peerId) {
    Meteor.call('remove_remote_peer_desc', t.peerId);
  }
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