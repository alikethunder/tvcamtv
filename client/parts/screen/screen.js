Template.screen.onCreated(function () {
  let t = this;
  t.subscribe('user_self');
  t.subscribe('translations');
});

Template.screen.events({
  'click .screen'(e, t) {
    t.$('#leftsidenav').addClass('leftsidenav_closed')
  }
});