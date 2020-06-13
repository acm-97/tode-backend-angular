var express = require('express');
var router = express.Router();
var Chat = require('../models/message.model');

/* GET ALL CHATS */
router.get('/api/message/:room', function(req, res, next) {  
  console.log("heyyy",req.params.room);
  
  Chat.find({ room: req.params.room }, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  });
});

/* SAVE CHAT */
router.post('/api/message', function(req, res, next) {
  console.log(req.body);
  
  Chat.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;