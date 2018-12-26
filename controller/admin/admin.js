
const AdminModel = require('../../models/Admin/Admin')
const AddressComponent = require('../../prototypes/AddressComponent')
const formidable = require('formidable')
const dtime = require('time-formater')
const crypto = require('crypto')

class Admin extends AddressComponent{
  constructor(){
    super()
    this.login = this.login.bind(this)
  }
  async login(req, res, next){
    console.log(123)
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err){
        res.send({
          status: 0,
          type: 'FORM_DATA_ERROR',
          message: '表单信息错误'
        })
        return ''
      }
      const {user_name, password, status = 1} = fields
      try {
        if (!user_name){
          throw new Error('用户名参数错误')
        } else if (!password){
          throw new Error('密码参数错误')
        } 
      }catch (err) {
        console.log(err.message, err)
        res.send({
          status: 0,
          type: 'GET_ERROR_PARAM',
          message: err.message
        })
        return
      }
      const newpassword = this.encryption(password)
      try{
        const admin = await AdminModel.findOne({user_name})
        if (!admin){
          const adminTip = status == 1?'管理员':'超级管理员'
          const admin_id = await this.getId('admin_id')
          const newAdmin = {
            user_name,
            password: newpassword,
            id: admin_id,
            create_time: dtime().format('YYYY-MM-DD HH:mm'),
            admin: adminTip,
            status
          }
          await AdminModel.create(newAdmin)
          res.send({
            status: 1,
            message: '注册管理员成功'
          })
        }else if (newpassword.toString() != admin.password.toString()){
          console.log('管理员登录密码错误')
          res.send({
            status: 0,
            type: 'ERROR_PASSWORD',
            message: '该用户已存在，密码输入错误'
          })
        } else {
          req.session.admin_id = admin.id
          res.send({
            status: 1,
            message: '登录成功'
          })
        }
      }catch (err) {
        console.log('登录管理员失败', err)
        res.send({
          status: 0,
          type: 'LOGIN_ADMIN_FAILED',
          message: '登录管理员失败'
        })
      }
    })
  }
  encryption(password){
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }
  async register(req, res, next){
    const form = formidable.IncomingForm()
    form.parse(req, async (err, fields, files)=>{
      if (err){
        res.send({
          status: 0,
          type: 'FORM_DATA_ERROR',
          message: '表单信息错误'
        })
        return ''
      }
      const {user_name, password, status = 1} = fields
      //表单验证
      try {
        if (!user_name){
          throw new Error('用户名不能为空')
        } else if (!password){
          throw new Error('密码不能为空')
        } 
      }catch (e) {
        console.log(err.message, err)
        res.send({
          status: 0,
          type: 'GET_ERROR_PARAM',
          message: err.message
        })
      }
    //  用户名不能重复
      try {
        const admin = await AdminModel.findOne({user_name})
        if (admin){
          console.log('该用户已存在')
          res.send({
            status: 0,
            type: 'USER_HAS_EXISTS',
            message: '该用户已存在'
          })
        }else {
          const adminTip = status == 1 ? '管理员' : '超级管理员'
          const admin_id = await this.getId('admin_id')
          const newpassword = this.encryption(password)
          const newAdmin = {
            user_name,
            password: newpassword,
            id: admin_id,
            create_time: dtime().format('YYYY-MM-DD, HH:mm'),
            admin: adminTip,
            status
          }
          await AdminModel.create(newAdmin)
          req.session.admin_id = admin_id
          res.send({
            status: 1,
            message: '注册管理员成功'
          })
        }
      }catch (e) {
        console.log('注册管理员失败', err)
        res.send({
          status: 0,
          type: 'REGISTER_ADMIN_FAILED',
          message: '注册管理员失败'
        })
      }
    })
  }
}

module.exports = new Admin