const express = require('express');

const  admin = require('./admin.js')

module.exports = app =>{
  app.use('/admin', admin)
}
