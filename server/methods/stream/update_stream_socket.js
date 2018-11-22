import {Streams} from '../../collections/Streams'

Meteor.methods({
  update_stream_socket(_id, socketId){
    Streams.update({_id}, {$set: {socketId}});
  }
});