// pages/sponsor/sponsor.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
    console.log(options)
    var that = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Home/Index/get_user_info?mid=' + options.mid, 
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data,
          pic: res.data.pic_list
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
  }
})