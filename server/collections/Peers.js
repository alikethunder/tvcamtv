export const Peers = new Mongo.Collection('peers');

Meteor.publish('peers', function(streamId){
  return Peers.find({streamId: streamId});
});