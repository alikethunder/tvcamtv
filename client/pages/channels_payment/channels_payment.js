import {
  Streams
} from '../../collections/Streams'
import {
  ServerDate
} from '../../../lib/collections/serverDate';
import {
  Prices
} from '../../collections/Prices'
import {
  Settings
} from '../../collections/Settings'

Template.channels_payment.onCreated(function () {
  let t = this;
  t.liqpay_forms = new ReactiveVar([]);
});

Template.channels_payment.onRendered(function () {
  let t = this;
  t.$('select').material_select();
});

Template.channels_payment.onDestroyed(function () {
  let t = this;

});

Template.channels_payment.helpers({
  streams() {
    let s = Streams.find({}, {
      sort: {
        created: 1
      }
    }).fetch();
    s.shift();
    return s
  },
  liqpay_forms() {
    return Template.instance().liqpay_forms.get()
  },
});

Template.channels_payment.events({
  'close .select-dropdown'(e, t) {
    t.liqpay_forms.set([]);
    let channels = $('#channels_payment').val();
    if (channels.length) {
      //payment buttons
      HTTP.get(Settings.findOne({
        _id: 'currencyUrl'
      }).url, function (err, res) {
        //console.log(err, res);
        if (!err) {
          let currency = Meteor.user().profile.currency;
          let rate;
          if (currency == "UAH") {
            rate = res.data.find(rate => rate.base_ccy == "UAH" && rate.ccy == "USD").sale;
          } else {
            rate = res.data.find(rate => rate.ccy == "USD" && rate.base_ccy == "UAH").sale / res.data.find(rate => rate.ccy == currency && rate.base_ccy == "UAH").sale;
          }
          //console.log(rate);
          //console.log(currency);

          Prices.find().fetch().forEach((price) => {
            //console.log(price);
            let term = `channel.payment term.${price._id}`;
            let d = `${T9n.get('channel.payments description')} ${T9n.get(term)}`;
            let amount = channels.length * price.price * rate / 97.25 * 100;
            //console.log(d);
            Meteor.call('create_form', {
              'action': 'pay',
              'amount': Number.parseFloat(amount).toFixed(2),
              'currency': currency,
              'description': d,
              'order_id': `${channels.toString()}:${price._id}/${new Mongo.ObjectID()._str}`,
              'version': '3',
              language: Session.get('language'),
              /// test environment
              //sandbox: 1,
              result_url: `https://tvcamtv.com/channels_payment`,
              server_url: 'https://tvcamtv.com/liqpay/streams'
            }, function (err, res) {
              if (!err) {
                let f = t.liqpay_forms.get();
                f.push(res.replace('translate', `${d} - ${Number.parseFloat(amount).toFixed(2)} ${currency}`));
                t.liqpay_forms.set(f);
              }
            });
          });
        } else {
          console.log(err)
        }
      });
    }
  }
});