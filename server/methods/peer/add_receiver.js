import {Peers} from '../../collections/Peers'

Meteor.methods({
  add_receiver(_id, streamId, deviceId, constraints, socketId){
    return Peers.insert({_id, streamId, deviceId, constraints, socketId, userId: this.userId});
  }
});