const http = require('./http')
const baseURL = 'https://aip.baidubce.com/rest/2.0/ocr/v1/'
const toURL = 'https://aip.baidubce.com/oauth/2.0/'
var {
  access_token
} = wx.getStorageSync('Token')

const DATA_API = {
  url: {
    baseURL,
    toURL,
  },
  // 识别获取图片文字
  general: params =>
    http.post(baseURL + `general?access_token=${access_token}`, params, true),
  // 获取Access Token
  token: params =>
    http.post(toURL + 'token?grant_type=client_credentials&client_id=FakbF9uUd0sjBxfAdBndHo1z&client_secret=IvwkGszGDyFvmCNcZNhB2fc0HYeNAK8G', params, true),
}

module.exports = DATA_API