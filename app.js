// app.js
const service = require('./utils/service/api')
App({
  onLaunch() {
    wx.cloud.init({
      env: "cloud1-0gd8ic0b23f05a3f"
    });
    service.token({}).then(res => {
      if (res) {
        wx.setStorageSync('Token', res)
      }
    })
    var d = wx.getSystemInfoSync().windowWidth / 750
    this.globalData.widthW = d
  },
  showLoading: function () {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
  },
  showToast: function (msg, mask, duration) {
    wx.showToast({
      title: msg,
      icon: "none",
      duration: duration || 2000,
      mask: mask
    });
  },
  globalData:{
    widthW:null
  }
})