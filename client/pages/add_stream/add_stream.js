import {
  deviceId
} from '../../js/deviceId'
import {
  start_video
} from '../../js/start_video'

Template.add_stream.onCreated(function () {
  let t = this;
  t.variables = {
    devices: new ReactiveVar({})
  };

  navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(()=>{
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      //console.log(devices);
      devices.forEach((device, index) => {
        //console.log(device, index)
        let d = t.variables.devices.get();
        d[device.kind] = d[device.kind] || [];
        d[device.kind].push(device);
        t.variables.devices.set(d);
        if (index == devices.length - 1) {
          Meteor.setTimeout(() => {
            t.$('select').material_select();
          }, 0);
        }
      });
      //console.log(t.variables.devices.get())
    });
  })

  t.variables.constraints = {
    audio: false,
    video: false
  };
  t.stream;
});

Template.add_stream.onRendered(function () {
  let t = this;

});

Template.add_stream.events({
  'change select'(e, t) {
    //console.log(e);
    t.variables.constraints[e.target.id] = !!e.target.value ? {
      deviceId: e.target.value
    } : false;
    start_video(t.stream, t.variables.constraints, 'output').then(res => t.stream = res);
  },
  'click .add_device_btn'(e, t) {
    let st = {
      constraints: t.variables.constraints
    };
    if (st.constraints.audio || st.constraints.video) {
      st.name = t.$('#name').val();
      st.deviceId = deviceId;
      Meteor.call('add_stream', st, function (err, _id) {
        if (!err) {
          Materialize.toast(`Канал ${st.name} добавлен`, 1000);
          Router.go(`/stream/${_id}`);
        }
      });
    } else {
      Materialize.toast('Для создания канала необходимо подключить аудио и/или видео', 3000, 'red');
    }
  }
});

Template.add_stream.helpers({
  video() {
    //console.log(Template.instance().variables.devices.get()['videoinput'])
    return Template.instance().variables.devices.get()['videoinput']
  },
  audio() {
    return Template.instance().variables.devices.get()['audioinput']
  },
});