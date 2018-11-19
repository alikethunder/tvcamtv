import {Streams} from '../../collections/Streams'

Meteor.methods({
  update_local_peer_desc(sdp, streamId){
    Streams.update({_id: streamId, userId: this.userId}, {$set: {sdp}})
  }
})