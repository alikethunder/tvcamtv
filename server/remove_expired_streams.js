import {Settings} from './collections/Settings'
import {Streams} from './collections/Streams'

//remove expired streams after n specified days
Meteor.setInterval(() => {
  Streams.remove({payed_till: {$lt: moment().utc().valueOf() - Settings.findOne({_id: 'streams_expired'}).after * 86400000}});

}, 86400000);