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
    let body = [];
    req.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
    });
    let s = liqpay.str_to_sign(keys.private + req.query.data + keys.private);
    if (s == req.query.signature) {
      //parse params
      let data = JSON.parse(Buffer.from(req.query.data, 'base64'));

      Payments.insert({
        data,
        signature: req.query.signature,
        method: req.method,
        received: moment().utc().format()
      });

      if (['wait_accept', 'success', 'sandbox'].includes(data.status)) {
        data.order_id.replace(/([^\s\:]+)\:([^\s]+)/, function (match, streamId, priceId) {
          let stream = Streams.findOne({
            _id: streamId
          });
          let price = Prices.findOne({
            _id: priceId
          });
          let payed_till = moment(stream.payed_till).utc().valueOf();
          if (payed_till > moment().utc().valueOf()) {
            Streams.update({
              _id: streamId
            }, {
              $set: {
                payed_till: moment(payed_till).add(price.days).add(price.hours).utc().format()
              }
            })
          } else {
            Streams.update({
              _id: streamId
            }, {
              $set: {
                payed_till: moment().add(price.days).add(price.hours).utc().format()
              }
            })
          }
        });
      }
    }
  }

  res.end();
});

/*
var express = require('express')
var bodyParser = require('body-parser')
 
var app = express()
 
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
// POST /login gets urlencoded bodies
app.post('/liqpay', function (req, res) {
  console.log(req);
  //if (!req.body) return res.sendStatus(400)
  res.send('welcome, ');
  res.end(200);
});
app.listen(4000)
*/