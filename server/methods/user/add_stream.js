Meteor.methods({
  add_stream(stream){
    Meteor.users.update({_id: this.userId}, {$addToSet: {streams: stream}});
  }
});