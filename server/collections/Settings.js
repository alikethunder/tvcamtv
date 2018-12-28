export const Settings = new Mongo.Collection('settings');

Meteor.publish('settings', function(streamId){
  return Settings.find({});
});