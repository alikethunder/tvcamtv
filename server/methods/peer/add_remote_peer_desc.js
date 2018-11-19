import {Peers} from '../../collections/Peers'

Meteor.methods({
  add_remote_peer_desc(desc){
    return Peers.insert(desc);
  }
});