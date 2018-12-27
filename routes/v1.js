const express = require('express')
const Captchas = require('../controller/v1/captchas')
const router = express.Router()

router.post('/captchas', Captchas.getCaptchas)

module.exports = router