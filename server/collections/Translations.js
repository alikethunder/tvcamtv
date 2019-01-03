export const Translations = new Mongo.Collection('translations');

Translations.find().fetch().forEach((language) => {
  T9n.map(language._id, language.translations);
});

Translations.find().observeChanges({
  changed(_id, fields){
    T9n.map(_id, Translations.findOne({_id}).translations)
  }
});

Meteor.publish('translations', function () {
  return Translations.find()
});