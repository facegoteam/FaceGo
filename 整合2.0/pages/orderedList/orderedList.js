// pages/orderedList/orderedList.js
const app = getApp()
Page({
  data: {
    listData: [
      { "name": "薯片", "number": "1", "price": "9.9", "date": "8.22" },
      { "name": "悠哈奶糖", "number": "2", "price": "5.5", "date": "8.23" }
    ]
  },

  onLoad: function () {

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