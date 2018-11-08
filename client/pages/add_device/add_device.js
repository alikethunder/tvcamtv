Template.add_device.onCreated(function(){
  let t = this;
  t.variables = {devices: new ReactiveVar({})};
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach((device, index)=>{
      let d = t.variables.devices.get();
      d[device.kind] = d[device.kind] ? d[device.kind] : [];
      d[device.kind].push(device);
      t.variables.devices.set(d);
      if (index == devices.length - 1){
        Meteor.setTimeout(()=>{
          t.$('select').material_select();
        }, 0);
      }
    });
    console.log(t.variables.devices.get())
  });
});

Template.add_device.onRendered(function(){
  let t = this;
  //t.$('select').material_select();
});

Template.add_device.events({

});

Template.add_device.helpers({
  video(){
    return Template.instance().variables.devices.get()['videoinput']
  },
  audio(){
    return Template.instance().variables.devices.get()['audioinput']
  }
});