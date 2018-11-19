import {Streams} from '../../collections/Streams'

Meteor.methods({
  remove_stream(streamId){
    Streams.remove({_id: streamId, userId: this.userId})
  }
});