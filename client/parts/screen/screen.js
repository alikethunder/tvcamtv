Template.screen.onCreated(function(){
  let t = this; 
});

Template.screen.events({
  'click .screen'(e, t){
    t.$('#leftsidenav').addClass('leftsidenav_closed')
  }
});