var id, pic = 0, logo = 0, phone, phonePass = false, code = '',userId;
var app = getApp();
Page({
  data: {
    dis: false,
    xiugai: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    userId = options.id;
    this.get_user_list(userId);

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
  // 出生日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  radioChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      sex1: e.detail.value
    })
  },
  // 选择形象照片
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: 'compressed',
      success: function (res) {
        console.log(res);
        pic = 1;
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  // 选择头像
  chooseLogo: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({
          logo: res.tempFilePaths[0]
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
  // 点击保存
  formSubmit: function (e) {
    this.showToast();
    console.log(e);
    var that = this;
    that.setData({
      dis: true
    })

    wx.uploadFile({
      url: 'https://oho.oxygenhoop.com/index.php/Home/Index/edit_user',
      filePath: that.data.logo,
      name: 'myfile',
      formData: {
        'id': id,
        'birth': that.data.date,
        'sex': that.data.sex1,
        'name': e.detail.value.name,
        'lianxi': e.detail.value.phone
      },
      success: function (res) {
        // var data = res.data
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    })
    if (pic != 0) {
      for (let i = 0; i < this.data.imageList.length; i++) {
        console.log(this.data.imageList[i])
        wx.uploadFile({
          url: 'https://oho.oxygenhoop.com/index.php/Home/Index/deal_many_pic',
          filePath: this.data.imageList[i],
          name: 'file',
          formData: {
            'id': id
          },
          success: function (res) {
            // var data = res.data
            console.log(res);
          },
          fail: function (res) {
            console.log(res);
          }
        })
      };
    }


    // wx.redirectTo({
    //   url: '../my/my',
    //   success: function () {
    //     console.log('success');
    //   },
    //   fail: function () {
    //     console.log('fail');
    //   }
    // })
  },
  // 删除未上传图片
  delPic: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.data.imageList.splice(index, 1);
    that.setData({
      imageList: that.data.imageList
    });
  },
  // 删除已上传照片
  del: function (e) {
    console.log(e.currentTarget.dataset.index);
    var that = this;
    wx.showModal({
      title: '删除图片',
      content: '确定删除该图片？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://oho.oxygenhoop.com/index.php/Home/Index/delete_pic',
            data: {
              'tp': e.currentTarget.dataset.id,
              'id': id
            },
            method: 'POST',
            success: function (res) {
              var index = e.currentTarget.dataset.index;
              that.data.piclist.splice(index, 1);
              that.setData({
                piclist: that.data.piclist
              });
              console.log(res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showToast: function () {
    wx.showToast({
      title: '保存中',
      icon: 'loading',
      duration: 5000,
      success: function () {
        console.log('success');
      },
      fail: function () {
        console.log('fail');
      }
    })
  },
  newPhone: function (e) {
    console.log(e.detail.value);
    phone = e.detail.value;
    var phone1 = /^1[34578]\d{9}$/;
    if (phone1.test(e.detail.value)) {
      phonePass = true;
    } else {
      phonePass = false;
    }
  },
  xiugai: function () {
    this.setData({
      xiugai:true
    })
  },
  getCode: function () {
    console.log(phone);
    if (phonePass) {
      wx.request({
        url: 'https://oho.oxygenhoop.com/index.php/Index/dx',
        method: 'POST',
        data: {
          'session_id': app.globalData.session_id,
          'phone': phone
        },
        success: function (res) {
          console.log(res);
          if (res.data.status == "error"){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
            })
          }else{
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 500,
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
      })
    }
  },
  code: function (e) {
    code = e.detail.value;
  },
  check_code: function () {
    var that = this;
    if (code != '') {
      wx.request({
        url: 'https://oho.oxygenhoop.com/index.php/Index/check_code',
        method: 'POST',
        data: {
          'session_id': app.globalData.session_id,
          'phone': phone,
          'code': code,
        },
        success: function (res) {
          console.log(res);
          if (res.data.status == "error"){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
            })
          }else{
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000,
              success: function(){
                that.get_user_list(userId);
                that.setData({
                  xiugai: false
                })
              }
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false,
      })
    }
  },
  cancel: function(){
    this.setData({
      xiugai: false
    })
  },
  get_user_list: function(id1){
    var that = this;
    wx.request({
      url: 'https://oho.oxygenhoop.com/index.php/Index/get_user_list/id/' + id1,
      success: function (res) {
        console.log(res);
        id = res.data.data.id;
        that.setData({
          list: res.data.data,
          date: res.data.data.birth,
          logo: res.data.data.logo,
          sex1: res.data.data.sex,
          piclist: res.data.data.pic_list,
        })
        if (res.data.data.sex == '1') {
          that.setData({
            sex: [
              { name: '男', value: '1', checked: 'true' },
              { name: '女', value: '2' },
            ]
          })
        } else if (res.data.data.sex == '2') {
          that.setData({
            sex: [
              { name: '男', value: '1', },
              { name: '女', value: '2', checked: 'true' },
            ]
          })
        } else {
          that.setData({
            sex: [
              { name: '男', value: '1', },
              { name: '女', value: '2' },
            ]
          })
        }
        wx.downloadFile({
          url: that.data.logo, //仅为示例，并非真实的资源
          success: function (res) {
            console.log(res);
            that.setData({
              logo: res.tempFilePath
            })
          }
        })
      }
    })
  }
})