import Peer from 'simple-peer';
import {
  deviceId
} from '../../js/deviceId'
import {
  start_video
} from '../../js/start_video'
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

Template.stream.onCreated(function () {
  let t = this;
  t.autorun(() => {
    t.subscribe('stream', Router.current().params._id);
    t.subscribe('peers', Router.current().params._id);
  });

  window.addEventListener('beforeunload', function () {
    t.peerId && Meteor.call('remove_receiver', t.peerId);
    t.socket && t.socket.emit('close_connection', {
      to: t.to
    });
    t.stream && t.stream.getTracks().forEach(track => track.stop());
    delete t.socket;
    delete t.peerId;
    delete t.stream;
    delete t.to
  });

  t.variables = {
    devices: new ReactiveVar({}),
    expired: new ReactiveVar(false)
  };
  t.liqpay_forms = new ReactiveVar([]);
  t.stream;

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach((device, index) => {
      let d = t.variables.devices.get();
      d[device.kind] = d[device.kind] ? d[device.kind] : [];
      d[device.kind].push(device);
      t.variables.devices.set(d);
      if (index == devices.length - 1) {
        Meteor.setTimeout(() => {
          t.$('select').material_select();
        }, 0);
      }
    });
  });
});

Template.stream.onRendered(function () {
  let t = this;
  let serverDate = moment(ServerDate.findOne().date).utc().valueOf();
  t.autorun(() => {
    if (Router.current().params._id) {
      Materialize.updateTextFields();
      if (t.socket || t.peerId || t.stream) {
        // close previous collection && clear all its data
        t.peerId && Meteor.call('remove_receiver', t.peerId);
        t.socket && t.socket.emit('close_connection', {
          to: t.to
        });
        t.stream && t.stream.getTracks().forEach(track => track.stop());
        delete t.socket;
        delete t.peerId;
        delete t.stream;
        delete t.to
      }

      let stream = Template.stream.__helpers.get('stream').call();
      //console.log('stream : ', stream);
      t.variables.expired.set(!(moment(stream.payed_till).utc().valueOf() > serverDate));
      
      if (Template.stream.__helpers.get('first').call() || !t.variables.expired.get()) {
        //set timeout and reload if and when payed term will get expired
        if (!t.variables.expired.get()) {
          Meteor.setTimeout(() => {
            t.variables.expired.set(true);
            location.reload();
          }, moment(stream.payed_till).utc().valueOf() - serverDate);
        }

        if (stream.deviceId == deviceId) {
          //source pc
          t.variables.constraints = stream.constraints;
          start_video(t.stream, t.variables.constraints, 'output').then((stream) => {
            t.stream = stream;
          });
        } else {
          // receiver pc
          const PORT = Settings.findOne({_id: 'socket'}).port;
          t.socket = require('socket.io-client')(PORT);
          console.log('socket : ', t.socket);
          t.socket.on('connect', function () {
            console.log('socket connected');
            t.peerId = new Mongo.ObjectID()._str;
            Meteor.call('add_receiver', t.peerId, stream._id, stream.deviceId, stream.constraints, t.socket.id, function () {
              let peer = new Peer();
              peer.on('signal', function (data) {
                t.socket.emit('signal', {
                  signal: data,
                  to: t.to, //to
                })
              });

              t.socket.on('signal', function (data) {
                peer.signal(data.signal);
                t.to = data.from;
              });

              peer.on('stream', function (stream) {
                t.stream = stream;
                document.getElementById('output').srcObject = stream;
              });
            });
          });
        }
      }
    }
  });

  //reload page if stream constraints changed
  t.autorun(() => {
    if (Router.current().params._id) {
      Streams.find({
        _id: Router.current().params._id
      }).observeChanges({
        changed(id, stream) {
          if (stream.constraints || stream.payed_till) {
            location.reload()
          }
        }
      });
    }
  });

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
      let stream = Streams.findOne({
        _id: Router.current().params._id
      });
      Prices.find().fetch().forEach((price) => {
        //console.log(price);
        let term = `channel.payment term.${price._id}`;
        let d = `${T9n.get('channel.payment description')} ${stream.name || stream._id} ${T9n.get(term)}`;
        let amount = price.price * rate / 97.25 * 100;
        //console.log(d);
        Meteor.call('create_form', {
          'action': 'pay',
          'amount': amount,
          'currency': currency,
          'description': d,
          'order_id': `${Router.current().params._id}:${price._id}`,
          'version': '3',
          language: Session.get('language'),
          /// test environment
          sandbox: 1,
          result_url: `https://tvcamtv.com/stream/${Router.current().params._id}`,
          server_url: 'https://tvcamtv.com/liqpay'
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
});

Template.stream.onDestroyed(function () {
  let t = this;
  t.peerId && Meteor.call('remove_receiver', t.peerId);
  t.socket && t.socket.emit('close_connection', {
    to: t.to
  });
  t.stream && t.stream.getTracks().forEach(track => track.stop());
  delete t.socket;
  delete t.peerId;
  delete t.stream;
  delete t.to
});

Template.stream.helpers({
  stream() {
    return Streams.findOne({
      _id: Router.current().params._id
    })
  },
  sameDevice(devId) {
    let t = Template.instance();

    if (deviceId == devId) {
      Meteor.setTimeout(() => {
        t.$('select').material_select();
      }, 0)
    }
    return deviceId == devId
  },
  video() {
    return Template.instance().variables.devices.get()['videoinput']
  },
  audio() {
    return Template.instance().variables.devices.get()['audioinput']
  },
  first() {
    return Streams.findOne({}, {
      sort: {
        created: 1
      }
    })._id == Router.current().params._id
  },
  expired() {
    return Template.instance().variables.expired.get()
  },
  liqpay_forms(){
    return Template.instance().liqpay_forms.get()
  }
});

Template.stream.events({
  'click .remove_stream'(e, t) {
    Meteor.call('remove_stream', Router.current().params._id, function (err, res) {
      if (!err) {
        Materialize.toast('Канал удален', 1000);
        Router.go('/add_stream');
      } else console.log(err);
    })
  },
  'blur #name'(e, t) {
    Meteor.call('update_stream_name', Router.current().params._id, e.target.value);
  },
  'change select'(e, t) {
    t.variables.constraints[e.target.id] = !!e.target.value ? {
      deviceId: e.target.value
    } : false;
    Meteor.call('update_constraints', Router.current().params._id, t.variables.constraints, function (err, res) {
      if (!err) {
        start_video(t.stream, t.variables.constraints, 'output').then(res => t.stream = res);
      } else console.log(err);
    });
  },
});