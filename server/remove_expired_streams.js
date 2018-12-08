import {Settings} from './collections/Settings'
import {Streams} from './collections/Streams'

//remove expired streams after n specified days
Meteor.setInterval(() => {
  Streams.remove({payed_till: {$lt: moment().utc().valueOf() - Settings.findOne({_id: 'streams_expired'}).after * 86400000}});

}, 86400000);

//set setting for expired streams
Settings.upsert({_id: 'streams_expired'}, {$set: {after: 90}});
//update all payed_till streams field, remove after server update
let streams = Streams.find().fetch().forEach((stream)=>{
  Streams.update({_id: stream._id}, {$set: {payed_till: moment(stream.payed_till).utc().valueOf()}})
});