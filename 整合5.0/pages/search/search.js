// pages/search/search.js
const app = getApp()
//ip:app.globalData.ip,
//' + app.globalData.ip +'
//{{ip}}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: app.globalData.ip,
    inputVal:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({ inputVal: options.id });
    var that = this;
    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_search_for_good',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'word': that.data.inputVal
      },
      success(res) {
        console.log(res.data);
        //把数据读到listData里面
        that.setData({
          listData: res.data,
        })
        if (that.data.listData[0] != null) {
          that.setData({
            iscart: true
          })
        }
      },
      fail: function (e) {
        console.log("失败")
      },
    })

  },

  catchTap: function (e) {
    var click = this.data.click;
    
    setTimeout(function () {
      console.log(e.currentTarget.dataset.type)
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + e.currentTarget.dataset.type,
      })
    }, 50)
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

  }
})