//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },

  onLoad: function () {

  },
  // 方法名/类名：login（）
  // 创建时间：8/20
  // 作者：李若涵
  // 简要说明：登陆功能实现

  login: function () {
    var that = this
    const ctx = wx.createCameraContext(); //创建相机上下文
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath //相机拍照得到照片的地址 将此照片传送给服务器
        })
        //输出的照片地址
        console.log(res.tempImagePath)
        wx.showToast({
          icon: "loading",
          title: "正在上传中。。。"
        });
        wx.uploadFile({
          //上传照片和脸集中的照片对比并得出结果
          url: 'https://facego.chinaeast.cloudapp.chinacloudapi.cn/face_upload', //对比人脸接口
          filePath: that.data.src,//上传相机拍照得到照片的地址
          name: 'file_obj',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
          },
          success: function (res) {
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
              return;
            }
            console.log(res.data)
            var obj = JSON.parse(res.data);//转成json对象
            console.log(obj)
            if (obj['faces'][0] == null || obj['faces'][0] == '') {//判断是否检测到人脸
              wx.showModal({
                title: '提示',
                content: '未检测到人脸',
                showCancel: false
              })
              return;
            } else {
              that.setData({
                confidence: obj['results'][0]['confidence'] //可信值
              });
              console.log(obj['results'][0]['confidence']);
              console.log(obj['results'][0]['face_token']);
              var app = getApp();
              app.globalData.userInfo = obj['results'][0]['face_token'];
              console.log("globaldata " + app.globalData.userInfo);

              if (that.data.confidence >= 80) { //可信值大于80就认为是同一个人
                wx.showModal({
                  title: '提示',
                  content: '验证通过',
                  showCancel: false,
                  success: function (res) {
                    if (res.cancel) {
                      //点击取消,默认隐藏弹框
                    } else {
                      //点击确定
                      //进入下一个界面
                      wx.switchTab({
                        url: '../start/start'
                      })
                    }
                  },
                })
                return;
              } else {
                //验证失败 是否重新识别
                wx.showModal({
                  title: '提示',
                  content: '未找到相关信息，您是新用户吗？',
                  cancelText: "重新识别",
                  confirmText: "帮我注册",
                  success: function (res) {
                    if (res.cancel) {
                      //点击取消,默认隐藏弹框
                    } else {
                      //点击确定
                      //进入下一个界面
                      wx.uploadFile({
                        //上传照片和脸集中的照片对比并得出结果
                        url: 'https://facego.chinaeast.cloudapp.chinacloudapi.cn/register', //对比人脸接口

                        filePath: that.data.src,//上传相机拍照得到照片的地址
                        name: 'file_obj',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },

                        data: {

                        },
                        success: function (res) {

                          var app = getApp();
                          app.globalData.userInfo = res.data;
                          console.log(app.globalData.userInfo);

                        },
                        fail: function (e) {
                          console.log(e);
                          wx.showModal({
                            title: '提示',
                            content: '上传失败',
                            showCancel: false
                          })
                        },
                        complete: function () {
                          wx.hideToast(); //隐藏Toast
                        }
                      })

                      wx.switchTab({
                        url: '../start/start'
                      })

                    }
                  },
                })
                return;
              }
            }
          },
          fail: function (e) {
            console.log(e);
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
          },
          complete: function () {
            wx.hideToast(); //隐藏Toast
          }
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }
})