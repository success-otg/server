const express = require('express')
const Captchas = require('../controller/v1/captchas')
const User = require('../controller/users/user')
const CityHandle = require('../controller/v1/cities')
const router = express.Router()

const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

router.get('/captchas', Captchas.getCaptchas)
router.post('/img', Captchas.getImg)
router.post('/users/list', User.getUserList)
router.get('/users/count', User.getUserCount)
router.post('/users/:user_id/avatar', User.updateAvatar)
router.get('/cities', CityHandle.getCity)
router.get('/cities/:id', CityHandle.getCityById)
router.get('/exactaddress', CityHandle.getExactAddress)


module.exports = router