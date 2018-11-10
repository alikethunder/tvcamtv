Meteor.methods({
  update_remote_peer_desc(desc, streamId){
    Meteor.users.update({_id: this.userId, 'streams.streamId': streamId}, {$addToSet: {'streams.$.remote_peer_descs': desc}})
  }
})