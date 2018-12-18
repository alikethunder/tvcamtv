switch (location.pathname) {
  case '/ru':
    localStorage.setItem('language', 'ru');
    location.pathname = '/';
    break;
  case '/uk':
    localStorage.setItem('language', 'uk');
    location.pathname = '/';
    break;
  case '/en':
    localStorage.setItem('language', 'en');
    location.pathname = '/';
    break;
  case '/oferta/ru':
    localStorage.setItem('language', 'ru');
    location.pathname = '/oferta';
    break;
  case '/oferta/ru':
    localStorage.setItem('language', 'uk');
    location.pathname = '/oferta';
    break;
  case '/oferta/ru':
    localStorage.setItem('language', 'en');
    location.pathname = '/oferta';
    break;
  default:
    break;
}