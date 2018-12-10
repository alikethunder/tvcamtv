import {Streams} from '../../collections/Streams'
import {Partys} from '../../collections/Partys'

Meteor.methods({
  update_stream_party(streamId, party){
    let s = Streams.findOne({_id: streamId});

    if (s.party && Partys.findOne({name: s.party, userId: this.userId}) && !Streams.find({party: s.party, userId: this.userId, _id: {$ne: streamId}}).count()){
      Partys.remove({name: s.party, userId: this.userId});
    }

    if (party && !Partys.findOne({name: party, userId: this.userId})){
      Partys.insert({name: party, userId: this.userId})
    } 

    Streams.update({_id: streamId, userId: this.userId}, {$set: {party: party}});

  }
})