// pages/orderedList/orderedList.js
const app = getApp()
Page({
  data: {
    listData: [
      { "name": "天平", "address": "桃园", "phone": "4001234567"},
      { "name": "中超", "address": "梅园", "phone": "4007654321" }
    ]
  },

  onLoad: function () {
    // 方法名/类名：wx.request（）
    // 创建时间：8/21
    // 作者：李若涵
    // 简要说明：请求获取商店列表
    wx.request({
      url: '服务器接口',//接口
      method: 'post',
      data: {
        'query': 'ordered list',//请填写你创建的 apikey
        'id': app.globalData.userInfo,//请填写你的api_secret
      },
      header: {
        'content-type': 'json',
      },
      success(res) {

        //把数据读到listData里面
        console.log(res.data)
      },
      fail: function (e) {
        console.log("失败")
      },
    })

  }
})