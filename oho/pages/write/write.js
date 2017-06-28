// pages/write/write.js
var app = getApp();
var actName = '', phoneNum = '', vcode = '',uid;
Page({
  data: {
    actType: [],
    today: '',
    location: '',
    date: '选择日期',
    time: '选择时间',
    lat: '',
    lng: '',
    numDetail: '',
    imageList: [''],
    typeDetail: { id: "", cate_name: "" },
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var d = new Date();
    var month = new Array(12)
    month[0] = "01"
    month[1] = "02"
    month[2] = "03"
    month[3] = "04"
    month[4] = "05"
    month[5] = "06"
    month[6] = "07"
    month[7] = "08"
    month[8] = "09"
    month[9] = "10"
    month[10] = "11"
    month[11] = "12"
    // 日期
    var dd = d.getDate();
    if (dd < 10) {
      dd = '0' + dd;
    }
    var num = [];
    for (let i = 1; i < 22; i++) {
      num[i - 1] = i;
    }
    this.setData({
      num: num,
      actType: app.globalData.menus,
      today: d.getFullYear() + '-' + month[d.getMonth()] + '-' + dd,
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Index/checkphone',
      method: 'POST',
      data: {
        'session_id': app.globalData.session_id,
      },
      success: function (res) {
        console.log(res);
        uid = res.data.uid;
        if (res.data.status == "error") {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            confirmText: "去设置",
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../setting/mySetting?id=' + uid
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          that.setData({
            phone: res.data.phone
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // 活动人数
  bindNumChange: function (e) {
    var numDetail = this.data.num[e.detail.value];
    this.setData({
      numIndex: e.detail.value,
      numDetail: numDetail,
    })
  },
  // 活动种类
  bindTypeChange: function (e) {
    var typeDetail = this.data.actType[e.detail.value];
    console.log(typeDetail);
    this.setData({
      typeIndex: e.detail.value,
      typeDetail: typeDetail,
    })
  },
  // 开始日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 开始时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  //选择地址
  goMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          location: res.address,
          lat: res.latitude,
          lng: res.longitude
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      location: e.detail.value
    })
  },
  // 确认发布按钮
  formSubmit: function (e) {
    var that = this;
    console.log(e);
    actName = e.detail.value.name;
    phoneNum = e.detail.value.phone;
    vcode = e.detail.value.vcode;
    that.num(this.data.numDetail, this.data.typeDetail.id, e.detail.value.name, this.data.date, this.data.time, this.data.location, this.data.lat, e.detail.value.phone);
  },
  num: function (a, b, c, d, e, f, g, h) {
    var that = this;
    if (a != '') {
      that.type(a, b, c, d, e, f, g, h);
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写活动人数',
        showCancel: false,
      })
    }
  },
  type: function (a, b, c, d, e, f, g, h) {
    var that = this;
    if (b != '') {
      that.name(a, b, c, d, e, f, g, h);
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写活动种类',
        showCancel: false,
      })
    }
  },
  name: function (a, b, c, d, e, f, g, h) {
    var that = this;
    if (c != '') {
      that.date(a, b, c, d, e, f, g, h);
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写活动名称',
        showCancel: false,
      })
    }
  },
  date: function (a, b, c, d, e, f, g, h) {
    var that = this;
    if (d != '选择日期') {
      that.time(a, b, c, d, e, f, g, h);
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写活动日期',
        showCancel: false,
      })
    }
  },
  time: function (a, b, c, d, e, f, g, h) {
    var that = this;
    if (e != '选择时间') {
      that.location(a, b, c, d, e, f, g, h);
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写活动时间',
        showCancel: false,
      })
    }
  },
  location: function (a, b, c, d, e, f, g, h) {
    var that = this;
    if (f != '') {
      that.lat(a, b, c, d, e, f, g, h);
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写地点',
        showCancel: false,
      })
    }
  },
  lat: function (a, b, c, d, e, f, g, h) {
    var that = this;
    if (g != '') {
      that.phone(a, b, c, d, e, f, g, h);
    } else {
      wx.showModal({
        title: '提示',
        content: '请从地图选择活动地点',
        showCancel: false,
      })
    }
  },
  phone: function (a, b, c, d, e, f, g, h) {
    var that = this;
    var phone = /0?(13|14|15|17|18)[0-9]{9}/;
    if (phone.test(h) == true) {
      that.upload();
    } else {
      wx.showModal({
        title: '提示',
        content: '请先绑定手机号',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../setting/mySetting?id=' + uid
            })
          }
        }
      })
    }
  },
  upload: function () {
    if (this.data.imageList[0] == '') {
      wx.request({
        url: 'https://oho.oxygenhoop.com/index.php/Home/Index/add_active',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          'session_id': app.globalData.session_id,
          'location': this.data.location,
          'lat': this.data.lat,
          'lng': this.data.lng,
          'time': this.data.time,
          'date': this.data.date,
          'type': this.data.typeDetail.id,
          'num': this.data.numDetail,
          'name': actName,
          'phone': phoneNum,
          'vcode': vcode
        },
        success: function (res) {
          console.log(res);
          if (res.data.status == "error") {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function (res) {
              }
            })
          } else {
            wx.navigateTo({
              url: '../pay/pay?id=' + res.data.active_id,
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    } else {
      wx.uploadFile({
        url: 'https://oho.oxygenhoop.com/index.php/Home/Index/add_active',
        filePath: this.data.imageList[0],
        name: 'file',
        formData: {
          'session_id': app.globalData.session_id,
          'location': this.data.location,
          'lat': this.data.lat,
          'lng': this.data.lng,
          'time': this.data.time,
          'date': this.data.date,
          'type': this.data.typeDetail.id,
          'num': this.data.numDetail,
          'name': actName,
          'phone': phoneNum,
          'vcode': vcode
        },
        success: function (res) {
          console.log(res);
          var data = JSON.parse(res.data);
          if (data.status == "error") {
            wx.showModal({
              title: '提示',
              content: data.msg,
              showCancel: false,
              success: function (res) {
              }
            })
          } else {
            wx.navigateTo({
              url: '../pay/pay?id=' + data.active_id,
            })
          }

        },
        fail: function (res) {
          console.log(res);
        }
      })
    }

  }
})

