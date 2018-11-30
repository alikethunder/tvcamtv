const [,, host, port] = Meteor.absoluteUrl().match(/([a-zA-Z]+):\/\/([\-\w\.]+)(?:\:(\d{0,5}))?/);

// if not developer session
if (port != 3000){
  import httpProxy from 'http-proxy'
  httpProxy.createServer({
    target: {
      host,
      port
    },
    ssl: {
      key: Assets.getText('/home/tvcamtv/acme.sh/tvcamtv.com/tvcamtv.com.key'),
      cert: Assets.getText('/home/tvcamtv/acme.sh/tvcamtv.com/fullchain.cer')
    },
    ws: true,
    xfwd: true
  }).listen(443);
}