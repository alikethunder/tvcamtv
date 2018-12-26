export const Settings = new Mongo.Collection('settings');

Meteor.publish('settings', function(streamId){
  return Settings.find({});
});

//Settings.insert({_id: 'secret_key', key: 'popugaiev update happy'})