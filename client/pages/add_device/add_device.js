Template.add_device.onCreated(function () {
  let t = this;
  t.variables = {
    devices: new ReactiveVar({})
  };
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

  t.variables.constraints = new ReactiveVar({
    audio: false,
    video: false
  });
  t.stream;

  t.start = function () {
    t.stream ? t.stream.getTracks().forEach(track => track.stop()) : false;
    let c = t.variables.constraints.get();
    if (c.video || c.audio) {
      navigator.mediaDevices.getUserMedia(c)
        .then(function (stream) {
          t.stream = stream;
          document.getElementById('output').srcObject = stream;
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
});

Template.add_device.onRendered(function () {
  let t = this;

});

Template.add_device.events({
  'change select'(e, t) {
    let c = t.variables.constraints.get();
    c[e.target.id] = !!e.target.value ? {
      deviceId: e.target.value
    } : false;
    t.variables.constraints.set(c);
    t.start();
  },
  'click .add_device_btn'(e, t){
    
  }
});

Template.add_device.helpers({
  video() {
    return Template.instance().variables.devices.get()['videoinput']
  },
  audio() {
    return Template.instance().variables.devices.get()['audioinput']
  }
});