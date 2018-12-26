const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  user_name: String,
  password: String,
  id: Number,
  create_time: String,
  status: Number,
  admin: {
    type: String,
    default: '管理员'
  },
  avatar: {
    type: String,
    default: 'default.jpg'
  },
  // city: String
})

userSchema.index({id: 1})

const Admin = mongoose.model('Admin', userSchema)

module.exports = Admin