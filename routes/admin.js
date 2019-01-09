const express = require('express');
const router = express.Router();
const Admin = require('../controller/admin/admin')

router.post('/login',Admin.login)

module.exports = router;
