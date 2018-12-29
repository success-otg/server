const mongoose = require('mongoose')

const userInfoSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: 'default.png'
  },
  balance: {
    type: Number,
    default: 0
  },
  brand_member_new: {
    type: Number,
    default: 0
  },
  current_address_id: {
    type: Number,
    default: 0
  },
  current_invoice_id: {
    type: Number,
    default: 0
  },
  delivery_card_expire_days: {
    type: Number,
    default: 0
  },
  email:{
    type: String,
    default: ''
  },
  gift_amount: {
    type: String,
    default: 3
  },
  city: String,
  register_time: String,
  id: Number,
  user_id: Number,
  is_active: {
    type: Number,
    default: 1
  },
  is_email_valid: {
    type: Boolean,
    default: false
  },
  is_mobile_valid: {
    type: Boolean,
    default: true
  },
  mobile: {
    type: String,
    default: ''
  },
  point: {
    type: Number,
    default: 0
  },
  username: String,
  column_desc: {
    game_desc: {
      type: String,
      default: '玩游戏领红包'
    },
    game_img_hash: {
      type: String,
      default: '05f108ca4e0c543488799f0c7c708cb1jpeg'
    },
    game_is_show: {
      type: Number,
      default: 1
    },
    game_link: {
      type: Number,
      default: 'https://gamecenter.faas.ele.me'
    },
    game_mall_desc: {
      type: String,
      default: '0元好物在这里'
    }
  }
})

const Info = mongoose.model('Info', userInfoSchema)

module.exports = Info