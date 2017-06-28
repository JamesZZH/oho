// pages/detail/report.js
var app = getApp();
var aid;
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    aid = options.id;

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
  bindFormSubmit: function (e) {
    var that = this;
    if (e.detail.value.textarea != '') {
      wx.request({
        url: 'https://oho.oxygenhoop.com/index.php/Home/Index/active_report',
        method: 'POST',
        data: {
          'session_id': app.globalData.session_id,
          'aid': aid,
          'content': e.detail.value.textarea
        },
        success: function (res) {
          console.log(res);
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '内容不能为空',
        showCancel:false,
        success: function (res) {
        }
      })
    }
  }
})