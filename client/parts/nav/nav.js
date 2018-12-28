import {
  before_logout
} from '../../js/before_logout'
import {
  Translations
} from '../../collections/Translations'

Template.nav.onRendered(function () {
  let t = this;

  let l = Meteor.user() && Meteor.user().profile && Meteor.user().profile.language || localStorage.getItem('language') || 'en';

  t.$('.lang').val(l);
  moment.locale(l);
  Session.set('language', l);
  T9n.setLanguage(l);

  Translations.find().fetch().forEach((language) => {
    T9n.map(language._id, language.translations);
  });

  let i = Meteor.setInterval(() => {
    if (T9n.get('landing.header') != ">landing.header<") {
      document.title = `tvcamtv - ${T9n.get('landing.header')}`;
      $('meta[name="description"]').attr("content", T9n.get('landing.tabs.7.body').replace('<br>', '').replace('<i class="material-icons">mood</i>', ''));
      Meteor.clearInterval(i);
    }
  }, 100);
});

Template.nav.events({
  'click .logout'() {
    before_logout(() => {
      Meteor.logout();
      Router.go('/');
    });

  },
  'click .leftsidenav_control'() {
    $('#leftsidenav').toggleClass('leftsidenav_closed');
  },
  'change .lang'(e, t) {
    T9n.setLanguage(e.target.value);
    Session.set('language', e.target.value);
    localStorage.setItem('language', e.target.value);
    moment.locale(e.target.value);
    document.title = `tvcamtv - ${T9n.get('landing.header')}`;
    $('meta[name="description"]').attr("content", T9n.get('landing.tabs.7.body').replace('<br>', '').replace('<i class="material-icons">mood</i>', ''));
    Meteor.call("update_language", e.target.value);
    Meteor.setTimeout(() => {
      $('select').not('.lang').material_select();
    }, 0);
  }
});