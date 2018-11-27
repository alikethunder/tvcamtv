export const Tags = new Mongo.Collection('tags');

Meteor.publish('tags', function(){
  return Tags.find();
});