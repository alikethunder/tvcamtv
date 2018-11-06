Template.users.onRendered(function(){
  let t = this;
  Materialize.updateTextFields();
});

Template.users.onCreated(function(){
  let t = this;
  t.variables = {};
  t.variables.users = Meteor.subscribe('users');
});

Template.users.helpers({
  users(){
    let u = Meteor.user();
    return u.contacts && Meteor.users.find({_id: {$nin: u.contacts.contacts, $not: u._id, $nin: u.contacts.blocked_users}}).fetch()
  }
});

Template.users.events({
  'change #name': _.debounce(function(e, t){
    t.variables.users.stop();
    t.variables.users = Meteor.subscribe('users', e.target.value);
  }, 400)
});