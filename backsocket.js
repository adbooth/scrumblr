// Generated by CoffeeScript 1.10.0

/* src/backsocket.js */

(function() {
  var activeBoards, db, io;

  io = require('socket.io')(require('./server').server);

  db = require('./server').db;

  activeBoards = [];

  io.on('connect', function(socket) {
    var boards;
    boards = db.collection('boards');
    return socket.on('HANDSHAKE', function(fingerprint) {
      return boards.findOne({
        fingerprint: fingerprint
      }, function(err, item) {
        return socket.emit('INITIALIZE', JSON.parse(item.data));
      });
    });
  });

}).call(this);