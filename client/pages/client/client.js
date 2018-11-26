Template.client.onCreated(function () {
  let t = this;
  t.variables = {};
  t.variables.name = new ReactiveVar(Meteor.user().profile.name);
});

Template.client.onRendered(function () {
  let t = this;
  Materialize.updateTextFields();
  Meteor.setTimeout(() => {
    t.$('select').material_select();
  }, 0);
});

Template.client.helpers({
  
});

Template.client.events({
  'focus #name'(e, t) {
    t.variables.name.set(e.target.value);
  },
  'blur #name'(e, t) {
    if (e.target.value) {
      Meteor.call('update_name', e.target.value);
    } else {
      e.target.value = t.variables.name.get()
    }
  },
  'change #currency'(e, t){
    Meteor.call('update_client_currency', e.target.value);
  }
});