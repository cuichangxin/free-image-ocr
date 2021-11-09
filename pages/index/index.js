// index.js
const service = require('../../utils/service/api')
// 获取应用实例
const app = getApp()

Page({
  data: {
    img: '',
    accToken: ''
  },
  onLoad() {
    var _this = this
    wx.request({ // 获取图片审核的access_token
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Z5Dd046G1zwEvYGgqppwfrwT&client_secret=sZUq0P7zkU5PgMQZiV5cZvHSC6TzSiC6',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {},
      success(res) {
        _this.setData({
          accToken: res.data.access_token
        })
      }
    })
  },
  takePhotos(e) {
    this.photoUpload('camera')
  },
  album(){
    this.photoUpload('album')
  },
  phpotoMsg(){
    var self = this
    wx.chooseMessageFile({
      count: 1,
      type: 'image',
      success(res){
        wx.showLoading({
          title: '识别中',
          mask: true
        })
        var t = res.tempFiles[0].path
        wx.setStorageSync('localImg', t)
        self.filebase64(t)
      }
    })
  },
  photoUpload(el) {
    var self = this
    wx.chooseImage({
      count: 1,
      sourceType: [el],
      success(res) {
        wx.showLoading({
          title: '识别中',
          mask: true
        })
        var t = res.tempFilePaths[0]
        wx.setStorageSync('localImg', t)
        self.filebase64(t)
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  filebase64(t){
    var _this = this
    wx.getFileSystemManager().readFile({
      filePath: t,
      encoding: 'base64',
      success(res) {
        let e = res.data
        wx.request({
          url: `https://aip.baidubce.com/rest/2.0/solution/v1/img_censor/v2/user_defined?access_token=${_this.data.accToken}`,
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: {
            image: e
          },
          success(res) {
            console.log(res);
            if (res.data.conclusionType == 1) {
              wx.setStorageSync('imgUrl', e)
              wx.navigateTo({
                url: `/pages/ocrshow/ocrshow`,
              })
            } else if (res.data.conclusionType == 2 || res.conclusionType == 3) {
              app.showToast('图片违规')
            } else {
              app.showToast('上传失败，请重新上传')
            }
            wx.hideLoading()
          }
        })
      }
    })
  },
  about(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  onShareAppMessage: function () {
    return{
      title:'一款简单好用的传图识字小程序',
      path:'/pages/index/index'
    }
  }
})