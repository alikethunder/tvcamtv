Meteor.methods({
  remove_stream(streamId){
    Meteor.users.update({_id: this.userId}, {$pull: {streams: {streamId}}})
  }
});