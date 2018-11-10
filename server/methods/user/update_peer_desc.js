Meteor.methods({
  update_local_peer_desc(desc, streamId){
    Meteor.users.update({_id: this.userId, 'streams.streamId': streamId}, {$set: {'streams.$.local_peer_desc': desc}})
  }
})