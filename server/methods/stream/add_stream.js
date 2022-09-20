import {Streams} from '../../collections/Streams'

Meteor.methods({
  add_stream(stream){
    stream.userId = this.userId;
    return Streams.insert(stream);
  }
});