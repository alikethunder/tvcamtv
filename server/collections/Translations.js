export const Translations = new Mongo.Collection('translations');

Translations.find().fetch().forEach((language) => {
  T9n.map(language._id, language.translations);
});

Meteor.publish('translations', function () {
  return Translations.find()
});

Translations.update({_id: 'ru'}, {$set: {'translations.channel.channel_party': 'Партия'}});

Translations.update({_id: 'uk'}, {$set: {'translations.channel.channel_party': 'Партія'}});

Translations.update({_id: 'en'}, {$set: {'translations.channel.channel_party': 'Party'}});