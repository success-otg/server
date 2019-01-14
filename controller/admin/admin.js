const AdminModel = require('../../models/Admin/Admin')
const AddressComponent = require('../../prototypes/AddressComponent')
const moment = require('moment')
const crypto = require('crypto')

class Admin extends AddressComponent {
  constructor() {
    super()
    this.login = this.login.bind(this)
  }

  async login(req, res, next) {
    const statusArr = [0, 1, 2]
    const cap = req.cookies.cap
    const {loginFlag, user_name, password, captcha} = req.body
    try {
      if (!user_name || !password || !captcha) {
        let resData = {
          status: 0,
          type: 'GET_ERROR_FORM_DATA',
          message: '用户参数信息错误'
        }
        res.send(resData)
        return
      } else if (!statusArr.includes(Number(loginFlag))) {
        let resData = {
          status: 0,
          type: 'ERROR_LOGIN_FLAG',
          message: '登录标识非法'
        }
        res.send(resData)
        return
      } else if (!cap) {
        let resData = {
          status: 0,
          type: 'ERROR_CAPTCHA',
          message: '验证码失效'
        }
        res.send(resData)
        return
      } else if (cap.toString !== captcha.toString) {
        let resData = {
          status: 0,
          type: 'ERROR_CAPTCHA',
          message: '验证码不正确'
        }
        res.send(resData)
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
          req.session.admin_id = id
          let resData = {
            status: 1,
            type: 'SUCCESS',
            message: `管理员${user_name}登录成功`
          }
          res.send(resData)
          return ''
        } else if (newpassword !== admin.password.toString()) {
          let resData = {
            status: 0,
            type: 'ERROR_PASSWORD',
            message: `管理员登录密码错误`
          }
          res.send(resData)
          return ''
        } else {
          req.session.admin_id = admin.id
          let resData = {
            status: 1,
            type: 'SUCCESS',
            message: `管理员${user_name}登录成功`
          }
          res.send(resData)
          return ''
        }
      } catch (e) {
        let resData = {
          status: 0,
          type: 'SAVE_ADMIN_ERROR',
          message: `登录失败`
        }
        res.send(resData)
      }
    } catch (e) {
      let resData = {
        status: 0,
        type: 'GET_ERROR_PARAM',
        message: e.message
      }
      res.send(resData)
    }
  }

  encryption(password) {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }

  async signout(req, res) {
    try {
      delete req.session.admin_id
      res.send({
        status: 1,
        success: '退出成功'
      })
    }catch (e) {
      res.send({
        status: 0,
        message: `退出失败，${e}`
      })
    }
  }

  async getAdminInfo(req, res) {
    const admin_id = req.session.admin_id
    const adminInfo = await AdminModel.findOne({id: admin_id})
    res.send({
      status: 1,
      type: 'SUCCESS',
      adminInfo
    })
  }
}

module.exports = new Admin()