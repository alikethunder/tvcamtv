Meteor.methods({
  update_constraints(streamId, c){
    Meteor.users.update({_id: this.userId, 'streams.streamId': streamId}, {$set: {'streams.$.constraints': c}})
  }
})