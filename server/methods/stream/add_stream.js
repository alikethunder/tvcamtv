import {Streams} from '../../collections/Streams'

Meteor.methods({
  add_stream(stream){
    stream.userId = this.userId;
    stream.payed_till = moment().utc().valueOf();
    stream.created = moment().utc().valueOf();
    return Streams.insert(stream);
  }
});