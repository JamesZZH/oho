//app.js
App({
  onLaunch: function () {
    wx.showShareMenu()
  },
  getUserInfo: function () {
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
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
                    that.globalData.session_id = res.data.session_id;
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
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    lat: '0',
    lng: '0'
  }
})