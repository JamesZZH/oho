// pages/my/my.js
var app = getApp();
Page({
  data: {
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var session_id;
    var that = this;
    wx.getStorage({
      key: 'session_id',
      success: function (res) {
        console.log(res)
        session_id = res.data;
        wx.request({
          url: 'https://oho.oxygenhoop.com/index.php/Index/get_user',
          method: 'POST',
          data: {
            'session_id': session_id,
          },
          success: function (res) {
            console.log(res);
            app.globalData.uid = res.data.data.id;
            that.setData({
              list: res.data.data,
              my_active: res.data.data.my_active,
              join_active: res.data.data.join_active,
            })
          },
          fail: function (res) {
            console.log(res);
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // 设置
  goSetting: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../setting/mySetting?id=' + index
    })
  },
  // 关于
  goAbout: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../setting/about'
    })
  },
  // 取消
  cancel: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定取消？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://oho.oxygenhoop.com/index.php/Index/cancel_active/id/' + id,
            success: function (res) {
              console.log(res);
              if (res.data.is_pay == '-1') {
                that.data.my_active.splice(index, 1);
                that.setData({
                  my_active: that.data.my_active
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 取消参与的活动
  cancel_join: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定取消？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://oho.oxygenhoop.com/index.php/Index/cancel_join_active/id/' + id,
            success: function (res) {
              console.log(res);
              that.data.join_active.splice(index, 1);
              that.setData({
                join_active: that.data.join_active
              });
            },
            fail: function (res) {
              console.log(res);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 去支付
  pay: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../pay/pay?id=' + id
    })
  },
  // 去支付
  join_pay: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../pay/join?aid=' + id
    })
  },
  // 评价
  rate: function (e) {
    console.log(e.currentTarget.dataset.comment);
    var id = e.currentTarget.dataset.id;
    var idd = e.currentTarget.dataset.idd;
    if (e.currentTarget.dataset.comment == 1) {
      wx.navigateTo({
        url: '../rate/rate?id=' + id + '&idd=' + idd
      })
    } else {
      wx.navigateTo({
        url: '../rate/rateDetail?id=' + idd + '&aid=' + id
      })
    }
  },
  // 查看全部跳转
  goSign: function () {
    wx.switchTab({
      url: '../sign/sign'
    })
  },
  // 获取二维码
  sign: function (e) {
    var id = e.currentTarget.dataset.id;
    // this.setData({
    //   ewm: 
    // });
    wx.previewImage({
      current: 'https://oho.oxygenhoop.com/index.php/Index/ewm/aid/' + id, // 当前显示图片的http链接
      urls: ['https://oho.oxygenhoop.com/index.php/Index/ewm/aid/' + id] // 需要预览的图片http链接列表
    })
  },
  // 扫码签到
  join_sign: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        wx.request({
          url: 'https://oho.oxygenhoop.com/index.php/Index/del_sign/aid/' + res.result + '/uid/' + app.globalData.uid,
          success: function (res) {
            console.log(res);
            if (res.data.status == 'error') {
              wx.showToast({
                title: res.data.msg,
                icon: 'loading',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            console.log(res);
          }
        })
      }
    })
  },
  go_pay: function () {
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Index/s_weipay',
      method: 'POST',
      data: {
        'session_id': app.globalData.session_id
      },
      success: function (res) {
        console.log(res);
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function (res) {
            console.log(res);
          },
          'fail': function (res) {
            console.log(res);
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  goDetail: function (e) {
    var index = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?aid=' + index
    })
  },
  onShareAppMessage: function () {
    return {
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})