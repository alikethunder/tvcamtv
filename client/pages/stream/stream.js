import {
  deviceId
} from '../../js/deviceId'
import {
  start_video
} from '../../js/start_video'

Template.stream.onCreated(function () {
  let t = this;

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

  if (s.deviceId == deviceId) {
    t.variables.constraints = s.constraints;

    //peer connection pc1

    let p = new RTCPeerConnection();
    start_video(t.stream, t.variables.constraints, 'output').then((res) => {
      let p = new RTCPeerConnection();
      //console.log(p);
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
        Meteor.call('update_local_peer_desc', desc.sdp, s.streamId);
        Tracker.autorun(() => {
          if (s.remote_peer_descs && s.remote_peer_descs.length) {
            p.setRemoteDescription({
              sdp: s.remote_peer_descs[0],
              type: 'answer'
            })
          }
        });
      });
    });


  } else {
    // peer connection pc2

    let p = new RTCPeerConnection();
    p.addEventListener('track', e => document.getElementById('output').srcObject = e.streams[0]);
    p.addEventListener('icecandidate', function (e) {
      console.log(e);
      p.addIceCandidate(e.candidate)
    });
    //console.log(s.local_peer_desc);
    p.setRemoteDescription({
      sdp: s.local_peer_desc,
      type: 'offer'
    }).then(() => {
      return p.createAnswer()
    }).then((ans) => {
      console.log(ans);
      p.setLocalDescription(ans);
      t.remote_peer_desc = {
        _id: new Mongo.ObjectID()._str,
        sdp: ans.sdp
      };
      Meteor.call('update_remote_peer_desc', t.remote_peer_desc, s.streamId);
    });
  }
});

Template.stream.onDestroyed(function () {
  let t = this;
  if (t.remote_peer_desc) {
    Meteor.call('remove_remote_peer_desc', t.remote_peer_desc, s.streamId);
    ///...///
  }
});

Template.stream.helpers({
  stream() {
    return Meteor.user().streams.find(stream => stream.streamId == Router.current().params._id);
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
      }
    })
  },
  'blur #name'(e, t) {
    Meteor.call('update_stream_name', Router.current().params._id, e.target.value);
  },
  'change select'(e, t) {
    t.variables.constraints[e.target.id] = !!e.target.value ? {
      deviceId: e.target.value
    } : false;
    Meteor.call('update_constraints', Router.current().params._id, t.variables.constraints);
    start_video(t.stream, t.variables.constraints, 'output').then(res => t.stream = res);
  },
});