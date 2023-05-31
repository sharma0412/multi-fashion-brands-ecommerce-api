var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: ' ye project khud krna hai khud matlv khud' });
});

module.exports = router;
