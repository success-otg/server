const express = require('express');

const  admin = require('./admin.js')
const v1 = require('./v1')

module.exports = app =>{
  app.use('/admin', admin)
  app.use('/v1', v1)
}
