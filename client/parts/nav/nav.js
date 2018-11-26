import {Translations} from '../../collections/Translations'

Template.nav.onCreated(function(){
  let t = this;
  t.l = localStorage.getItem('language') || 'en';
  moment.locale(t.l);
  Session.set('language', t.l);
  t.subscribe('translations');
  t.autorun(()=>{
    Translations.find().fetch().forEach((language)=>{
      T9n.map(language._id, language.translations);
    });
  }); 
});

Template.nav.onRendered(function(){
  let t = this;
  T9n.setLanguage(t.l);
  t.$('.lang').val(t.l);
  Meteor.setTimeout(()=>{
    document.title = `tvcamtv - ${T9n.get('landing.header')}`;
    $('meta[name="description"]').attr("content", T9n.get('landing.tabs.7.body'));
  }, 400);
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