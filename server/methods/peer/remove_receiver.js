import {Peers} from '../../collections/Peers'

Meteor.methods({
  remove_receiver(_id){
    Peers.remove({_id, userId: this.userId});
  }
});