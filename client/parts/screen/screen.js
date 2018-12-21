import {
  Translations
} from '../../collections/Translations'

Template.screen.onCreated(function () {
  let t = this;
  t.subscribe('user_self');
  t.subscribe('translations');
  
  t.l = Meteor.user() && Meteor.user().profile && Meteor.user().profile.language || localStorage.getItem('language') || 'en';
  moment.locale(t.l);
  Session.set('language', t.l);
  t.autorun(() => {
    Translations.find().fetch().forEach((language) => {
      T9n.map(language._id, language.translations);
    });
  });
});

Template.screen.onRendered(function () {
  let t = this;

  T9n.setLanguage(t.l);
  t.$('.lang').val(t.l);
  let i = Meteor.setInterval(() => {
    if (T9n.get('landing.header') != ">landing.header<") {
      document.title = `tvcamtv - ${T9n.get('landing.header')}`;
      $('meta[name="description"]').attr("content", T9n.get('landing.tabs.7.body'));
      Meteor.clearInterval(i);
    }
  }, 100);
});

Template.screen.events({
  'click .screen'(e, t) {
    t.$('#leftsidenav').addClass('leftsidenav_closed')
  }
});