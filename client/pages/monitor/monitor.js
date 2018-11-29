import Peer from 'simple-peer';
import {
  Streams
} from '../../collections/Streams'
import {
  Settings
} from '../../collections/Settings'

Template.monitor.onCreated(function () {
  let t = this;
  t.streams_cursor = Streams.find();
  t.sockets = {};
  t.sockets_to_disconnect = new Set();
  t.peers_to_disconnect = [];
  t.disconnecting_socket;

  window.addEventListener('beforeunload', function () {
    Meteor.call('remove_receivers', t.peers_to_disconnect);
    t.disconnecting_socket.emit('close_connections', {
      sockets: [...t.sockets_to_disconnect]
    });
  });
});

Template.monitor.onRendered(function () {
  let t = this;

  const PORT = Settings.findOne({_id: 'socket'}).port;
  t.streams_cursor.fetch().forEach((stream, index) => {
    t.sockets[stream._id] = {
      socket: require('socket.io-client')(),
      peerId: '',
      to: '',
    };
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
          document.getElementById(stream._id).srcObject = data;
        });
      });
    });
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
  }
});

Template.monitor.events({

});