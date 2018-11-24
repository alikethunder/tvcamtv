const Translations = new Mongo.Collection('translations');

Meteor.publish('translations', function(){
  return Translations.find()
});