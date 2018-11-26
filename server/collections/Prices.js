export const Prices = new Mongo.Collection('prices');

Meteor.publish('prices', function(streamId){
  return Prices.find({});
});