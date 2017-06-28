// pages/pay/pay.js
var app = getApp();
var id;
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(options);
    id = options.id;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Index/get_price/id/' + id,
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data
        })
      },
      fail: function (res) {
        console.log(res);
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
  pay: function () {
    // 去付款
    var that = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Index/pub_weipay',
      method: 'POST',
      data: {
        'session_id': app.globalData.session_id,
        'id': id
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 'error') {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                // wx.switchTab({
                //   url: '../detail/detail'
                // })
              } else if (res.cancel) {
                console.log('用户点击取消');
                // wx.switchTab({
                //   url: '../detail/detail'
                // })
              }
            }
          })
        }
        if (that.data.list.price == '0.00' || that.data.list.price == '0' || that.data.list.price == '0.0') {
          console.log(that.data.list.price);
          wx.redirectTo({
            url: '../pay/pay-success?id=' + id
          })
        } else {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log(res);
              wx.redirectTo({
                url: '../pay/pay-success?id=' + id
              })
            },
            'fail': function (res) {
              console.log(res);
              wx.showModal({
                title: '提示',
                content: '支付失败',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    wx.switchTab({
                      url: '../my/my'
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                    wx.switchTab({
                      url: '../my/my'
                    })
                  }
                }
              })
            }
          })
        }

      },
      fail: function (res) {
        console.log(res);
      }
    })
  }
})