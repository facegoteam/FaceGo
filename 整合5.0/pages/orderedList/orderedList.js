const sliderWidth = 96
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,//有无订单标志
    goodsList:null,



    goodsPrice:1024,
    goodsName:'电动打蛋机',
    goodsStatus:'未提货',
    
    tabs: ['全部', '待提货', '待评价'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    msg1: {
      title: '空空如也',
      text: '暂时没有相关数据',
    },
    msg2: {
      icon: '/images/iconfont-order.png',
      title: '您还没有相关的订单',
      text: '可以去看看有哪些想买',
      buttons: [{
        text: '随便逛逛',
      }],
    },
    msg3: {
      icon: '/images/iconfont-empty.png',
      title: '暂无待评价订单',
    },
    actions: [{
      type: 'default',
      text: '微信支付',
    }, {
      text: '现金支付',
      type: 'primary',
    }],
  },
  click1(){
    console.log("click1");
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
  }
,

  onAction(e) {
    console.log('onAction', e.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    this.getSystemInfo(),
    



    //标准数据库连接读取函数
    //获取推荐商品    
    wx.request({
      url: 'http://' + app.globalData.ip + ':8001/hot_items',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        // 'face_token': '29f2e2a4a2c61f8c5f2abec835b96e4b',
        // 'identity': 'wx'
      },
     
      success(res) {
      
        console.log(res.data);
        //把数据读到listData里面
         that.setData({
           goodsList: res.data,
         })
      },
      fail: function (e) {
        console.log("失败")
      },
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getSystemInfo() {
    const that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
        })
      }
    })
  },
  tabClick(e) {
    const { offsetLeft, dataset } = e.currentTarget
    const { id } = dataset

    this.setData({
      sliderOffset: offsetLeft,
      activeIndex: id,
    })
  },
  buttonClicked(e) {
    // wx.navigateToMiniProgram({
    //   appId: 'wx7c8d593b2c3a7703', // 要跳转的小程序的appid
    //   path: 'page/index/index', // 跳转的目标页面
    //   extarData: {
    //     open: 'auth'
    //   },
    //   success(res) {
    //     // 打开成功  
    //   }
    // }) 
    console.log(e);
    wx.switchTab({
      url: '../start/start',
    })
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
    
  }
})
