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

WebApp.connectHandlers.use('/liqpay/streams', (req, res, next) => {
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
        data.order_id.replace(/([^\s\:]+)\:([^\s]+)\//, function (match, streamsIds, priceId) {
          let streams = streamsIds.split(',');
          let price = Prices.findOne({
            _id: priceId
          });
          streams.forEach((streamId) => {
            let stream = Streams.findOne({
              _id: streamId
            });
            let payed_till = moment(stream.payed_till).utc().valueOf();
            let m = payed_till > moment().utc().valueOf() ? moment(payed_till) : moment();
            Streams.update({
              _id: streamId
            }, {
              $set: {
                payed_till: m.add(price.days, 'd').add(price.hours, 'h').utc().format()
              }
            });
          });
        });
      }
    }
  }
  res.end();
});