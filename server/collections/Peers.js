export const Peers = new Mongo.Collection('peers');

Meteor.publish('peers', function(streamId){
  return Peers.find({streamId, userId: this.userId});
});

Meteor.publish('device_peers', function(deviceId){
  return Peers.find({deviceId, userId: this.userId});
});