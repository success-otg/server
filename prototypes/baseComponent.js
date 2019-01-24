// A light-weight module that brings window.fetch to Node.js
const fetch = require('node-fetch')
const Ids = require('../models/ids')
//A Node.js module for parsing form data, especially file uploads.
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
    if (type === 'GET') {
      let dataStr = '' //数据拼接字符串
      Object.keys(data).forEach(key => {
        /**
         * keys方法可以获取对象的所有属性
         * 对象=》属性名
         * 字符串=》索引
         * 构造函数=》空对象或者属性名
         * 数组=》索引
         * @type {string}
         */
        dataStr += key + '=' + data[key] + '&'
      })
      if(dataStr !== ''){
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
    if (type === 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        /**
         * Object.defineProperty(obj , 'key' , {描述信息，是个对象，类似配置项} )
         * 方法接收三个参数，属性所在的对象，属性名 和一个描述符对象。
         * 数据属性的描述符是下面的一个或者多个（configurable、enumerable、writable
         * 和 value）
         * 访问器属性的描述符是以下的一个或多个（configurable、enumerable、get 和 set）
         */
        value: JSON.stringify(data)
      })
    }
    let responseJson
    try {
      const response = await fetch(url, requestConfig)
      if (resType === 'TEXT') {
        responseJson = await response.text()
      } else {
        responseJson = await response.json()
      }
    }catch (e) {
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
