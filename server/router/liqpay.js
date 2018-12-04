import {
  Payments
} from '../collections/Payments'
import {
  liqpay
} from '../liqpay'
import {
  Liqpay
} from '../collections/Liqpay'
import {
  Streams
} from '../collections/Streams'
import {
  Prices
} from '../collections/Prices'
let keys = Liqpay.findOne().keys;

var bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({
  extended: false
})

WebApp.connectHandlers.use(urlencodedParser)
// Listen to incoming HTTP requests (can only be used on the server).g HTTP requests (can only be used on the 
//success statuses = ['wait_accept', 'success'];

WebApp.connectHandlers.use('/liqpay', (req, res, next) => {
  Payments.insert({
    query: req.query,
    method: req.method,
    received: moment().utc().format(),
    backup_entry: true,
    url: req.url,
    originalUrl: req.originalUrl,
    body: req.body,
    headers: req.headers,
    rawHeaders: req.rawHeaders
  });

  if (req.method == "POST") {
    let s = liqpay.str_to_sign(keys.private + req.body.data + keys.private);
    if (s == req.body.signature) {
      //parse params
      let data = JSON.parse(Buffer.from(req.body.data, 'base64'));

      Payments.insert({
        data,
        signature: req.body.signature,
        method: req.method,
        received: moment().utc().format()
      });

      if (['wait_accept', 'success', 'sandbox'].includes(data.status)) {
        Streams.insert({includes: true});
        data.order_id.replace(/([^\s\:]+)\:([^\s]+)\//, function (match, streamId, priceId) {
          let stream = Streams.findOne({
            _id: streamId
          });
          let price = Prices.findOne({
            _id: priceId
          });
          let payed_till = moment(stream.payed_till).utc().valueOf();
          let m = payed_till > moment().utc().valueOf() ? moment(payed_till) : moment();
          Streams.insert({stream: stream, replace: true, payed_till: m.add(price.days).add(price.hours).utc().format()});
          Streams.update({
            _id: streamId
          }, {
            $set: {
              payed_till: m.add(price.days).add(price.hours).utc().format()
            }
          });
        });
      }
    }
  }

  res.end();
});