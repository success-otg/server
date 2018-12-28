const express = require('express')
const Captchas = require('../controller/v1/captchas')
const User = require('../controller/users/user')
const router = express.Router()

router.post('/captchas', Captchas.getCaptchas)
router.get('/user', User.getInfo)
router.get('/user/:user_id', User.getInfoById)
router.get('/users/list', User.getUserList)
router.get('/users/count', User.getUserCount)

module.exports = router