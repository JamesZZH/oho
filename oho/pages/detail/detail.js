// pages/detail/detail.js
var aid;
var app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        console.log(res);
      }
    })
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options.aid)
    aid = options.aid;
  },
  onReady: function () {
    // 页面渲染完成
    wx.showShareMenu()
  },
  onShow: function () {
    // 页面显示
    var _this = this;
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
            // _this.getList(get_type, app.globalData.lat, app.globalData.lng);
            // _this.getAdList();
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
            // _this.getList('0', '0', '0');
            // _this.getAdList();
            app.globalData.menus = res.data;
          }
        })
      }
    })
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Home/Index/get_active_detial', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        'aid': aid,
        'session_id': app.globalData.session_id
      },
      success: function (res) {
        console.log(res);
        _this.setData({
          list: res.data,
          lat: res.data.lat,
          lng: res.data.lng
        })
      }
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
    // wx.navigateBack({
    //   delta: 99
    // })
  },
  goSponsor: function (e) {
    // 查看发起人信息
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../sponsor/sponsor?mid=' + index
    })
  },
  goMap: function () {
    // 查看具体地理位置
    var that = this;
    console.log(Number(that.data.lat) + '+' + Number(that.data.lng));
    wx.openLocation({
      longitude: Number(that.data.lng),
      latitude: Number(that.data.lat),
    })
  },
  goPay: function () {
    // 去付款
    var that = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Home/Index/join_active',
      method: 'POST',
      data: {
        'session_id': app.globalData.session_id,
        'aid': aid
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == false) {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000
          })
        } else {
          wx.navigateTo({
            url: '../pay/join?aid=' + res.data.order_id
          })
        }
      }
    })
  },
  goReport: function () {
    // 去举报
    wx.navigateTo({
      url: '../detail/report?id=' + aid
    })
  },
  showPic: function (e) {
    console.log(e.currentTarget.dataset.pic);
    wx.previewImage({
      current: e.currentTarget.dataset.pic, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.pic] // 需要预览的图片http链接列表
    })
  },
  // 押金说明
  help: function () {
    wx.showModal({
      title: '提示',
      content: '押金规则：1.活动距离开始2个小时内，不允许取消，取消扣除押金。2.若失约，则扣除押金。3.在活动开始后2个小时内可以签到，T+1后退还押金。',
      showCancel: false,
      confirmText: "知道了",
      success: function (res) {
      }
    })
  },
  // 获取二维码
  sign: function (e) {
    var id = e.currentTarget.dataset.id;
    // this.setData({
    //   ewm: 
    // });
    wx.previewImage({
      current: 'https://oho.oxygenhoop.com/index.php/Index/ewm/aid/' + aid, // 当前显示图片的http链接
      urls: ['https://oho.oxygenhoop.com/index.php/Index/ewm/aid/' + aid] // 需要预览的图片http链接列表
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
            } else {
              wx.showToast({
                title: '签到成功！',
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
  // 去支付
  pay: function () {
    wx.navigateTo({
      url: '../pay/pay?id=' + aid
    })
  },
  // 去支付
  join_pay: function (e) {
    
    wx.navigateTo({
      url: '../pay/join?aid=' + e.currentTarget.dataset.id
    })
  },
  // 分享
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