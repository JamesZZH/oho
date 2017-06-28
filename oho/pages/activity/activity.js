// pages/activity/activity.js
var screenHeight, screenWidth, get_type = 0;
var app = getApp();
Page({
  data: {
    ballBottom: 20,
    ballRight: 30,
    ballOpacity: '.8',
    modalMsgHidden: true,
    imgUrls: [
      '../../images/ad1.png',
      '../../images/ad2.png',
      '../../images/ad3.jpg',
      '../../images/ad4.jpg',
    ],
    icon60: '../../images/avatar.jpg',
    autoplay: true,
    indicatorDots: true,
    activeIndex: 0,
    menus: [],
  },
  //获取设备信息，屏幕的高度宽度
  onLoad: function () {
    wx.getSystemInfo({
      success: function (res) {
        screenHeight = res.windowHeight;
        screenWidth = res.windowWidth;
      }
    });
  },
  onShow: function () {
    // 页面显示
    var _this = this;
    _this.getAdList();
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log('session 未过期');
        wx.login({
          success: function (res) {
            console.log(res);
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://oho.oxygenhoop.com/index.php/Home/Index/login',
                data: {
                  code: res.code
                },
                success: function (res) {
                  console.log(res.data.session_id);
                  var session_id = res.data.session_id;
                  app.globalData.session_id = res.data.session_id;
                  wx.setStorage({
                    key: "session_id",
                    data: res.data.session_id
                  })
                  wx.getUserInfo({
                    success: function (res) {
                      console.log(res);
                      wx.request({
                        url: 'https://oho.oxygenhoop.com/index.php/Index/check_login',
                        method: 'POST',
                        data: {
                          'iv': res.iv,
                          'encryptedData': res.encryptedData,
                          'session_id': session_id
                        },
                        success: function (res) {
                          console.log(res);
                        },
                        fail: function (res) {
                          console.log(res);
                        }
                      })
                    }
                  })
                },
                fail: function (res) {
                  console.log(res);
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      },
      fail: function () {
        //登录态过期
        wx.login({
          success: function (res) {
            console.log(res);
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://oho.oxygenhoop.com/index.php/Home/Index/login',
                data: {
                  code: res.code
                },
                success: function (res) {
                  console.log(res.data.session_id);
                  var session_id = res.data.session_id;
                  app.globalData.session_id = res.data.session_id;
                  wx.setStorage({
                    key: "session_id",
                    data: res.data.session_id
                  })
                  wx.getUserInfo({
                    success: function (res) {
                      console.log(res);
                      wx.request({
                        url: 'https://oho.oxygenhoop.com/index.php/Index/check_login',
                        method: 'POST',
                        data: {
                          'iv': res.iv,
                          'encryptedData': res.encryptedData,
                          'session_id': session_id
                        },
                        success: function (res) {
                          console.log(res);
                        },
                        fail: function (res) {
                          console.log(res);
                        }
                      })
                    }
                  })
                },
                fail: function (res) {
                  console.log(res);
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        app.globalData.lat = res.latitude;
        app.globalData.lng = res.longitude;
        wx.request({
          url: 'https://oho.oxygenhoop.com/index.php/Home/Index/get_type',
          success: function (res) {
            console.log(res);
            _this.setData({
              menus: res.data
            });
            _this.getList(get_type, app.globalData.lat, app.globalData.lng);
            
            app.globalData.menus = res.data;
          }
        })
      },
      fail: function () {
        wx.request({
          url: 'https://oho.oxygenhoop.com/index.php/Home/Index/get_type',
          success: function (res) {
            console.log(res);
            _this.setData({
              menus: res.data
            });
            _this.getList('0', '0', '0');
            app.globalData.menus = res.data;
          }
        })
      }
    })
    var span = wx.getSystemInfoSync().windowWidth / this.data.menus.length + 'px';
    this.setData({
      itemWidth: '180rpx'
    });
  },
  tabChange: function (e) {
    get_type = e.currentTarget.dataset.index;
    this.setData({
      activeIndex: get_type
    });
    this.getList(get_type, app.globalData.lat, app.globalData.lng);
  },
  //浮动球移动事件
  ballMoveEvent: function (e) {
    console.log(e);
    var touchs = e.touches[0];
    var pageX = touchs.pageX;
    var pageY = touchs.pageY;
    if (pageX < 25) return;
    if (pageX > screenWidth - 25) return;
    if (screenHeight - pageY <= 25) return;
    if (pageY <= 25) return;
    var x = screenWidth - pageX - 25;
    var y = screenHeight - pageY - 25;
    this.setData({
      ballBottom: y,
      ballRight: x
    });
  },
  //浮动球点击 侧栏展开
  ballClickEvent: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        app.globalData.lat = res.latitude;
        app.globalData.lng = res.longitude;
        that.getList(get_type, app.globalData.lat, app.globalData.lng);

      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  goDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../detail/detail?aid=' + index
    })
  },
  getList: function (a, b, c) {
    var that = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Home/Index/get_type_list?type_id=' + a + '&lat=' + b + '&lng=' + c,
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data
        })
      }
    })
  },
  getAdList: function () {
    var that = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Home/Index/get_tj_list',
      success: function (res) {
        console.log(res);
        that.setData({
          imgUrls: res.data
        })
      }
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
