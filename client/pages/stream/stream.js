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
    console.log(t.variables.devices.get())
  });

});

Template.stream.onRendered(function () {
  let t = this;
  Materialize.updateTextFields();
  console.log(Template.stream.__helpers.get('stream').call().constraints);
  t.variables.constraints = Template.stream.__helpers.get('stream').call().constraints;
  start_video(t.stream, t.variables.constraints, 'output').then(res => t.stream = res);

});

Template.stream.onDestroyed(function () {

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