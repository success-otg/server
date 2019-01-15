const express = require('express')
const Captchas = require('../controller/v1/captchas')
const User = require('../controller/users/user')
const router = express.Router()

router.get('/captchas', Captchas.getCaptchas)
router.post('/img', Captchas.getImg)
router.post('/users/list', User.getUserList)
router.get('/users/count', User.getUserCount)

module.exports = router