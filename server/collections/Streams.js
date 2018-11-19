export const Streams = new Mongo.Collection('streams');

Meteor.publish('streams', function(){
  return Streams.find({userId: this.userId});
});

Meteor.publish('stream', function(_id){
  return Streams.find({_id});
});