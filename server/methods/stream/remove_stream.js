import {
  Streams
} from '../../collections/Streams'
import {
  Partys
} from '../../collections/Partys'

Meteor.methods({
  remove_stream(streamId) {
    let s = Streams.findOne({
      _id: streamId
    });

    if (s.party && Partys.findOne({
        name: s.party,
        userId: this.userId
      }) && !Streams.find({
        party: s.party,
        userId: this.userId,
        _id: {
          $ne: streamId
        }
      }).count()) {
      Partys.remove({
        name: s.party,
        userId: this.userId
      });
    }
    Streams.remove({
      _id: streamId,
      userId: this.userId
    })
  }
});