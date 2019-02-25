/**
 * 为什么不能用箭头函数
 * @type {*|Mongoose}
 */

const mongoose = require('mongoose')
const cityData = require('../../InitData/cities')

let citySchema = new mongoose.Schema({
  data: {}
})

//模糊查询城市，匹配首字母
citySchema.statics.cityGuess = function(name){
  return new Promise(async (resolve, reject) => {
    const firstWord = name.substr(0, 1).toUpperCase()
    try {
      const city = await this.findOne()
      Object.entries(city.data).forEach(item =>{
        if (item[0] === firstWord){
          item[1].forEach(cityItem => {
            if (cityItem.pinyin === name) {
              resolve(cityItem)
            }
          })
        }
      })
    }catch (e) {
      reject({
        name: 'ERROR_DATA',
        message: '查找数据失败'
      })
      console.error(e)
    }
  })
}

//获取热门城市列表
citySchema.statics.cityHot = function(){
  return new Promise(async (resolve, reject)=>{
    try {
      console.log(123)
      console.log(this)
      console.log(456)
      const city = await this.findOne()
      console.log(city)
      resolve(city.data.hotCities)
    }catch (e) {
      reject({
        name: 'ERROR_DATA',
        message: '查找数据失败'
      })
    }
  })
}

//城市按照首字母分组
citySchema.statics.cityGroup = function(){
  return new Promise(async (resolve, reject) => {
    try {
      const city = await this.findOne()
      const cityObj = city.data
      delete(cityObj._id)
      delete(cityObj.hotCities)
      resolve(cityObj)
    }catch (e) {
      reject({
        name: 'ERROR_DATA',
        message: '查找数据失败'
      })
    }
  })
}

//通过城市id来查找城市
citySchema.statics.getCityById = function(id){
  return new Promise(async (resolve, reject)=>{
    try {
      const city = await this.findOne()
      Object.entries(city.data).forEach(item=>{
        if (item[0] !== '_id' && item[0] !== 'hotCities') {
          item[1].forEach(cityItem => {
            if (cityItem.id === id){
              resolve(cityItem)
            }
          })
        }
      })
    }catch (e) {
      reject({
        name: 'ERROR_DATA',
        message: '查找数据失败'
      })
      console.error(e)
    }
  })
}

const Cities = mongoose.model('Cities', citySchema)

//向数据库存入数据
Cities.findOne((err, data) => {
  if (!data){
    Cities.create({data: cityData})
  }
})

module.exports = Cities
