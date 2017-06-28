var app = getApp();
var id;
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    id = options.aid;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Index/get_join_price/id/' + options.aid,
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
  pay: function (e) {
    // 去付款
    var that = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Index/join_weipay',
      method: 'POST',
      data: {
        'session_id': app.globalData.session_id,
        'id': id
      },
      success: function (res) {
        console.log(res);
        if (that.data.list.total_price == '0.00' || that.data.list.total_price == '0' || that.data.list.total_price == '0.0') {
          wx.navigateTo({
            url: '../pay/join-success?id=' + id
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
              wx.navigateTo({
                url: '../pay/join-success?id=' + id
              })
            },
            'fail': function (res) {
              console.log(res);
            }
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
})