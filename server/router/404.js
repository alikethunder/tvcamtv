let pathToRegexp = require('path-to-regexp');
let paths = Router.routes.map(route => route._path);
paths.push('/ru', '/uk', '/en', '/liqpay');

WebApp.connectHandlers.use("/", function (req, res, next) {

  if (paths.find((path) => pathToRegexp(path).test(req.url.split('?')[0]))) next();
  else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });

    res.end("<div class='main'>Page not found. <a href='/'>Back home</a></div>");
  }
});