Meteor.methods({
  update_language: function(lang){
    this.unblock();
    Meteor.users.update({_id: this.userId}, {$set: {"profile.language": lang}});
  }
});