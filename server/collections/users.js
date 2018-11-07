Meteor.publish('user_self', function(){
  return Meteor.users.find({_id: this.userId})
});