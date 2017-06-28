var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    showList: 0,
    show: 3
  },
  showInput: function () {
    console.log("inputTyping");
    this.setData({
      inputShowed: true,
    });
  },
  hideInput: function () {
    console.log("inputTyping");
    this.setData({
      inputVal: "",
      inputShowed: false,
      show: 3
    });
  },
  clearInput: function () {
    console.log("inputTyping");
    this.setData({
      inputVal: "",
    });
  },
  inputTyping: function (e) {
    console.log(e);
    var _this = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Home/Index/search?keyword=' + e.detail.value + '&lat=' + app.globalData.lat + '&lng=' + app.globalData.lng,
      success: function (res) {
        console.log(res);
        _this.setData({
          list: res.data
        });
        app.globalData.menus = res.data;
      }
    })
    this.setData({
      inputVal: e.detail.value,
      show: 2
    });
  },
  goDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../detail/detail?aid=' + index
    })
  },
});
