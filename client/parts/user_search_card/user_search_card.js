Template.user_search_card.onRendered(function(){
  let t = this;
  t.$('.add_to_contacts').tooltip();
});

Template.user_search_card.onDestroyed(function(){
  let t = this;
  t.$('.add_to_contacts').tooltip('remove');
});

Template.user_search_card.events({
  'click .add_to_contacts'(e, t){
    Meteor.call('request_add_contact');
  }
});

Template.user_search_card.helpers({
  
});