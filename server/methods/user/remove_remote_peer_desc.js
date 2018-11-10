Meteor.methods({
  remove_remote_peer_desc(desc, streamId){
    Meteor.users.update({_id: this.userId, 'streams.streamId': streamId}, {$pull: {'streams.$.local_peer_descs': desc}})
  }
})