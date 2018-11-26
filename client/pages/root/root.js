Template.root.helpers({
  start_link(){
    return Meteor.userId() ? '/add_stream' : 'sign-up'
  }
});