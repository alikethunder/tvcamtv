import {Tags} from '../../collections/Tags'

import {Translations} from '../../collections/Translations'

Template.screen.onCreated(function(){
  let t = this; 
  t.subscribe('user_self');
  t.subscribe('translations');
  t.l = localStorage.getItem('language') || 'en';
  moment.locale(t.l);
  Session.set('language', t.l);
  t.autorun(()=>{
    Translations.find().fetch().forEach((language)=>{
      T9n.map(language._id, language.translations);
    });
  }); 
});

Template.screen.onRendered(function(){
  let t = this;
  
  T9n.setLanguage(t.l);
  t.$('.lang').val(t.l);
  Meteor.setTimeout(()=>{
    document.title = `tvcamtv - ${T9n.get('landing.header')}`;
    $('meta[name="description"]').attr("content", T9n.get('landing.tabs.7.body'));
  }, 400);

  // insert advertisement, analitycs tags, etc.
  Tags.find().fetch().forEach((tag)=>{
    $(tag.append_to).append(tag.content);
  });
});

Template.screen.events({
  'click .screen'(e, t){
    t.$('#leftsidenav').addClass('leftsidenav_closed')
  }
});