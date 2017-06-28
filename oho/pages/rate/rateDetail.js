var id, aid;
var app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(options);
    id = options.id;
    aid = options.aid;
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
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Home/Index/comment_list',
      method: 'POST',
      data: {
        'id': id,
        'session_id': app.globalData.session_id
      },
      success: function (res) {
        console.log(res);
        that.setData({
          flag2: res.data.star,
          image: res.data.logo,
          content: res.data.content
        })
      }
    })
  },
  previewImage: function (e) {
    // console.log(e.currentTarget.dataset.src);
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
})