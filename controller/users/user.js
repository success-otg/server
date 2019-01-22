const AddressComponent = require('../../prototypes/addressComponent')
const UserInfoModel = require('../../models/users/info')
const UserModel = require('../../models/users/user')
const crypto = require('crypto')
const moment = require('moment')

class User extends AddressComponent {
  constructor() {
    super()
    this.encryption = this.encryption.bind(this)
    this.login = this.login.bind(this)
  }

  async login(req, res, next) {
    const cap = req.cookies.cap
    if (!cap) {
      console.log('验证码失效')
      res.send({
        status: 0,
        type: 'ERROR_CAPTCHA',
        message: '验证码失效'
      })
      return
    }
    //验证参数是否正确传递
    let {username, password, captcha_code} = req.body
    if (!username) {
      throw new Error('用户名参数错误')
    } else if (!password) {
      throw new Error('密码参数错误')
    } else if (!captcha_code) {
      throw new Error('验证码参数错误')
    }
    //验证验证码是否正确
    if (cap.toString() !== captcha_code.toString()) {
      res.send({
        status: 0,
        type: 'ERROR_CAPTCHA',
        message: '验证码不正确'
      })
      return
    }
    const newpassword = this.encryption(password)
    try {
      const user = await UserModel.findOne({username})
      if (!user) {
        const user_id = await this.getId('user_id')
        const register_time = moment().format('YYYY-MM-DD HH:mm').toString()
        const newUser = {username, password: newpassword, user_id: user_id}
        UserModel.create(newUser)
        const newUserInfo = {username, user_id: user_id, id: user_id, register_time}
        const createUser = new UserInfoModel(newUserInfo)
        const userInfo = await createUser.save()
        console.log(userInfo)
        res.send({
          userInfo
        })
        return
      } else if (user.password.toString() !== newpassword.toString()) {
        res.send({
          status: 0,
          type: 'ERROR_PASSWORD',
          message: '登录密码错误'
        })
        return
      } else {
        req.session.user_id = user.user_id
        console.log(user)
        const userInfo = await UserInfoModel.findOne({user_id: user.user_id})
        console.log(userInfo)
        res.send({
          userInfo
        })
      }
    } catch (e) {
      res.send({
        status: 0,
        type: 'SAVE_USER_FAILED',
        message: '登录失败'
      })
    }
  }

  async signout(req, res, next) {
    delete req.session.user_id
    res.send({
      status: 1,
      type: 'SUCCESS',
      message: '退出成功'
    })
  }

  encryption(password) {
    const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password))
    return newpassword
  }

  Md5(password) {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }

  async getUserList(req, res) {
    const {limit, offset} = req.query
    try {
      const users = await UserInfoModel.find({}).limit(Number(limit)).skip(Number(offset))
      res.send({
        status: 1,
        type: 'SUCCESS',
        users
      })
    } catch (e) {
      res.send({
        status: 0,
        type: 'GET_DATA_ERROR',
        message: '获取用户列表失败'
      })
    }
  }

  async getUserCount(req, res) {
    try {
      const count = await UserInfoModel.countDocuments()
      res.send({
        status: 1,
        type: 'SUCCESS',
        count
      })
    } catch (e) {
      res.send({
        status: 0,
        type: 'ERROR_TO_GET_USER_COUNT',
        message: '获取用户数量失败'
      })
    }
  }
}

module.exports = new User()