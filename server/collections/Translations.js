export const Translations = new Mongo.Collection('translations');

Translations.find().fetch().forEach((language) => {
  T9n.map(language._id, language.translations);
});

Meteor.publish('translations', function () {
  return Translations.find()
});

Translations.update({_id: 'ru'}, {$set: {'translations.landing.keywords': 'камера, микрофон, наблюдение, видеонаблюдение, мониторинг, просмотр каналов, управление каналами, видеокамера, видео, аудио, аудионаблюдение, запись, видеонаблюдение через интернет, камеры видеонаблюдения, видеорегистратор, ip камера, системы видеонаблюдения, система видеонаблюдения, комплект видеонаблюдения, видеонаблюдение онлайн, камера наблюдения, видеонаблюдение для дома, интернет видеонаблюдение, tvcamtv, tvcamtv.com, www.tvcamtv.com, https://tvcamtv.com, https://www.tvcamtv.com'}});

Translations.update({_id: 'en'}, {$set: {'translations.landing.keywords': 'camera, microphone, supervision, CCTV, monitoring, channel, viewing, management, video, surveillance, audio, record, security cameras, home security cameras, wireless security cameras, ip camera, security camera system, security systems, surveillance camera, video surveillance, internet video surveillance, internet cctv, tvcamtv, tvcamtv.com, www.tvcamtv.com, https://tvcamtv.com, https://www.tvcamtv.com'}})

Translations.update({_id: 'uk'}, {$set: {'translations.landing.keywords': 'камера, мікрофон, спостереження, відеоспостереження, моніторинг, переглядання каналів, управління каналами, відеокамера, відеонагляд, аудiоспостереження, аудiо, аудiонагляд, вiдео, записи, камери відеоспостереження, камери спостереження, відеореєстратор, системи відеонагляду, система відеонагляду, інтернет відеоспостереження, відеоспостереження через інтернет, tvcamtv, tvcamtv.com, www.tvcamtv.com, https://tvcamtv.com, https://www.tvcamtv.com'}})