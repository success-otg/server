const BaseComponent = require('./baseComponent')
process.env.NODE_ENV = 'development'

class AddressComponent extends BaseComponent{
  constructor(props) {
    super(props);
    this.baiduKey = 'zY0sETmqoPcjCIYhOweHfWYGr42z0OqS'
    this.url = 'http://api.map.baidu.com/location/ip'
  }
//  获取定位地址
  async guessPosition(req){
    return new Promise(async (resolve, reject)=>{
      let ip
      const defaultIp = '180.158.102.141'
      if (process.env.NODE_ENV === 'development'){
        ip = defaultIp
      } else {
        try {
          ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
          const ipArr = ip.split(':');
          ip = ipArr[ipArr.length -1] || defaultIp;
        }catch (e) {
          console.log(e)
          ip = defaultIp
        }
      }
      try {
        let result = await this.fetch(this.url, {ip, ak: this.baiduKey})
        console.log(result)
        if (result.status === 0){
          const cityInfo = {
            lat: result.content.point.x,
            lng: result.content.point.y,
            city: result.content.address
          }
          resolve(cityInfo)
        }
      }catch (e) {
        reject(e)
      }
    })
  }

//  通过ip地址获取精确位置
  async geocoder(req){
    try {
      const address = await this.guessPosition(req)
      const params = {
        ak: this.baiduKey,
        location: address.lat + ','+ address.lng,
        output: 'json'
      }
      let res = await this.fetch(this.url, params)
      if (res.status === 0){
        return res
      }else {
        throw new Error('获取具体位置信息失败')
      }
    }catch (e) {
      throw new Error(e)
    }
  }
//  通过geohash获取精确位置
  async getpois(lat,lng){
    try {
      const params = {
        ak: this.baiduKey,
        location: lat + ',' + lng,
        output: 'json'
      }
      let res = await this.fetch(this.url, params)
      if (res.status === 0){
        return res
      } else {
        throw new Error('通过geohash获取具体位置失败')
      }
    }catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = AddressComponent