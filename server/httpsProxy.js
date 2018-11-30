const [,, host, port] = Meteor.absoluteUrl().match(/([a-zA-Z]+):\/\/([\-\w\.]+)(?:\:(\d{0,5}))?/);

// if not developer session
if (port != 3000){
  import {readFileSync} from 'fs'
  import {Settings} from './collections/Settings'
  
  let { key, cert } = Settings.findOne({_id: 'ssl_certificates'});
  SSL(readFileSync(key, 'utf-8'), readFileSync(cert, 'utf-8'));
  /*httpProxy.createServer({
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
  }).listen(443);*/
}