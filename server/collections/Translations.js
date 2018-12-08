export const Translations = new Mongo.Collection('translations');

Translations.find().fetch().forEach((language) => {
  T9n.map(language._id, language.translations);
});

Meteor.publish('translations', function () {
  return Translations.find()
});

Translations.update({_id: 'ru'}, {$set: {'translations.compability_info': 'Для корректной работы канала рекомендуется использовать браузер Google Chrome версии не ниже 56.'}});

Translations.update({_id: 'uk'}, {$set: {'translations.compability_info': 'Для коректної роботи каналу рекомендується використовувати браузер Google Chrome версії не нижче 56.'}});

Translations.update({_id: 'en'}, {$set: {'translations.compability_info': 'For correct operation of the channel, it is recommended to use Google Chrome browser of version not lower than 56.'}});

Translations.update({_id: 'ru'}, {$set: {'translations.currency_info': 'Сменить валюту можно <a href="/client">на странице клиента</a>'}});

Translations.update({_id: 'uk'}, {$set: {'translations.currency_info': 'Змінити валюту можна <a href="/client"> на сторінці клієнта </a>'}});

Translations.update({_id: 'en'}, {$set: {'translations.currency_info': 'You can change the currency <a href="/client"> on the client page </a>'}});