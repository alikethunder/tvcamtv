Template.user_info.onRendered(function(){
  let t = this;
  t.variables = {};
  t.variables.name = new ReactiveVar(Meteor.user().profile.name);
  Materialize.updateTextFields();
});

Template.user_info.helpers({
});

Template.user_info.events({
  'focus #name'(e, t){
    t.variables.name.set(e.target.value);
  },
  'blur #name'(e, t){
    if (e.target.value){
      Meteor.call('update_name', e.target.value);
    } else {
      e.target.value = t.variables.name.get()
    }
  }
});