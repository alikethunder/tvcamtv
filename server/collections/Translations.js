export const Translations = new Mongo.Collection('translations');

Translations.find().fetch().forEach((language) => {
  T9n.map(language._id, language.translations);
});

Meteor.publish('translations', function () {
  return Translations.find()
});

Translations.update({_id: 'ru'}, {$set: {'translations.channel.channel_available': 'Канал доступeн', 'translations.channel.channel_unavailable': 'Канал недоступeн. Удостовертесь, что устройство источник включено, к нему подключена камера, в браузере открыта страница этого сайта и пользователь вошел на сайт.', 'translations.channel.loading': 'Загружается, пожалуйста, подождите'}});

Translations.update({_id: 'uk'}, {$set: {'translations.channel.channel_available': 'Канал доступний', 'translations.channel.channel_unavailable': 'Канал недоступний. Переконайтесь, що пристрiй джерело ввiмкнено, до нього пiдключена камера, в браузерi вiдкрито сторiнку цього сайта й користувач увiйшов на сайт.', 'translations.channel.loading': 'Завантажується, будь ласка, зачекайте'}});

Translations.update({_id: 'en'}, {$set: {'translations.channel.channel_available': 'Channel is available', 'translations.channel.channel_unavailable': 'Channel is unavailable. Make sure that the source device is turned on, the camera is connected to it, the page of the site is opened in the browser and the user is logged in.', 'translations.channel.loading': 'Loading, please, wait'}});