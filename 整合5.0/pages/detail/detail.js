import Toast from '../../dist/toast/toast';
import Dialog from '../../dist/dialog/dialog';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: app.globalData.ip,
    flag:true,
    listData: [],
    name : null,
    value : 1,
    // banner
    imgUrls: null,
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s

    //picker[index]选择的提货地点
    index: null,
    picker: null,
  },

  PickerChange(e) {
    console.log(e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },


  onClickIcon1() {
    console.log("客服");
  },
  onClickIcon2() {
    wx.switchTab({
      url: '../shopCar/shopCar',
    })
  },
  //加入购物车
  showModal(e) {
    console.log(e),
      console.log(e.currentTarget.dataset.target),
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  onClickButton2(e) {
    console.log(e),
      console.log(e.currentTarget.dataset.target),
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
  },
  //监听数字框的变化
  onChange(e){
    console.log(e.detail.value),
    this.setData({
      value: e.detail.value
    })
    
  },
  confirm(e){
    //成功 模态框
    var that = this;
    //标准数据库连接读取函数
    //请求添加数据库购物车 
  
    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_add_cart',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        'face_token': '0ae83ffd1cabed5275dc437ab851f91d',
        //app.globalData.userInfo,
        'name': this.data.name,
        'count': this.data.value
      },
      success(res) {
        console.log(res.data);
        if(res.data=='购物车添加成功')
        {
          wx.showToast({
            title: res.data,
            icon: 'success',
            duration: 1000,
            mask: true,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
                console.log(e),
                  that.setData({
                    modalName: null
                  })
              }, 1000) //延迟时间
            },
          });
        }
      },
      fail: function (e) {
        console.log("失败")
      },
    })
    
    // wx.showToast({
    //   title: '我成功了！',
    //   icon: 'success',
    //   duration: 1000,
    //   mask: true,
    //   success: function () {
    //     setTimeout(function () {
    //       //要延时执行的代码
    //    console.log(e),
    //    that.setData({
    //      modalName: null
    //    })
    //     }, 1000) //延迟时间
    //   },
    // });

     
     
  },

  confirm2(e) {
    var that = this;
    var send = [
      { 'face_token': '0ae83ffd1cabed5275dc437ab851f91d', 
        'shop': that.data.picker[that.data.index]
      },
      { 'name': that.data.name, 
        'count': that.data.value
      }
    ];
    
    console.log(send)
    //标准数据库连接读取函数
    wx.request({
      url: 'http://' + app.globalData.ip + ':8001/customer_add_order_from_detail',//接口
      method: 'post',
      header: {
        'content-type': 'application/json',
      },
      data: send,
      success(res) {
        console.log(res.data);
        that.setData({
          modalName: null
        });
        Dialog.alert({
          message: '下单成功！请凭订单号' + res.data + '前往' + that.data.picker[that.data.index] + '领取您的商品',
        }).then(() => {
          // on close
        });
      },
      fail: function (e) {
        console.log("失败")
      },
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ name: options.id });
    var that = this;

    //获取门店名称
    wx.request({
      url: 'http://' + app.globalData.ip + ':8001/customer_ask_for_shop',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
      },
      success(res) {
        //把数据读到listData里面
        for (var i = 0; i < res.data.length; i++) {
          var temp = "picker[" + i + "]";
          that.setData({
            [temp]: res.data[i]['name'],
          })
        }
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
    var that = this;
    // var temp = "http://' + app.globalData.ip +':8001/customer_ask_for_goods_info/" + that.data.name;
    //向服务器发送请求
    wx.request({
      url: 'http://' + app.globalData.ip + ':8001/customer_ask_for_goods_info',//接口请求商品页面详情
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'good_name':that.data.name,
        'face_token': '0ae83ffd1cabed5275dc437ab851f91d',
        //app.globalData.userInfo,
      },
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