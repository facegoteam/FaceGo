//app.js
//标准数据库连接读取函数
// wx.request({
//   url: 'http://10.203.202.167:8001/customer_ask_for_shop',//接口
//   method: 'post',
//   header: {
//     'content-type': 'application/x-www-form-urlencoded',
//   },
//   success(res) {
//     console.log(res.data);
//     //把数据读到listData里面
//     that.setData({
//       listData: res.data
//     })
//   },
//   fail: function (e) {
//     console.log("失败")
//   },
// })

//const app = getApp()
//ip:app.globalData.ip,
//' + app.globalData.ip +'
//{{ip}}

App({
  onLaunch: function () {
  
 
  },
  globalData: {
    userInfo: '0ae83ffd1cabed5275dc437ab851f91d',
    ip: '10.203.153.204'
  }
})