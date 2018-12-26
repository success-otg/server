// A light-weight module that brings window.fetch to Node.js
const fetch = require('node-fetch')
const Ids = require('../models/ids')
//A Node.js module for parsing form data, especially file uploads.
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
// 云存储
const qiniu = require('qiniu')
const gm = require('gm')

module.exports = class BaseComponent {
  constructor(){
    this.idList = ['restaurant_id', 'food_id', 'order_id', 'user_id', 'address_id', 'cart_id', 'img_id', 'category_id', 'item_id', 'sku_id', 'admin_id', 'static_id']
    this.imgTypeList = ['shop', 'food', 'avatar', 'default']
  }
  //封装统一请求方法
  async fetch(url = '', data = {}, type = 'GET', resType = 'JSON'){
    type = type.toUpperCase()
    resType = resType.toUpperCase()

    if (type == 'GET'){
      let dataStr = ''//数据拼接字符串
      Object.keys(data).forEach(key=>{
        dataStr+=key+'='+data[key]+'&'
      })
      if (dataStr !== ''){
        dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
    }

    let requestConfig = {
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    if (type == 'POST'){
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }

    let responseJson
    try {
      const response = await fetch(url, requestConfig)
      if (resType === 'TEXT'){
        responseJson = await response.text()
      }else {
        responseJson = await response.json()
      }
    }catch (e) {
      console.log('获取HTTP数据失败', e)
      throw new Error(e)
    }
    return responseJson
  }
//  根据类型获取id
  async getId(type){
    if (!this.idList.includes(type)) {
      console.log('id类型错误')
      throw new Error('id类型错误')
      return
    }
    try {
      const idData = await Ids.findOne()
      idData[type]++
      await idData.save()
      return idData[type]
    }catch (e) {
      console.log('获取ID数据失败')
      throw new Error(e)
    }
  }
//  上传图片
  async uploadImg(req, res, next){
  }
}
