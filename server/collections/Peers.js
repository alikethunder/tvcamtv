export const Peers = new Mongo.Collection('peers');

Meteor.publish('peers', function(streamId){
  return Peers.find({streamId});
});

Meteor.publish('device_peers', function(deviceId){
  return Peers.find({deviceId});
});