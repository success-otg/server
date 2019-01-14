const express = require('express');
const router = express.Router();
const Admin = require('../controller/admin/admin')

router.post('/login',Admin.login)
router.get('/info', Admin.getAdminInfo)
router.get('/signout', Admin.signout)

module.exports = router;
