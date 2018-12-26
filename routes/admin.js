const express = require('express');
const router = express.Router();
const Admin = require('../controller/admin/admin')

router.post('/login',Admin.login)
router.post('/user',(req, res,next)=>{
  console.log(Admin)
  res.send({
    name: 'hh'
  })
})

module.exports = router;
