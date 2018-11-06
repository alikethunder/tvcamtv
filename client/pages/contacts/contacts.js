Template.contacts.onCreated(function () {
  let t = this;
  t.variables = {
    subscriptions: {
      contacts: t.subscribe('contacts')
    },
    user: new ReactiveVar(Meteor.user())
  };
});

Template.contacts.onRendered(function () {
  let t = this;
  t.$('ul.tabs').tabs();
});

Template.contacts.onDestroyed(function () {
  let t = this;
  t.variables.subscriptions.contacts.stop()
});

Template.contacts.helpers({
  contacts() {
    console.log(Meteor.users.find({_id: {$in: Template.instance().variables.user.get().contacts.contacts}}).fetch());
    return Meteor.users.find({_id: {$in: Template.instance().variables.user.get().contacts.contacts}}).fetch()
  },
  outbounds() {
    return Meteor.users.find({_id: {$in: Template.instance().variables.user.get().contacts.outbound_requests}}).fetch()
  },
  inbounds() {
    return Meteor.users.find({_id: {$in: Template.instance().variables.user.get().contacts.inbound_requests}}).fetch()
  },
  blocked() {
    return Meteor.users.find({_id: {$in: Template.instance().variables.user.get().contacts.blocked_users}}).fetch()
  }
});

Template.contacts.events({

});