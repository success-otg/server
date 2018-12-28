const express = require('express');

const  admin = require('./admin.js')
const v1 = require('./v1')
const users = require('./users')

module.exports = app =>{
  app.use('/admin', admin)
  app.use('/v1', v1)
  app.use('/users', users)
}
