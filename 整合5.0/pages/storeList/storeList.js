// pages/orderedList/orderedList.js
const app = getApp()

Page({
  data: {
    ip: app.globalData.ip,
    listData: []
  },

  onLoad: function () {
    // 方法名/类名：wx.request（）
    // 创建时间：8/21
    // 作者：李若涵
    // 简要说明：请求获取商店列表
    var that = this;
    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_ask_for_shop',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        console.log(res.data);
        //把数据读到listData里面
        that.setData({
          listData:res.data
        })
      },
      fail: function (e) {
        console.log("失败")
      },
    })
  }
})