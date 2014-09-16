var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'yChat' });
});

/* go to different channels */
router.get('/:channel', function(req, res) {
  res.render('talk', { title: 'yChat: ' + req.params.channel,
                       channel: req.params.channel });
});

module.exports = router;
