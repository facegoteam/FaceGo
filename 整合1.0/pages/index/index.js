//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },

  onLoad: function () {

    // //基本的一些用法 初次使用的时候需要
    // //删除faceset
    // wx.request({
    //   url: 'https://api-cn.faceplusplus.com/facepp/v3/faceset/delete',//接口
    //   method: 'post',
    //   data: {
    //     'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',//请填写你创建的 apikey
    //     'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',//请填写你的api_secret
    //     'outer_id': 'facegofaceset', //脸集唯一标识，就是上面我们创建的脸集
    //     'check_empty': '0',

    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //   },
    //   success(res) {
    //     console.log(res.data)
    //   },
    //   fail: function (e) {
    //     console.log("失败")
    //   },
    // })

    // //创建faceset
    // wx.request({
    //   url: 'https://api-cn.faceplusplus.com/facepp/v3/faceset/create',//接口
    //   method: 'post',
    //   data: {
    //     'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',//请填写你创建的 apikey
    //     'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',//请填写你的api_secret
    //     'outer_id': 'facegofaceset', //脸集唯一标识，就是上面我们创建的脸集
    //     'display_name': 'displayfacego',
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //   },
    //   success(res) {
    //     console.log(res.data)
    //   },
    //   fail: function (e) {
    //     console.log("失败")
    //   },
    // })

    // //查看detail
    // wx.request({
    //   url: 'https://api-cn.faceplusplus.com/facepp/v3/faceset/getdetail',//接口
    //   method: 'post',
    //   data: {
    //     'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',//请填写你创建的 apikey
    //     'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',//请填写你的api_secret
    //     'outer_id': 'facegofaceset', //脸集唯一标识，就是上面我们创建的脸集
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //   },
    //   success(res) {
    //     console.log(res.data['face_count'])
    //   },
    //   fail: function (e) {
    //     console.log("失败")
    //   },
    // })

    // //把face_token添加到脸集中
    // wx.request({
    //   url: 'https://api-cn.faceplusplus.com/facepp/v3/faceset/addface',//添加到脸集的接口
    //   method: 'post',
    //   data: {
    //     'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',//请填写你创建的 apikey
    //     'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',//请填写你的api_secret
    //     'face_tokens': that.data.face_token,//把上请求得到的人脸标识添加到脸集中
    //     'outer_id': 'facegofaceset',

    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //   },
    //   success(res) {
    //     console.log(res.data)
    //   },
    //   fail: function (e) {
    //     console.log("失败")
    //   },
    // })
  },

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
          url: 'https://api-cn.faceplusplus.com/facepp/v3/search', //对比人脸接口

          //几个可能需要用到的参数
          //image_url  String  目标人脸所在的图片的 URL  
          //image_file  File  目标人脸所在的图片，二进制文件，需要用 post multipart/form-data 的方式上传

          filePath: that.data.src,//上传相机拍照得到照片的地址
          name: 'image_file',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          formData: {
            'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',//请填写你创建的 apikey
            'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',//请填写你的api_secret
            'outer_id': 'facegofaceset', //脸集唯一标识
            'return_result_count': '1',//只反回一条匹配数据

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



              //返回的在faceset中存储的face_token 为用户的唯一id
              //这个要传到前端
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