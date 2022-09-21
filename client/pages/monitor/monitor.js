import Peer from 'simple-peer';
import {
  Streams
} from '../../collections/Streams'
import {
  Settings
} from '../../collections/Settings'
import {
  ServerDate
} from '../../../lib/collections/serverDate';

Template.monitor.onCreated(function () {
  let t = this;
  t.streams_cursor = Streams.find({}, {
    sort: {
      created: 1
    }
  });
  t.sockets = {};
  t.sockets_to_disconnect = new Set();
  t.peers_to_disconnect = [];
  t.disconnecting_socket;
  t.channels_loading = {};

  t.streams_cursor.fetch().forEach((stream) => {
    t.channels_loading[stream._id] = new ReactiveVar(true);
  });
  
  ['beforeunload', 'unload', 'pagehide'].forEach((ev) => {
    window.addEventListener(ev, function () {
      Blaze.remove(t.view);
    });
  });
});

Template.monitor.onRendered(function () {
  let t = this;

  const {PORT} = Settings.findOne({
    _id: 'socket'
  });
  let serverDate = ServerDate.findOne().date;
  t.streams_cursor.fetch().forEach((stream, index) => {
    //console.log(stream, index);
    if (!index || stream.payed_till > serverDate) {

      t.sockets[stream._id] = {
        socket: require('socket.io-client')(`${window.location.protocol}//${window.location.hostname}:${PORT}`),
        peerId: '',
        to: '',
      };
      //console.log('socket : ', t.sockets[stream._id].socket);
      t.sockets[stream._id].socket.on('connect', function () {
        t.sockets[stream._id].peerId = new Mongo.ObjectID()._str;

        t.sockets_to_disconnect.add(t.sockets[stream._id].socket.id);
        t.peers_to_disconnect.push(t.sockets[stream._id].peerId);
        if (!index) {
          t.disconnecting_socket = t.sockets[stream._id].socket;
        }

        Meteor.call('add_receiver', t.sockets[stream._id].peerId, stream._id, stream.deviceId, stream.constraints, t.sockets[stream._id].socket.id, function () {
          let peer = new Peer();
          peer.on('signal', function (data) {
            t.sockets[stream._id].socket.emit('signal', {
              signal: data,
              to: t.sockets[stream._id].to, //to
            })
          });

          t.sockets[stream._id].socket.on('signal', function (data) {
            peer.signal(data.signal);
            t.sockets_to_disconnect.add(data.from);
            t.sockets[stream._id].to = data.from;
          });

          peer.on('stream', function (data) {
            t.channels_loading[stream._id].set(false);
            Meteor.defer(() => {
              document.getElementById(stream._id).srcObject = data;
            })
          });
        });
      });
    }
  });

  // reload page if stream added or changed constraints
  let initialized = false;
  t.autorun(() => {
    t.streams_cursor.observeChanges({
      added(id, stream) {
        if (initialized) {
          if (stream.constraints.video || stream.constraints.audio) {
            location.reload()
          }
        }
      },
      changed(id, stream) {
        if (stream.constraints) {
          location.reload()
        }
      }
    })
  });
  initialized = true;

});

Template.monitor.onDestroyed(function () {
  let t = this;
  Meteor.call('remove_receivers', t.peers_to_disconnect);
  t.disconnecting_socket.emit('close_connections', {
    sockets: [...t.sockets_to_disconnect]
  });
});

Template.monitor.helpers({
  streams() {
    return Template.instance().streams_cursor.fetch()
  },
  channel_loading(_id) {
    return Template.instance().channels_loading[_id].get()
  }
});

Template.monitor.events({

});