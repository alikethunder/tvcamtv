import {Streams} from '../../collections/Streams'

Meteor.methods({
  update_constraints(streamId, c){
    Streams.update({_id: streamId, userId: this.userId}, {$set: {constraints: c}})
  }
})