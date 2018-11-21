import {Streams} from '../../collections/Streams'

Meteor.methods({
  save_initiator_data(_id, data){
    Streams.update({_id}, {$set: {data}})
  }
})