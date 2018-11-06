Template.nav.onCreated(function(){
  let t = this;
});

Template.nav.events({
  'click .logout'(){
    Meteor.logout();
    Router.go('/');
  },
  'click .leftsidenav_control'(){
    $('#leftsidenav').toggleClass('leftsidenav_closed');
  }
});