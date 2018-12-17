import {Peers} from '../../collections/Peers'

Meteor.methods({
  remove_receivers(ids){
    Peers.remove({_id: {$in: ids}, userId: this.userId});
  }
});