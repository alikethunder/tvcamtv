Template.screen.onCreated(function(){
  let t = this;
  t.subscribe('user_self')
});

Template.screen.events({
  'click .screen'(e, t){
    t.$('#leftsidenav').addClass('leftsidenav_closed')
  }
});