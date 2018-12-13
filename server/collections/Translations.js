export const Translations = new Mongo.Collection('translations');

Translations.find().fetch().forEach((language) => {
  T9n.map(language._id, language.translations);
});

Meteor.publish('translations', function () {
  return Translations.find()
});

Translations.update({_id: 'ru'}, {$set: {'translations.channel.channel_available': 'Канал доступeн', 'translations.channel.channel_unavailable': 'Канал недоступeн', 'translations.channel.loading': 'Загружается, пожалуйста, подождите'}});

Translations.update({_id: 'uk'}, {$set: {'translations.channel.channel_available': 'Канал доступний', 'translations.channel.channel_unavailable': 'Канал недоступний', 'translations.channel.loading': 'Завантажується, будь ласка, зачекайте'}});

Translations.update({_id: 'en'}, {$set: {'translations.channel.channel_available': 'Channel is available', 'translations.channel.channel_unavailable': 'Channel is unavailable', 'translations.channel.loading': 'Loading, please, wait'}});