import {
  Streams
} from '../../collections/Streams'
import {
  deviceId
} from '../../js/deviceId'
import { Settings } from '../../collections/Settings';

Template.leftsidenav.onCreated(function () {
  let t = this;

});

Template.leftsidenav.onRendered(function () {
  let t = this;
  t.$('.collapsible').collapsible();

});

Template.leftsidenav.helpers({
  streams() {
    return Streams.find({}, { sort: { created: 1 }}).fetch()
  },
  ownStreams(){
    /// finish render stream from this device devided
    return Streams.find({deviceId}).fetch()
  },
  more_than_one_channel(streams){
    return !!(streams.length - 1)
  },
  aliexpress_advertisement(){
    return Settings.findOne({_id: 'aliexpress_advertisement'}).content
  },
  google_adsense_advertisement(){
    return Settings.findOne({_id: 'google_adsense_advertisement'}).content
  }
});