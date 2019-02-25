const captchapng = require('captchapng')

class Captchas {
  async getCaptchas(req, res, next) {
    const cap = parseInt(Math.random() * 9000 + 1000)
    const p = new captchapng(220, 60, cap)
    p.color(125, 125, 125, 125)
    p.color(80, 80, 80, 255)
    const base64 = p.getBase64()
    res.cookie('cap', cap)
    res.send({
      status: 1,
      code: 'data:image/png;base64,' + base64,
      // header1: req.header('x-forwarded-for'),
      header2: req.connection.remoteAddress,
      // header3: req.socket.remoteAddress,
      // header4: req.connection.socket.remoteAddress
    })
  }

  async getImg(req, res) {
    res.send({
      data: req.body
    })
  }
}

module.exports = new Captchas()