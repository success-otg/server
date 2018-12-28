const AddressComponent = require('../../prototypes/addressComponent')
const formidable = require('formidable')
const UserInfoModel = require('../../models/users/userInfo')
const UserModel = require('../../models/users/user')
const crypto = require('crypto')
const dtime = require('time-formater')

class User extends AddressComponent{
  constructor(){
    super()
  }
  async login(req, res, next){
    const cap = req.cookies.cap
    console.log(req.cookies)
    if (!cap){
      console.log('验证码失效')
      res.send({
        status: 0,
        type: 'ERROR_CAPTCHA',
        message: '验证码失效'
      })
      return
    }
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files)=>{
      console.log(fields)
      console.log(files)
      const {username, password, captcha_code} = fields
      try {
        if (!username){
          throw new Error('用户名参数错误')
        } else if (!password){
          throw new Error('密码参数错误')
        } else if (!captcha_code){
          throw new Error('验证码参数错误')
        }
      }catch (e) {
        console.log('登录参数错误', err)
        res.send({
          status: 0,
          type: 'ERROR_QUERY',
          message: err.message
        })
        return
      }
      if (cap.toString() !== captcha_code.toString()){
        res.send({
          status:0,
          type: 'ERROR_CAPTCHA',
          message: '验证码不正确'
        })
        return
      }
      const newpassword = this.encryption(password)
      try {
        const user = await UserModel.findOne({username})
        if (!user){
          const user_id = await this.getId('user_id')
          const register_time = dtime().format('YYYY-MM-DD HH:mm')
          const newUser = {username, password: newpassword, user_id}
          const newUserInfo = {username, user_id, id: user_id,register_time}
          UserModel.create(newUser)
          const createUser = new UserInfoModel(newUserInfo)
          const userinfo = createUser.save()
          req.session.user_id = user_id
          res.send(userinfo)
        }else if (user.password.toString() !== newpassword.toString()){
          console.log('登录密码错误')
          res.send({
            status: 0,
            type: 'ERROR_PASSWORD',
            message: '密码错误'
          })
          return
        }else {
          req.session.user_id = user.user_id
          const userinfo = await UserInfoModel.findOne({user_id: user.user_id})
          res.send(userinfo)
        }
      }catch (e) {
        console.log('用户登录失败', err)
        res.send({
          status: 0,
          type: 'SAVE_USER_FAILED',
          message: '登录失败'
        })
      }
    })
  }
  encryption(password){
    const newpassword = this.Md5(this.Md5(password).substr(2,7)+ this.Md5(password))
    return newpassword
  }
  Md5(password){
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }
  async getInfo(req, res,next){
    const sid = req.session.user_id
    const qid = req.query.user_id
    const user_id = sid || qid
    if (!user_id || !Number(user_id)){
      res.send({
        status: 0,
        type: 'GET_USER_INFO_FAILED',
        message: '通过session获取用户信息失败'
      })
      return
    }
    try {
      const userinfo = await UserInfoModel.findOne({user_id},'-_id')
      res.send(userinfo)
    }catch (e) {
      console.log('通过session获取用户信息失败', err)
      res.send({
        status: 0,
        type: 'GET_USER_INFO_FAILED',
        message: '通过session获取用户信息失败'
      })
    }
  }
  async getInfoById(req, res, next){
    const user_id = req.params.user_id
    if (!user_id || !Number(user_id)){
      console.log('通过ID获取用户信息失败')
      res.send({
        status: 0,
        type: 'GET_USER_INFO_FAILED',
        message: '通过用户ID获取用户信息失败'
      })
      return
    }
    try {
      const userinfo = await UserInfoModel.findOne({user_id}, '-_id')
      res.send(userinfo)
    }catch (e) {
      console.log('通过ID获取用户信息失败')
      res.send({
        status: 0,
        type: 'GET_USER_INFO_FAILED',
        message: '通过用户ID获取用户信息失败'
      })
      return
    }
  }
  async getUserList(req, res, next){
    const {limit = 20, offset = 0} = req.query
    try {
      const users = await UserInfoModel.find({}, '-_id').sort({}, '-_id').limit(Number(limit)).skip(Number(offset))
      res.send(users)
    }catch (e) {
      console.log('获取用户列表数据失败', e)
      res.send({
        status: 0,
        type: 'GET_DATA_ERROR',
        message: '获取用户列表数据失败'
      })
    }
  }
  async getUserCount(req, res, next){
    try {
      const count = await UserInfoModel.countDocuments()
      res.send({
        status: 1,
        count
      })
    }catch (e) {
      console.log('获取用户数量失败', err)
      res.send({
        status: 0,
        type: 'ERROR_TO_GET_USER_COUNT',
        message: '获取用户数量失败'
      })
    }
  }
}

module.exports = new User()