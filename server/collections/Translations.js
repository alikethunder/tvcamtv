export const Translations = new Mongo.Collection('translations');

Translations.find().fetch().forEach((language) => {
  T9n.map(language._id, language.translations);
});

Meteor.publish('translations', function () {
  return Translations.find()
});

Translations.update({_id: 'ru'}, {$set: {'translations.Required Field': 'Обязательное поле'}});

Translations.update({_id: 'uk'}, {$set: {'translations.Required Field': "Обов'язкове поле"}});

Translations.update({_id: 'en'}, {$set: {'translations.Required Field': 'Required field'}});