const express = require('express')
const Captchas = require('../controller/v1/captchas')
const User = require('../controller/users/user')
const router = express.Router()

const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

router.get('/captchas', Captchas.getCaptchas)
router.post('/img', Captchas.getImg)
router.post('/users/list', User.getUserList)
router.get('/users/count', User.getUserCount)
router.post('/users/:user_id/avatar', User.updateAvatar)


module.exports = router