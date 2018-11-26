import {
  Streams
} from '../../collections/Streams'
import {
  deviceId
} from '../../js/deviceId'

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
  }
});