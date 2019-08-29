Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    name : '小说绘',
    // banner
    imgUrls: null,
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
  },

  onClickIcon() {
    Toast('点击图标');
  },

  onClickButton() {
    Toast('点击按钮');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ name: options.id });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var temp = "http://10.203.220.224:8001/customer_ask_for_goods_info/" + that.data.name;
    //向服务器发送请求
    wx.request({
      url: temp,//接口请求商品页面详情
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      // data: {
      //   'identity': 'wx'
      // },
      success(res) {
        console.log(res.data);
        //把数据读到listData里面
        that.setData({
          listData: res.data,
          imgUrls:res.data.img,
          price:res.data.price,
          information:res.data.info,
          stock:res.data.stock,
          sales:res.data.sales
        })
        console.log(that.data.imgUrls)
      },
      fail: function (e) {
        console.log("失败")
      },
    })
    
  }
})