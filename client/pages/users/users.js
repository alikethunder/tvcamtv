Template.users.onCreated(function () {
  let t = this;
  t.variables = {
    subscriptions: {
      users: t.subscribe('users')
    }
  };
});

Template.users.onRendered(function () {
  let t = this;
  Materialize.updateTextFields();
});

Template.users.onDestroyed(function () {
  let t = this;
  t.variables.subscriptions.users.stop();
});

Template.users.helpers({
  users() {
    let u = Meteor.user();
    return u.contacts && Meteor.users.find({
      _id: {
        $not: u._id
      }
    }).fetch()
  }
});

Template.users.events({
  'keyup #name': _.debounce(function (e, t) {
    t.variables.subscriptions.users.stop();
    t.variables.subscriptions.users = t.subscribe('users', e.target.value);
  }, 400)
});