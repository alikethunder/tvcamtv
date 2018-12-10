import {Streams} from '../../collections/Streams'
import {Partys} from '../../collections/Partys'

Meteor.methods({
  add_stream(stream){
    stream.userId = this.userId;
    stream.payed_till = moment().utc().valueOf();
    stream.created = moment().utc().valueOf();

    if (stream.party && !Partys.findOne({name: stream.party, userId: this.userId})){
      Partys.insert({name: stream.party, userId: this.userId})
    }

    return Streams.insert(stream);
  }
});