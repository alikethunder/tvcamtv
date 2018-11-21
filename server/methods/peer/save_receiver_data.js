import {Peers} from '../../collections/Peers'

Meteor.methods({
  save_receiver_data(_id, data){
    Peers.update({_id}, {$set: {data}})
  }
})