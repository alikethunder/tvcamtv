export const Translations = new Mongo.Collection('translations');

Translations.find().fetch().forEach((language) => {
  T9n.map(language._id, language.translations);
});

Translations.find().observeChanges({
  changed(_id, fields) {
    T9n.map(_id, Translations.findOne({ _id }).translations)
  }
});

Meteor.publish('translations', function () {
  return Translations.find()
});

Translations.upsert({
  _id: 'en'
},
  {
    translations: {
      landing: {
        header: 'Video surveillance',
        start: 'start',
        tabs: {
          1: {
            header: 'Simple configure',
            body: 'Write config into cam with usb and install it where you want to'
          },
          2: {
            header: 'Unlimited cams',
            body: 'Add as much cams as you want'
          },
          3: {
            header: 'Security',
            body: 'Connection is established directly between cam and monitoring device'
          },
          4: {
            header: 'Availability',
            body: 'Watch your cams from any device with internet connection'
          },
          5: {
            header: 'Customizable',
            body: 'Monitor cams that you want, one by one, some or all of them at once'
          },
          6: {
            header: 'Recordings',
            body: 'Record your cams on device or in site database and watch them later'
          },
          7: {
            header: 'Public cams',
            body: "Share your streams with other users, subscribe and watch other's streams"
          },
        }
      },
      channel:{
        add: 'Add',
        channel: 'Channel',
        channels: 'Channels',
        monitor: 'Monitor',
        no_channels: 'No channels',
        channel_name: 'Channel name',
        select: 'Select',
        without_video: 'Without video',
        without_audio: 'Without audio',
        video_device: "Video device",
        audio_device: "Audio device",
        records: 'Records',
        loading: 'Loading',
        channel_available: 'Channel available',
        channel_unavailable: 'Channel unavailable',
        no_available_devices: 'No available devices'
      },
      name: 'Name',
      client: {
        currency: 'Currency'
      },
      compability_info: 'Compability info',
      delete: 'Delete',
      recording: {
        record: 'Start recording',
        recordings: 'Recordings',
        download: 'Download',
        record_in_progress: 'Record in progress',
        stop: 'Stop recording'
      },
      profile: 'Profile',
      "Minimum required length: 6": 'Password must contain minimum 6 symbols',
      "Required Field" : "Required Field",
      'error':{
        accounts: {
          'Invalid email': 'Please enter correct email'
        }
      }
    }
  });

Translations.upsert({
  _id: 'uk'
},
  {
    translations: {
      landing: {
        header: 'Відеоспостереження',
        start: 'Почати',
        tabs: {
          1: {
            header: 'Простi налаштування',
            body: 'Запишiть налаштування на камеру через usb та встановіть де завгодно'
          },
          2: {
            header: 'Необмежена кількість камер',
            body: 'Додайте скільки завгодно камер'
          },
          3: {
            header: 'Захищеність вiдеоданих',
            body: "З'єднання встановлюється напряму між камерою та пристроєм перегляду"
          },
          4: {
            header: 'Доступність',
            body: "Камери доступні на будь-якому пристрої з доступом в інтернет"
          },
          5: {
            header: 'Налаштовуваність',
            body: 'Переглядайте камери по одній, декілька або всi разом'
          },
          6: {
            header: 'Запис',
            body: "Налаштовуйте запис на пристрій або в базу сайта для подальшого перегляду"
          },
          7: {
            header: 'Публічні камери',
            body: "Діліться, за бажанням, своїми відеопотоками з іншими, або підписуйтесь та переглядайте чиїсь"
          },
        }
      },
      channel:{
        add: 'Додати',
        channel: 'Канал',
        channels: 'Канали',
        monitor: 'Монiторiнг',
        no_channels: 'Канали відсутні',
        channel_name: 'Назва каналу',
        select: 'Вибрати',
        without_video: 'Без відео',
        without_audio: 'Без звуку',
        video_device: "Відеопристрiй",
        audio_device: "Аудіо",
        records: 'Записи',
        loading: 'Загрузка',
        channel_available: 'Канал доступний',
        channel_unavailable: 'Канал недоступний',
        no_available_devices: 'Немає доступних пристроїв'
      },
      name: "Iм'я",
      client: {
        currency: 'Валюта'
      },
      compability_info: 'Iнформація про сумісність',
      delete: 'Видалити',
      recording: {
        record: 'Почати запис',
        recordings: 'Записи',
        download: 'Завантажити',
        record_in_progress: 'Йде запис',
        stop: 'зупинити запис'
      },
      profile: 'Профіль',
      "Minimum required length: 6": 'Пароль повинен мати мiнiмум 6 символiв',
      "Required Field" : "Обов'язкове поле",
      'error':{
        accounts: {
          'Invalid email': 'Будь ласка введiть коректний email'
        }
      }
    }
  });

Translations.upsert({
  _id: 'ru'
},
  {
    translations: {
      landing: {
        header: 'Видеонаблюдение',
        start: 'Начать',
        tabs: {
          1: {
            header: 'Простая настройка',
            body: 'Запишите настройки на камеру через usb и установите где угодно'
          },
          2: {
            header: 'Неограниченное количество камер',
            body: 'Добавьте сколько угодно камер'
          },
          3: {
            header: 'Защищенность данных',
            body: 'Соединение устанавливается напрямую между камерой и устройством просмотра'
          },
          4: {
            header: 'Доступность',
            body: 'Камеры доступны на любом устройстве с доступом в интернет'
          },
          5: {
            header: 'Настраиваемость',
            body: 'Просматривайте камеры по одной, несколько или все сразу'
          },
          6: {
            header: 'Запись',
            body: "Настраивайте запись на устройство или в базу сайта для дальнейшего просмотра"
          },
          7: {
            header: 'Публичные камеры',
            body: "Делитесь, по желанию, своими видеопотоками с другими, или подписывайтесь и просматривайте чьи-то"
          },
        }
      },
      channel:{
        add: 'Добавить',
        channel: 'Канал',
        channels: 'Каналы',
        monitor: 'Мониторинг',
        no_channels: 'Каналы отсутствуют',
        channel_name: 'Название канала',
        select: 'Выбрать',
        without_video: 'Без видео',
        without_audio: 'Без звука',
        video_device: "Видеоустройство",
        audio_device: "Аудио",
        records: 'Записи',
        loading: 'Загрузка',
        channel_available: 'Канал доступен',
        channel_unavailable: 'Канал недоступен',
        no_available_devices: 'Нет доступных устройств'
      },
      name: 'Имя',
      client: {
        currency: 'Валюта'
      },
      compability_info: 'Информация о совместимости',
      delete: 'Удалить',
      recording: {
        record: 'Начать запись',
        recordings: 'Записи',
        download: 'Загрузить',
        record_in_progress: 'Идет запись',
        stop: 'Остановить запись'
      },
      profile: 'Профиль',
      "Minimum required length: 6": 'Пароль должен иметь минимум 6 символов',
      "Required Field" : "Обязательное поле",
      'error':{
        accounts: {
          'Invalid email': 'Пожалуйста введите правильный email'
        }
      }
    }
  });