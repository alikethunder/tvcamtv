Meteor.methods({
  update_stream_name(streamId, name){
    Meteor.users.update({_id: this.userId, 'streams.streamId': streamId}, {$set: {'streams.$.name': name}})
  }
})