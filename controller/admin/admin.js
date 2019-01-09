const AdminModel = require('../../models/Admin/Admin')
const AddressComponent = require('../../prototypes/AddressComponent')
const moment = require('moment')
const crypto = require('crypto')

class Admin extends AddressComponent {
  constructor() {
    super()
    this.resData = {
      status: 1,
      type: 'SUCCESS',
      message: ''
    }
    this.login = this.login.bind(this)
  }

  async login(req, res, next) {
    const statusArr = [0, 1, 2]
    const cap = req.cookies.cap
    const {loginFlag, user_name, password, captcha} = req.body
    try {
      if (!user_name || !password || !captcha) {
        this.resData.status = 0
        this.resData.type = 'GET_ERROR_FORM_DATA'
        this.resData.message = '用户参数信息错误'
        res.send(this.resData)
        return
      } else if (!statusArr.includes(Number(loginFlag))) {
        this.resData.status = 0
        this.resData.type = 'GET_ERROR_LOGIN_FLAG'
        this.resData.message = '登录标识非法'
        res.send(this.resData)
        return
      } else if (!cap) {
        this.resData.status = 0
        this.resData.type = 'ERROR_CAPTCHA'
        this.resData.message = '验证码失效'
        res.send(this.resData)
        return
      } else if (cap.toString !== captcha.toString) {
        this.resData.status = 0
        this.resData.type = 'ERROR_CAPTCHA'
        this.resData.message = '验证码不正确'
        res.send(this.resData)
        return
      }
      const newpassword = this.encryption(password)
      try {
        const admin = await AdminModel.findOne({user_name})
        if (!admin) {
          const tip = 1
          const adminTip = tip === 1 ? '管理员' : '超级管理员'
          const id = await this.getId('admin_id')
          const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
          const newAdmin = {
            user_name,
            password: newpassword,
            loginFlag,
            id,
            status: tip,
            create_time,
            admin: adminTip,
          }
          AdminModel.create(newAdmin)
          res.cookie('admin_id', id)
          this.resData.message = `管理员${user_name}登录成功`
          res.send(this.resData)
        }else if (newpassword!==admin.password.toString()) {
          this.resData.status = 0
          this.resData.type = 'ERROR_PASSWORD'
          this.resData.message = '管理员登录密码错误'
          res.send(this.resData)
        }else {
          res.cookie('admin_id', admin.id)
          this.resData.message = `管理员${admin.user_name}登录成功`
          res.send(this.resData)
        }
      } catch (e) {
        this.resData.status = 0
        this.resData.type = 'SAVE_ADMIN_ERROR'
        this.resData.message = '登录失败'
      }
    } catch (e) {
      this.resData.status = 0
      this.resData.type = 'GET_ERROR_PARAM'
      this.resData.message = e.message
      res.send(this.resData)
    }
  }

  encryption(password) {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }
}

module.exports = new Admin()