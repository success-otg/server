const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
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
  nickname: String
  // city: String
})

adminSchema.index({id: 1})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin