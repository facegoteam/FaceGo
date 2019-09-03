// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 方法名/类名：aboutUs（）
  // 创建时间：8/21
  // 作者：李若涵
  // 简要说明：关于我们
  aboutUs: function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统由东南大学软件学院facego团队搭建，祝大家使用愉快！（ https://github.com/facegoteam/FaceGo ）',
      showCancel: false
    })
  },

  // 方法名/类名：loginOut（）
  // 创建时间：8/21
  // 作者：李若涵
  // 简要说明：退出登录
  loginOut: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  }








})