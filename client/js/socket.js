const PORT = 8080;
let socket = require('socket.io-client')(`http://localhost:${PORT}`);

socket.on('connect', function () {
  console.log('Connected to signalling server, Peer ID: %s', socket.id);
});

socket.on('peer', function (data) {
  var peerId = data.peerId;
  var peer = new Peer({
    initiator: data.initiator,
  });

  console.log('Peer available for connection discovered from signalling server, Peer ID: %s', peerId);

  socket.on('signal', function (data) {
    if (data.peerId == peerId) {
      console.log('Received signalling data', data, 'from Peer ID:', peerId);
      peer.signal(data.signal);
    }
  });

  peer.on('signal', function (data) {
    console.log('Advertising signalling data', data, 'to Peer ID:', peerId);
    socket.emit('signal', {
      signal: data,
      peerId: peerId
    });
  });
  peer.on('error', function (e) {
    console.log('Error sending connection to peer %s:', peerId, e);
  });
  peer.on('connect', function () {
    console.log('Peer connection established');
    peer.send("hey peer");
  });
  peer.on('data', function (data) {
    console.log('Recieved data from peer:', data);
  });
  peers[peerId] = peer;
});