const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    iconList: [{
      icon: 'game',
      color: 'red',
      badge: 0,
      name: 'GAME',
      id:1
    }, {
      icon: 'game',
      color: 'orange',
      badge: 1,
        name: 'GAME',
      id:2
    }, {
      icon: 'game',
      color: 'yellow',
      badge: 0,
        name: 'GAME',
      id:3
    }, {
      icon: 'game',
      color: 'olive',
      badge: 1,
        name: 'GAME',
      id:4
    }, {
      icon: 'game',
      color: 'cyan',
      badge: 0,
        name: 'GAME',
      id:5
    }, {
      icon: 'game',
      color: 'blue',
      badge: 0,
        name: 'GAME',
      id:6
    }, {
      icon: 'discoverfill',
      color: 'purple',
      badge: 0,
      name: '发现',
      
    }, {
      icon: 'questionfill',
      color: 'mauve',
      badge: 0,
      name: '帮助'
    }, {
      icon: 'commandfill',
      color: 'purple',
      badge: 0,
      name: '问答'
    }, {
      icon: 'brandfill',
      color: 'mauve',
      badge: 0,
      name: '版权'
    }],
    gridCol: 3,
    skin: false
  },


// 方法名/类名：gmae
// 创建时间：9-6
// 作者：黄少豪
// 简要说明：跳转到外部游戏小程序
  game(e)
{
  console.log(e)
  console.log("nishizhu")
  if(e.currentTarget.dataset.id==1)
  {
    wx.navigateToMiniProgram({
      appId: 'wx7c8d593b2c3a7703', // 要跳转的小程序的appid
      path: 'page/index/index', // 跳转的目标页面
      extarData: {
        open: 'auth'
      },
      success(res) {
        // 打开成功  
      }
    })
  };
    if (e.currentTarget.dataset.id == 2) {
      wx.navigateToMiniProgram({
        appId: 'wxd0e404d795ea6f80', // 要跳转的小程序的appid
        path: 'page/index/index', // 跳转的目标页面
        extarData: {
          open: 'auth'
        },
        success(res) {
          // 打开成功  
        }
      })
    };
    if (e.currentTarget.dataset.id == 3) {
      wx.navigateToMiniProgram({
        appId: 'wxbe77d50ac82c441d', // 要跳转的小程序的appid
        path: 'page/index/index', // 跳转的目标页面
        extarData: {
          open: 'auth'
        },
        success(res) {
          // 打开成功  
        }
      })
    };
    if (e.currentTarget.dataset.id == 4) {
      wx.navigateToMiniProgram({
        appId: 'wxf872ea5294e051c0', // 要跳转的小程序的appid
        path: 'page/index/index', // 跳转的目标页面
        extarData: {
          open: 'auth'
        },
        success(res) {
          // 打开成功  
        }
      })
    };
    if (e.currentTarget.dataset.id == 5) {
      wx.navigateToMiniProgram({
        appId: 'wxbf60ee20e71490a2', // 要跳转的小程序的appid
        path: 'page/index/index', // 跳转的目标页面
        extarData: {
          open: 'auth'
        },
        success(res) {
          // 打开成功  
        }
      })
    };
    if (e.currentTarget.dataset.id == 6) {
      wx.navigateToMiniProgram({
        appId: 'wxd88a985aaf017da5', // 要跳转的小程序的appid
        path: 'page/index/index', // 跳转的目标页面
        extarData: {
          open: 'auth'
        },
        success(res) {
          // 打开成功  
        }
      })
    };
},
  // 方法名/类名：aboutUs（）
  // 创建时间：8/21
  // 作者：李若涵
  // 简要说明：关于我们
  aboutUs: function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统由东南大学软件学院facego团队搭建，祝大家使用愉快！（ https://github.com/facegoteam/FaceGo ）',
      showCancel: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
})