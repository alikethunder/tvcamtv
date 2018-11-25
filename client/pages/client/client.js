Template.client.onCreated(function () {
  let t = this;
  t.variables = {};
  t.variables.name = new ReactiveVar(Meteor.user().profile.name);
  t.liqpay_form = new ReactiveVar('');
});

Template.client.onRendered(function () {
  let t = this;
  Materialize.updateTextFields();
  Meteor.call('create_form', {
    'action': 'subscribe',
    'amount': '1',
    'currency': 'USD',
    'description': 'description text',
    'order_id': 'order_id_1',
    'version': '3',
    language: 'en',
    /// test environment
    sandbox: 1,
    result_url: 'http://tvcamtv.com/client'
    //server_url: ''
  }, function (err, res) {
    if (!err) {
      t.liqpay_form.set(res);
    }
  });
});

Template.client.helpers({
  liqpay_form() {
    return Template.instance().liqpay_form.get()
  }
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
  }
});