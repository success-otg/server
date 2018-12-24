const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: String,
  password: String
})

const Admin = mongoose.model('Admin', userSchema)

module.exports = Admin