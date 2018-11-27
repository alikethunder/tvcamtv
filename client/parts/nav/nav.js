Template.nav.onCreated(function(){
  let t = this;
});

Template.nav.onRendered(function(){
  let t = this;
});

Template.nav.events({
  'click .logout'(){
    Meteor.logout();
    Router.go('/');
  },
  'click .leftsidenav_control'(){
    $('#leftsidenav').toggleClass('leftsidenav_closed');
  },
  'change .lang'(e, t){
    T9n.setLanguage(e.target.value);
    Session.set('language', e.target.value);
    localStorage.setItem('language', e.target.value);
    moment.locale(e.target.value);
    document.title = `tvcamtv - ${T9n.get('landing.header')}`;
    document.description = `${T9n.get('landing.tabs.7.body')}`;
    Meteor.setTimeout(()=>{
      $('select').not('.lang').material_select();
    }, 0);
  }
});