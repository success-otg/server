const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
  // res.send('respond with a resource');
  res.send({
    username: 'Vicky'
  })
});

module.exports = router;
