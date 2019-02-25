const Cities = require('../../models/v1/cities')
const pinyin = require('pinyin')
const AddressComponent = require('../../prototypes/AddressComponent')

class CityHandle extends AddressComponent{
  constructor() {
    super();
    this.getCity = this.getCity.bind(this)
    this.getExactAddress = this.getExactAddress.bind(this)
    this.pois = this.pois.bind(this)
  }
  //获取城市名称
  async getCity(req, res, next){
    const type = req.query.type
    console.log(req.query)
    let cityInfo
    try {
      switch (type) {
        case 'guess':
          const city = await this.getCityName(req)
          cityInfo = await Cities.cityGuess(city)
          break
        case 'hot':
          cityInfo = await Cities.cityHot()
          break
        case 'group':
          cityInfo = await Cities.cityGroup()
          break
        default:
          res.json({
            type: 'ERROR_QUERY_TYPE',
            message: '参数错误'
          })
          return
      }
      res.send(cityInfo)
    }catch (e) {
      res.send({
        name: 'ERROR_DATA',
        message: '获取数据失败'
      })
    }
  }
  async getCityName(req){
    try {
      const cityInfo = await this.guessPosition(req)
      const pinyinArr = pinyin(cityInfo.city, {style: pinyin.STYLE_NORMAL})
      let cityName = ''
      pinyinArr.forEach(item=>{
        cityName += item[0]
      })
      return cityName
    }catch (e) {
      return '北京'
    }
  }
  //通过id获取城市名称
  async getCityById(req, res, next){
    const cityid = req.params.id
    if (isNaN(id)){
      res.json({
        type: 'ERROR_PARAM_TYPE',
        message: '参数错误'
      })
      return
    }
    try {
      const cityInfo = await Cities.getCityById(cityid)
    }catch (e) {
      res.send({
        type: 'ERROR_DATA',
        message: '获取数据失败'
      })
    }
  }

//  获取精确定位
  async getExactAddress(req, res,next){
    try {
      const position = await this.geocoder(req)
      res.send({
        status: 1,
        message: '获取位置信息成功',
        position
      })
    }catch (e) {
      res.send({
        type: 'ERROR_DATA',
        message: '获取精确位置信息失败'
      })
    }
  }

//  通过geohash获取精确定位
  async pois(req, res, next){
    try {
      const geohash = req.params.geohash || ''
      if (geohash.indexOf(',') === -1){
        res.send({
          status: 0,
          type: 'PARAMS_ERROR',
          message: '参数错误'
        })
        return
      }
      const poisArr = geohash.split(',')
      const result = await this.getpois(poisArr[0], poisArr[1])
      if (result.status === 0) {
        const address = result.result
        res.send(address)
      }

    }catch (e) {
      res.send({
        status: 0,
        type: 'ERROR_DATA',
        message: '获取位置信息失败'
      })
    }
  }
}


module.exports = new CityHandle()