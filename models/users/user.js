const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  user_id: Number,
  username: String,
  password: String
})

const User = mongoose.model('User', userSchema)

module.exports = User