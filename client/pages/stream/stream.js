import {
  deviceId
} from '../../js/deviceId'
Template.stream.onCreated(function () {
  let t = this;

  t.variables = {
    u: Meteor.user()
  };

  if (deviceId == Router.current().params._id) {
    t.variables.devices = new ReactiveVar({});

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      console.log(devices);
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
  }


});

Template.stream.onRendered(function () {

});

Template.stream.onDestroyed(function () {

});

Template.stream.helpers({
  stream() {
    return Template.instance().variables.u.streams.find(stream => stream.streamId == Router.current().params._id)
  },
  sameDevice(devId) {
    let t = Template.instance();

    if (deviceId == devId) {
      Meteor.setTimeout(() => {
        t.$('select').material_select();
      }, 0)
    }

    return deviceId == devId
  }
});

Template.stream.events({
  'click .remove_stream'(e, t){
    Meteor.call('remove_stream', Router.current().params._id)
  }
});