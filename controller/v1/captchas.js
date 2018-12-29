const captchapng = require('captchapng')

class Captchas {
  async getCaptchas(req, res,next){
    const cap = parseInt(Math.random()*9000 + 1000)
    const p = new captchapng(220, 60, cap)
    p.color(125,125,125,125)
    p.color(80,80,80,255)
    const base64 = p.getBase64()
    res.cookie('cap', cap)
    // console.log(req.cookies)
    res.send({
      status: 1,
      code: 'data:image/png;base64,'+base64
    })
  }
}

module.exports = new Captchas()