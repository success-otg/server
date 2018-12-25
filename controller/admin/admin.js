/*const AdminModel = require('../../models/Admin')
const AdressComponent = require()*/
import AdminModel from '../../models/Admin/Admin'
import AddressComponent from '../../prototypes/AddressComponent'
import formidable from 'formidable'
import dtime from 'time-formater'
import crypto from 'crypto'

class Admin extends AddressComponent{
  constructor(){
    super()
  }
  async login(req, res, next){
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

    })
  }
  encryption(password){
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }
}

export default Admin