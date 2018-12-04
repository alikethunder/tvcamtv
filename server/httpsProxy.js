const [,, host, port] = Meteor.absoluteUrl().match(/([a-zA-Z]+):\/\/([\-\w\.]+)(?:\:(\d{0,5}))?/);

// if not developer session
if (port != 3000){
  import {readFileSync} from 'fs'
  import httpProxy from 'http-proxy'
  import {Settings} from './collections/Settings'
  
  let { key, cert } = Settings.findOne({_id: 'ssl_certificates'});
  httpProxy.createServer({
    target: {
      host,
      port
    },
    ssl: {
      key: readFileSync(key),
      cert: readFileSync(cert)
    },
    ws: true,
    xfwd: true
  }).listen(443);
}