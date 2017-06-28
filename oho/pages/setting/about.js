// pages/setting/about.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Index/about',
      success: function (res) {
        console.log(res);
        var article = res.data.content;
        WxParse.wxParse('article', 'html', article, that, 5);
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
  }
})