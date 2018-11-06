Template.user_search_card.onRendered(function(){
  let t = this;
  t.$('.add_to_contacts').tooltip();
});

Template.user_search_card.onDestroyed(function(){
  let t = this;
  t.$('.add_to_contacts').tooltip('remove');
});

Template.user_search_card.events({
  'click .accept_add_to_contacts'(e, t){
    Meteor.call('accept_add_to_contacts', e.target.dataset.id);
  },
  'click .deny_add_to_contacts'(e, t){
    Meteor.call('deny_add_to_contacts', e.target.dataset.id);
  },
  'click .add_to_contacts'(e, t){
    Meteor.call('request_add_contact', e.target.dataset.id);
  },
  'click .cancel_add_to_contacts'(e, t){
    Meteor.call('cancel_add_to_contacts', e.target.dataset.id);
  },
});

Template.user_search_card.helpers({
  
});