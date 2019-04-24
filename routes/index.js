var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/i', function(req, res) {
  res.status(200).json({message:'index'});
});

module.exports = router;
