const express = require('express');
const router = express.Router();
const User = require('../controller/users/user')

router.post('/login',User.login)
router.get('/signout', User.signout)


module.exports = router;
