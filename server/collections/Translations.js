export const Translations = new Mongo.Collection('translations');

Translations.find().fetch().forEach((language) => {
  T9n.map(language._id, language.translations);
});

Meteor.publish('translations', function () {
  return Translations.find()
});

Translations.update({_id: 'ru'}, {$set: {'translations.record_info': 'Для избежания перегрузки запись ведется и сохраняется по часу. Запись можно остановить в любой момент.', 'translations.recording': {'record': 'Включить запись', 'stop': 'стоп', 'download': 'Скачать', 'record_in_progress': 'Идет запись'}}});

Translations.update({_id: 'uk'}, {$set: {'translations.record_info': 'Для уникнення перевантаження запис ведеться і зберігається по годині. Запис можна зупинити в будь-який момент.', 'translations.recording': {'record': 'Включити запис', 'stop': 'стоп', 'download': 'скачати', 'record_in_progress': 'Йде запис'}}});

Translations.update({_id: 'en'}, {$set: {'translations.record_info': 'To avoid overloading, the recording is kept and saved by the hour. Recording can be stopped at any time.', 'translations.recording': {'record': 'record', 'stop': 'stop', 'download': 'download', 'record_in_progress': 'Record in progress'}}});