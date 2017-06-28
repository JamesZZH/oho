// pages/pay/pay-success.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Index/my_publish_active_pay/id/' + options.id,
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
  goBack: function () {
    wx.switchTab({
      url: '../my/my'
    })
    // wx.navigateBack({
    //   delta: 2
    // })
  }
})