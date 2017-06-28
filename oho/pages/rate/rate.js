// pages/rate/rate.js
var app = getApp();
var aid, idd;
Page({
  data: {
    flag2: 5,
    content: '',
    imageList: [''],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(options);
    aid = options.id;
    idd = options.idd;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Home/Index/get_active_detial?aid=' + aid, //仅为示例，并非真实的接口地址
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data,
          lat: res.data.lat,
          lng: res.data.lng
        })
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  goSponsor: function (e) {
    // 查看发起人信息
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../sponsor/sponsor?mid=' + index
    })
  },
  goMap: function () {
    // 查看具体地理位置
    var that = this;
    wx.openLocation({
      latitude: that.data.lat,
      longitude: that.data.lng,
      scale: 15
    })
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  content: function (e) {
    this.setData({
      content: e.detail.value
    })
    console.log(e.detail.value)
  },
  // 提交评价
  rate: function () {
    var that = this;
    if (that.data.imageList[0] == '') {
      if (that.data.content != '') {
        wx.request({
          url: 'https://oho.oxygenhoop.com/index.php/Home/Index/comment',
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
            'session_id': app.globalData.session_id,
            'aid': aid,
            'id': idd,
            'star': that.data.flag2,
            'content': that.data.content
          },
          success: function (res) {
            console.log(res);
            if (res.data.status == true) {
              wx.showModal({
                title: '提示',
                content: '评价成功！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            console.log(res);
          }
        })
      } else {
        wx.showToast({
          title: '请填写评价',
          icon: 'loading',
          duration: 1000
        })
      }
    } else {
      if (that.data.content != '') {
        wx.uploadFile({
          url: 'https://oho.oxygenhoop.com/index.php/Home/Index/comment',
          filePath: that.data.imageList[0],
          name: 'file',
          formData: {
            'session_id': app.globalData.session_id,
            'aid': aid,
            'id': idd,
            'star': that.data.flag2,
            'content': that.data.content
          },
          success: function (res) {
            console.log(res);
            wx.showModal({
              title: '提示',
              content: '评价成功！',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          },
          fail: function (res) {
            console.log(res);
          }
        })
      } else {
        wx.showToast({
          title: '请填写评价',
          icon: 'loading',
          duration: 1000
        })
      }
    }
  },
  // 选星级
  changeColor11: function () {
    var that = this;
    console.log('1')
    that.setData({
      flag2: 1
    });
  },
  changeColor12: function () {
    var that = this;
    console.log('2')
    that.setData({
      flag2: 2
    });
  },
  changeColor13: function () {
    var that = this;
    console.log('3')
    that.setData({
      flag2: 3
    });
  },
  changeColor14: function () {
    var that = this;
    console.log('4')
    that.setData({
      flag2: 4
    });
  },
  changeColor15: function () {
    var that = this;
    console.log('5')
    that.setData({
      flag2: 5
    });
  }
})