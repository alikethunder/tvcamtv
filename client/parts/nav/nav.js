import {Translations} from '../../collections/Translations'

Template.nav.onCreated(function(){
  let t = this;
  t.l = localStorage.getItem('language') || 'en';
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
    localStorage.setItem('language', e.target.value);
    Meteor.setTimeout(()=>{
      $('select').not('.lang').material_select();
    }, 0);
  }
});