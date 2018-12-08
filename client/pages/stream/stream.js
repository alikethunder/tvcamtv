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
    expired: new ReactiveVar(false),
    record_in_progress: new ReactiveVar(false),
    recorded_blobs: new ReactiveVar([]),
    record_started: undefined,
    record_finished: undefined
  };
  t.mediaRecorder;
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
  let serverDate = ServerDate.findOne().date;

  // function to set timeout because of js timeout work only for less then 2^31 milliseconds
  let st = function (delay) {
    if (delay > 86400000) {
      Meteor.setTimeout(() => {
        st(delay - 86400000)
      }, 86400000)
    } else {
      Meteor.setTimeout(() => {
        location.reload();
      }, delay)
    }
  }
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
      let expired_after = stream.payed_till - serverDate;
      
      t.variables.expired.set(expired_after < 0);

      if (Template.stream.__helpers.get('first').call() || expired_after > 0) {
        //set timeout and reload if and when payed term will get expired
        if (expired_after > 0) {
          st(expired_after);
        }

        if (stream.deviceId == deviceId) {
          //source pc
          t.variables.constraints = stream.constraints;
          start_video(t.stream, t.variables.constraints, 'output').then((stream) => {
            t.stream = stream;
          });
        } else {
          // receiver pc
          const PORT = Settings.findOne({
            _id: 'socket'
          }).port;
          t.socket = require('socket.io-client')(PORT);
          //console.log('socket : ', t.socket);
          t.socket.on('connect', function () {
            //console.log('socket connected');
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
            console.log('changed');
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
          'amount': Number.parseFloat(amount).toFixed(2),
          'currency': currency,
          'description': d,
          'order_id': `${Router.current().params._id}:${price._id}/${new Mongo.ObjectID()._str}`,
          'version': '3',
          language: Session.get('language'),
          /// test environment
          //sandbox: 1,
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
  liqpay_forms() {
    return Template.instance().liqpay_forms.get()
  },
  record_in_progress() {
    return Template.instance().variables.record_in_progress.get()
  },
  recording() {
    return Template.instance().variables.recorded_blobs.get().length
  },
  not_expired_or_first(exp, f){
    return !exp || f
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
  'click .start_record'(e, t) {
    t.variables.record_in_progress.set(true);
    t.variables.record_started = ServerDate.findOne().date;
    t.variables.recorded_blobs.set([])
    t.mediaRecorder = new MediaRecorder(t.stream, {
      mimeType: 'video/webm'
    });
    t.mediaRecorder.ondataavailable = function (ev) {
      if (ev.data && ev.data.size > 0) {
        let b = t.variables.recorded_blobs.get();
        b.push(ev.data);
        t.variables.recorded_blobs.set(b);
      }
    }
    t.mediaRecorder.start(10);
    t.record_timeout = Meteor.setTimeout(()=>{
      $('.stop_record').click();
      $('.download_record').click();
      Meteor.setTimeout(()=>{
        $('.start_record').click()
      }, 100);
    }, 3600000);
  },
  'click .stop_record'(e, t) {
    Meteor.clearTimeout(t.record_timeout);
    t.variables.record_in_progress.set(false);
    t.mediaRecorder.stop();
    t.variables.record_finished = ServerDate.findOne().date;
  },
  'click .download_record'(e, t) {
    t.variables.record_finished = t.variables.record_in_progress.get() ? ServerDate.findOne().date : t.variables.record_finished || ServerDate.findOne().date;

    let url = window.URL.createObjectURL(new Blob(t.variables.recorded_blobs.get(), {
      type: 'video/webm'
    }));
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.target = '_blank';
    a.download = `${$('#name').val()} - ${moment(t.variables.record_started).format('D MMM YYYY HH:mm:ss')} - ${moment(t.variables.record_finished).format('D MMM YYYY HH:mm:ss')}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  },
});