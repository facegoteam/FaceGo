// pages/start/start.js

var util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    pageNum: 1, // 设置加载的第几次，默认是第一次
    isFirstLoad: true, // 用于判断List数组是不是空数组，默认true，空的数组
    hasMore: false, // “加载更多”
    slider: [], //轮播图
    swiperCurrent: 0, //轮播图
    click: true,
    ip:app.globalData.ip,

    // 方法名/类名：goodsHotItems
    // 创建时间：8/25
    // 作者：黄少豪
    // 简要说明：实施热销榜数据来源
    goodsHotItems: null,
   
    // 方法名/goodsWelfareItems
    // 创建时间：8/25
    // 作者：黄少豪
    // 简要说明：福利
    goodsRecommendItems:null

  },

  // 下拉刷新
  onPullDownRefresh: function() {
    // 显示导航栏loading
    wx.showNavigationBarLoading();
    // 调用接口加载数据
    // console.log('刷新ing111111');
    this.onLoad();
    setTimeout(function () {
      // 隐藏导航栏loading
      wx.hideNavigationBarLoading();
      // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新
      wx.stopPullDownRefresh();
      //要延时执行的代码
    }, 1000)
    
  },
  //上拉加载
  onReachBottom(e) {
    wx.showLoading({
      title: '',
    })
    console.log('加载更多');
    this.onLoad();
    setTimeout(() => {
      wx.hideLoading()
    }, 500)
  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    // getList(this);
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    // getList(this);
  },
  inputTyping: function(e) {
    //搜索数据
    // getList(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },

  search: function (e) {
    //搜索数据
    // getList(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });

    var that = this;
    setTimeout(function () {
      // console.log(e.currentTarget.dataset.type)
      wx.navigateTo({
        url: '/pages/search/search?id=' + e.detail.value,
      })
    }, 50)
    // search请求函数
    // wx.request({
    //   url: 'http://10.203.169.252:8001/customer_search_for_good',//接口
    //   method: 'post',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //   },
    //   data: {
    //     'word': that.data.inputVal
    //   },
    //   success(res) {
    //     console.log(res.data);
    //     //把数据读到listData里面
    //     // that.setData({
    //     //   goodsRecommendItems: res.data,
    //     // })
    //   },
    //   fail: function (e) {
    //     console.log("失败")
    //   },
    // })
  },


  // 方法名/类名：change
  // 创建时间：8/24
  // 作者：黄少豪
  // 简要说明：点击图片进入详情

  catchTapCategory: function(e) {
    var click = this.data.click;
    this.setData({
      click: false
    })
    setTimeout(function() {
      console.log(e.currentTarget.dataset.type)
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + e.currentTarget.dataset.type,
      })
    }, 50)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    /*轮播图 */
    var that = this;
    //网络访问，获取轮播图的图片
    
    util.getRecommend(function(data) {

      console.log(data);
      console.log(data.data.slider);
      that.setData({
        // slider: data.data.slider
        slider:[
           {
            linkUrl:"",
            picUrl: 'http://' + app.globalData.ip + ':8001/static/img/AD/FaceGo1.jpg'
           },
           {
             linkUrl: "",
             picUrl: 'http://' + app.globalData.ip + ':8001/static/img/AD/FaceGo3.jpg'
           },
           {
             linkUrl: "",
             picUrl: 'http://' + app.globalData.ip + ':8001/static/img/AD/FaceGo2.jpg'
           },
           {
             linkUrl: "",
             picUrl: 'http://' + app.globalData.ip + ':8001/static/img/AD/FaceGo4.jpg'
           }
        ]
      })
    });


    //标准数据库连接读取函数
    //获取热销榜    
    wx.request({
      url: 'http://' + app.globalData.ip+':8001/hot_items',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        console.log(res.data);
        //把数据读到listData里面
        that.setData({
          goodsHotItems: res.data,
     
        })
      },
      fail: function (e) {
        console.log("失败")
      },
    })


    //标准数据库连接读取函数
    //获取推荐商品    
    wx.request({
      url: 'http://' + app.globalData.ip + ':8001/customer_ask_for_recommend_wx',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'face_token': app.globalData.userInfo,
        // 'identity': 'wx'
      },
      success(res) {
        console.log(res.data);
        //把数据读到listData里面
        that.setData({
          goodsRecommendItems: res.data,
        })
      },
      fail: function (e) {
        console.log("失败")
      },
    })


  },


  // 方法名/类名：swiperChange
  // 创建时间：8/24
  // 作者：黄少豪
  // 简要说明：轮播图切换事件
  swiperChange: function(e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent: function(e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },


})