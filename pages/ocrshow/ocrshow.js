// pages/ocrshow/ocrshow.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ocrImg: '',
    loading: true,
    ocrContent: {},
    slide: false,
    setShow: false,
    localList: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    const {access_token} = wx.getStorageSync('Token')
    const imgUrl = wx.getStorageSync('imgUrl')
    const localImg = wx.getStorageSync('localImg')
    wx.request({ // 识别图片
      url: `https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token=${access_token}`,
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        image: encodeURI(imgUrl),
        probability: true,
        paragraph: true
      },
      success(res) {
        res.data.words_result.map(function (r) {
          r.isHidden = true
        })
        _this.setData({
          ocrImg: 'data:image/png;base64,' + imgUrl,
          loading: false,
          ocrContent: res.data.words_result,
          slide: true,
          setShow: true
        })
        wx.getImageInfo({
          src: localImg,
          success(res) {
            var l = res.width / wx.getSystemInfoSync().windowWidth
            _this.setData({
              ['width']: wx.getSystemInfoSync().windowWidth,
              ['height']: res.height,
              ['l']: l
            })
          },
          fail(err) {
            console.log(err, 'err');
          }
        })
      }
    })
  },
  slideBtn() {
    this.setData({
      slide: !this.data.slide
    })
  },
  copyAll() {
    try {
    let s = this.data.ocrContent.some(item=>item.isHidden == true)
    if (s == false){
      app.showToast('没有内容可以复制')
    }else{
      var arr = []
      this.data.ocrContent.map(function (t) {
        if (t.isHidden !== false) {
          arr.push(t.words)
        }
      })
      let data = arr.reduce(function (t, e) {
        return t + "\n" + e
      })
      wx.setClipboardData({
        data: data,
        success(res) {
          console.log(res);
        },
        fail(err) {
          app.showToast('复制失败')
        }
      })
    }
    } catch (err) {
      console.log(err);
    }
  },
  select(e) {
    var ocrData = this.data.ocrContent,
      a = e.currentTarget.dataset.index;
    ocrData[a].isHidden = !ocrData[a].isHidden
    this.setData({
      ocrContent: ocrData
    })
  },
  selectAll() {
    var a = new Array()
    this.data.ocrContent.forEach(function (t) {
      if (t.isHidden == false) {
        t.isHidden = true
      }
      a.push(t)
    })
    this.setData({
      ocrContent: a
    })
  },

  onShareAppMessage: function () {

  }
})