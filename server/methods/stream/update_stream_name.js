import {Streams} from '../../collections/Streams'

Meteor.methods({
  update_stream_name(streamId, name){
    Streams.update({_id: streamId, userId: this.userId}, {$set: {name: name}})
  }
})