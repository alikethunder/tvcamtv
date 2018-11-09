Template.box.onCreated(function(){
  let t = this;
  t.subscribe('user_self')
});

Template.box.events({
  'click .box'(e, t){
    t.$('#leftsidenav').addClass('leftsidenav_closed')
  }
});