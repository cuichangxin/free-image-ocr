const sign = require('./sign')
/**
 * @param {api地址} url 
 * @param {参数} data 
 * @param {是否需要token} isLogin 
 */
const post = function (url, data) {
  data = data || {}
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
    });
    wx.request({
      url: url,
      data: sign.prodata(data),
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        wx.hideLoading();
        res = res.data
        if (res) {
          resolve(res)
        } else {
          getApp().showToast(res.msg || '网络错误,请稍后重试')
          resolve(null)
        }
      },
      fail: function (err) {
        wx.hideLoading()
        getApp().showToast('网络错误，请稍后重试')
        reject(err)
      },
    })
  })
}
const get = function (url, data, isLogin) {
    data = data || {}
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseURL + url,
        data: sign.prodata(data),
        method: 'GET',
        success: function (res) {
          resolve(res.data)
        },
        fail: function (err) {
          reject(err)
        },
      })
    })
  }
module.exports = {
  post,
  get,
}
