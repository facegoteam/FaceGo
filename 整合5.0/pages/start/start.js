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
    goodsRecommendItems: [{
        goodId: 0,
        name: '泊尔崖蜜蜜光面膜（5片盒装）',
        url: 'bill',
        imageurl: 'https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg',
        newprice: "86",
        oldprice: "88",
      },
      {
        goodId: 1,
        name: '透无瑕矿物养护两用粉饼#03',
        url: 'bill',
        imageurl: 'https://a4.vimage1.com/upload/merchandise/pdcvis/2017/08/21/27/4b24e2a629644877866d3da755f6a36e-5_218x274_70.jpg',
        newprice: "147.00",
        oldprice: "150.00",
      },
      {
        goodId: 2,
        name: '川水水光面膜（5片盒装）',
        url: 'bill',
        imageurl: 'https://a2.vimage1.com/upload/merchandise/pdcvis/2017/08/21/86/7891361fdab348a1bc91aeca31fc77b1-5_218x274_70.jpg',
        newprice: "86.00",
        oldprice: "88.00",
      },
      {
        goodId: 3,
        name: '蜜三色渐变咬唇膏3.2g 03蜜橙动心恋',
        url: 'bill',
        imageurl: 'http://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/176/c3b9453a4d7f46c6a8fe78705f77352b-5_218x274_70.jpg',
        newprice: "97.00",
        oldprice: "99.00",
      },
      {
        goodId: 4,
        name: '时焕颜亮采套装',
        url: 'bill',
        imageurl: 'https://a2.vimage1.com/upload/merchandise/pdcvis/2017/08/21/93/69a6bc1c11eb4be184b7dffb43b8565b-5_218x274_70.jpg',
        newprice: "398.00",
        oldprice: "459.00",
      }, {
        goodId: 5,
        name: '雪域眼霜套装',
        url: 'bill',
        imageurl: 'https://a4.vimage1.com/upload/merchandise/pdcvis/2017/08/23/127/53409c86f74647af915bc379427b97c2-5_218x274_70.jpg',
        newprice: "238.00",
        oldprice: "358.00",
      }, {
        goodId: 6,
        name: '凝时鲜颜冰肌水套装',
        url: 'bill',
        imageurl: 'https://a2.vimage1.com/upload/merchandise/pdcvis/2017/11/13/95/fb6c3d0c1f304b449dadb1f0100c1205-5_218x274_70.jpg',
        newprice: "248.00",
        oldprice: "348.00",
      }, {
        goodId: 7,
        name: '雪润皙白精选三件套',
        url: 'bill',
        imageurl: 'https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/30/184/a5000156098940b5a05a0e696535ac20-5_218x274_70.jpg',
        newprice: "348.00",
        oldprice: "396.00",
      }
    ]

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
  // 上拉加载
  // onReachBottom(e) {
  //   console.log('加载更多');
  //   setTimeout(() => {
  //     this.setData({
  //       isHideLoadMore: true,
  //     })
  //   }, 500)
  // },

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
      that.setData({
        slider: data.data.slider
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
      url: 'http://' + app.globalData.ip +':8001/hot_items',//接口
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


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function() {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function() {

  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})