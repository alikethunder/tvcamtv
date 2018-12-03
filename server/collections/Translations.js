export const Translations = new Mongo.Collection('translations');

Translations.find().fetch().forEach((language)=>{
  T9n.map(language._id, language.translations);
});

Meteor.publish('translations', function(){
  return Translations.find()
});