// Generated by CoffeeScript 1.10.0

/* src/routes.js */

(function() {
  var boards, crypto, path, router;

  path = require('path');

  crypto = require('crypto');

  module.exports = router = require('express').Router();

  boards = require('./server').db.collection('boards');

  router.get('/', function(req, res) {
    return res.sendFile(path.join(__dirname, 'public/views/start.html'));
  });

  router.post('/', function(req, res) {
    var boardName, cleanBoardName, date, fingerprint, shasum;
    boardName = req.body.boardName;
    cleanBoardName = boardName.toLowerCase().replace(' ', '-').replace(/[^0-9a-z_-]/gi, '');
    shasum = crypto.createHash('sha1');
    date = new Date();
    shasum.update(boardName + date);
    fingerprint = shasum.digest('hex');
    boards.insert({
      fingerprint: fingerprint,
      data: JSON.stringify({
        boardName: boardName,
        cleanBoardName: cleanBoardName,
        stickylist: []
      })
    });
    return res.redirect("/" + cleanBoardName + "/" + fingerprint);
  });

  router.get('/:cleanBoardName/:fingerprint', function(req, res) {
    return boards.findOne({
      fingerprint: req.params.fingerprint
    }, function(err, item) {
      if ((item != null) && JSON.parse(item.data).cleanBoardName === req.params.cleanBoardName) {
        return res.sendFile(path.join(__dirname, 'public/views/board.html'));
      } else {
        return res.redirect('/');
      }
    });
  });

}).call(this);
