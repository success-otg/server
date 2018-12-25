const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin/Admin')

/* GET users listing. */
router.get('/user', function(req, res, next) {
  Admin.create({username: 'Vicky', password: '123456'}).then((res)=>{
    console.log(res)
  }).catch(e=>{
    console.log(e)
  })
  res.send({
    username: 'Vicky'
  })
});

router.post('/register', (req, res, next)=>{

})

module.exports = router;
