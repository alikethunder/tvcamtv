export const Settings = new Mongo.Collection('settings');

Meteor.publish('settings', function () {
  return Settings.find({});
});