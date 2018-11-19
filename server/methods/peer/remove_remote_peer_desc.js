import {Peers} from '../../collections/Peers'

Meteor.methods({
  remove_remote_peer_desc(_id){
    Peers.remove({_id})
  }
})