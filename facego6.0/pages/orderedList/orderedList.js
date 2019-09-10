const sliderWidth = 96
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: app.globalData.ip,
    flag: true,//有无订单标志
    flag1:true,//评价模态弹窗
    goodsList:null,
    value: 2.5,
    modalName:null,
    allowTouchMove:true,

    goodsPrice:50,
    goodsNum:20,
    goodsName:'电动打蛋机',
    goodsStatus:'待提货',
    
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

    actions1: [{
      type: 'default',
      text: '售后服务',
      name:'SH'
    }, {
      text: '评价',
      type: 'primary',
      name: 'PJ'
    }],

    items: [{
      id: '001',
      text: 'Face',
      value: 1,
    },
    {
      id: '002',
      text: 'Eye',
      value: 2,
    },
    ],
    slider: 2.5,
  },

  confirm(e){
    console.log(e);
    this.setData({
      modalName: null
    });
    console.log(this.data.currentTargetName)
    console.log(this.data.value)

    var that = this;
    wx.request({
      url: 'http://' + app.globalData.ip + ':8001/customer_set_goods_rate',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'name': this.data.currentTargetName,
        'value': this.data.value,
        'token': this.data.currentToken
      },
      success(res) {
        console.log(res.data);
        that.onLoad()
        //把数据读到listData里面
        
      },
      fail: function (e) {
        console.log("失败")
      },
    });
    this.onLoad()







  },
  hideModal(e){
    this.setData({
      modalName:null
    })

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
  },

  onChange(event) {
    console.log(event.detail.value)
    this.setData({
      value: event.detail.value
    });
  },

onAction1(e){
  console.log(e);
  console.log('onAction1', e.detail);
  console.log(e.detail.index);
  if (e.detail.index==1)
  {
   this.setData({
     modalName:'bottomModal',
     currentTargetName: e.currentTarget.id,
     currentToken: e.currentTarget.dataset.token
   })
  }
  if (e.detail.index == 0)
  {
    wx.showToast({
      title: '请拨打客服电话123456或在app中联系客服',
      icon: 'none',
      duration: 3000
    })
  }
},

  onAction(e) {

    this.setData({
      modalName: 'bottomModal'
    })
    console.log('onAction', e.detail);
    
      console.log(e.detail.index);
    

    // wx.requestPayment(
    //   {
    //     'timeStamp': '',
    //     'nonceStr': '',
    //     'package': '',
    //     'signType': 'MD5',
    //     'paySign': '',
    //     'success': function (res) { },
    //     'fail': function (res) { },
    //     'complete': function (res) { }
    //   })
  },
  sliderChange(e) {
    this.setData({
      slider: e.detail.value,
    })
  },
  bindchange(e) {
    console.log(e)
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
      url: 'http://' + app.globalData.ip + ':8001/customer_ask_for_record',//接口
      // url: 'http://' + app.globalData.ip + ':8001/hot_items',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'face_token': app.globalData.userInfo,
        'identity': 'wx'
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
    });
    
    wx.request({
      url: 'http://' + app.globalData.ip + ':8001/customer_ask_for_order',//接口
      // url: 'http://' + app.globalData.ip + ':8001/hot_items',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'face_token': app.globalData.userInfo,
      },

      success(res) {
        console.log(res.data);
        //把数据读到listData里面
        that.setData({
          goodsListTihuo: res.data,
        })
      },
      fail: function (e) {
        console.log("失败")
      },
    });

    wx.request({
      url: 'http://' + app.globalData.ip + ':8001/customer_ask_for_order_not_rated',//接口
      // url: 'http://' + app.globalData.ip + ':8001/hot_items',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'face_token': app.globalData.userInfo,
      },

      success(res) {
        console.log(res.data);
        //把数据读到listData里面
        that.setData({
          goodsListPingjia: res.data,
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
