import Toast from '../../dist/toast/toast';
import Dialog from '../../dist/dialog/dialog';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: app.globalData.ip,
    priceAll: 0,
    iscart:false,
    pirceAll:0,
    //picker[index]选择的提货地点
    index: null,
    picker: null,
    listnum:0,
    goodsItem:null,
  },

  //picker[index]选择的提货地点
  PickerChange(e) {
    console.log(e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },

// 方法名/类名：order
// 创建时间：9-2
// 作者：李若涵
// 简要说明：提交订单逻辑
  order(e) {
    var that = this;
    if (this.data.index == null) {
      Dialog.alert({
        message: '请在页面顶部选择提货商店',
      }).then(() => {
        // on close
      });
    }

    else {
      var index = 0;
      for (var i = 0; i < this.data.goodsItem.length; i++) {
        if (e.currentTarget.id == this.data.goodsItem[i].name) {
          index = i;
          break;
        }
      }    
      var send = [
        {
          'face_token': app.globalData.userInfo,
          'shop': that.data.picker[that.data.index] },
        {
          'name': e.currentTarget.id,
          'count': this.data.goodsItem[index].count
        }
      ];
      console.log(send)
      //标准数据库连接读取函数
      wx.request({
        url: 'http://' + app.globalData.ip + ':8001/customer_add_order',//接口
        method: 'post',
        header: {
          'content-type': 'application/json',
        },
        data: send,
        success(res) {
          console.log(res.data);
          Dialog.alert({
            message: '下单成功！请凭订单号' + res.data + '前往' + that.data.picker[that.data.index] + '领取您的商品',
          }).then(() => {
            var goodsItem = that.data.goodsItem;
            that.data.goodsItem.splice(index, 1);
            that.setData({
              goodsItem: goodsItem
            });
            if (that.data.goodsItem[0] == null) {
              that.setData({
                iscart: false
              })
            }
            console.log(that.data.goodsItem[0] == null)
            var temp = 0;
            for (var i = 0; i < that.data.goodsItem.length; i++) {
              temp = temp + that.data.goodsItem[i]['price'] * that.data.goodsItem[i]['count']
            }
            temp = temp * 100
            console.log(temp)
            //把数据读到listData里面
            that.setData({
              pirceAll: temp
            })


            // on close
          });
        },
        fail: function (e) {
          console.log("失败")
        },
      })
    }
    
  },

// 方法名/类名：add
// 创建时间：8-29
// 作者：黄少豪 李若涵
// 简要说明：增加商品数量 上传服务器
  add(e){
    console.log(e.currentTarget.id);
    var index=0;
    for(var i=0;i<this.data.goodsItem.length;i++)
    {
     if (e.currentTarget.id==this.data.goodsItem[i].name)
     {
       index=i;
       break;
     }
    }
    this.setData({
      [`goodsItem[${index}].count`]: this.data.goodsItem[index].count+1
    });

    var temp = 0;
    for (var i = 0; i < this.data.goodsItem.length; i++) {
      temp = temp + this.data.goodsItem[i]['price'] * this.data.goodsItem[i]['count']
    }
    temp = temp * 100
    console.log(temp)
    //把数据读到listData里面
    this.setData({
      pirceAll: temp
    })

    var that = this;
    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_change_cart',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'face_token': app.globalData.userInfo,
        'name': this.data.goodsItem[index].name,
        'count': this.data.goodsItem[index].count
      },
      success(res) {
        console.log(res.data);
      },
      fail: function (e) {
        console.log("失败")
      },
    })
  },

// 方法名/类名：minus
// 创建时间：8-29
// 作者：黄少豪 李若涵
// 简要说明：减少商品数量 上传服务器
  minus(e) {
    var index = 0;
    for (var i = 0; i < this.data.goodsItem.length; i++) {
      if (e.currentTarget.id == this.data.goodsItem[i].name) {
        index = i;
        break;
      }
    } 
    console.log(e);
    if (this.data.goodsItem[index].count-1<=0){
      Dialog.alert({
        message: '都没了！憋减了！',
      }).then(() => {
        // on close
      });
    }
    else{
      this.setData({
        [`goodsItem[${index}].count`]: this.data.goodsItem[index].count-1
      })
    }
 
    var temp = 0;
    for (var i = 0; i < this.data.goodsItem.length; i++) {
      temp = temp + this.data.goodsItem[i]['price'] * this.data.goodsItem[i]['count']
    }
    temp = temp * 100;
    console.log(temp);
    //把数据读到listData里面
    this.setData({
      pirceAll: temp
    })

    //标准数据库连接读取函数
    //请求修改数据库购物车
    var that = this;
    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_change_cart',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        'face_token': app.globalData.userInfo,
        'name': this.data.goodsItem[index].name,
        'count': this.data.goodsItem[index].count
      },
      success(res) {
        console.log(res.data);
      },
      fail: function (e) {
        console.log("失败")
      },
    })

  },
// 方法名/类名：delete
// 创建时间：8-29
// 作者：黄少豪 李若涵
// 简要说明：删除商品 上传服务器
 delete(e){
   var index = 0;
   for (var i = 0; i < this.data.goodsItem.length; i++) {
     if (e.currentTarget.id == this.data.goodsItem[i].name) {
       index = i;
       break;
     }
   }
   Dialog.confirm({
     title: '提示',
     message: '你真的不要我了嘛😭',
  asyncClose: true
   })
     .then(() => {
       var goodsItem = this.data.goodsItem;
       var that = this;
       wx.request({
         url: 'http://' + app.globalData.ip +':8001/customer_change_cart',//接口
         method: 'post',
         header: {
           'content-type': 'application/x-www-form-urlencoded',
         },
         data: {
           'face_token': app.globalData.userInfo,
           'name': this.data.goodsItem[index].name,
           'count': '0'
         },
         success(res) {
           console.log(res.data);
         },
         fail: function (e) {
           console.log("失败")
         },
       });

       this.data.goodsItem.splice(index, 1);
       this.setData({
         goodsItem: goodsItem
       });
       if (that.data.goodsItem[0] == null) {
         that.setData({
           iscart: false
         })
       }
       console.log(that.data.goodsItem[0] == null)

       var temp = 0;
       for (var i = 0; i < this.data.goodsItem.length; i++) {
         temp = temp + this.data.goodsItem[i]['price'] * this.data.goodsItem[i]['count']
       }
       temp = temp * 100
       console.log(temp)
       //把数据读到listData里面
       this.setData({
         pirceAll: temp
       })
       setTimeout(() => {
         Dialog.close();
       }, 1000);
     })
     .catch(() => {
       Dialog.close();
     });
 },



    
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;
    //标准数据库连接读取函数
    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_ask_for_cart',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        'face_token':  app.globalData.userInfo,
      },
      success(res) {
        console.log(res.data);
        var temp = 0;
        for (var i = 0; i < res.data.length; i++) {
          temp = temp + res.data[i]['price'] * res.data[i]['count']
        }
        temp=temp*100
        console.log(temp)
        //把数据读到listData里面
        that.setData({
          goodsItem: res.data,
          pirceAll:temp
        })
        if (that.data.goodsItem[0]!=null){
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;

    //获取门店名称
    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_ask_for_shop',//接口
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


// 方法名/类名：order
// 创建时间：8-29
// 作者：李若涵
// 简要说明：下单操作 选择地址 提供订单号
  onClickButton(e) {
    var that = this;
    if (this.data.index == null)
    {
      Dialog.alert({
        message: '请在页面顶部选择提货商店',
      }).then(() => {
        // on close
      });
    }
    // else if (that.data.goodsItem[0] == null){
    //   Dialog.alert({
    //     message: '请先添加商品后再下单',
    //   }).then(() => {
    //     // on close
    //   });

    // }
    else{
      var send = [
        { 'face_token': app.globalData.userInfo, 'shop': that.data.picker[that.data.index]}
      ];
      for (var i = 0; i < this.data.goodsItem.length; i++) {
        var temp = { 'name': null, 'count': null };
        temp['name'] = that.data.goodsItem[i]['name']
        temp['count'] = that.data.goodsItem[i]['count']
        console.log(temp)
        send[i + 1] = temp
      }
      console.log(send)
      //标准数据库连接读取函数
      wx.request({
        url: 'http://' + app.globalData.ip + ':8001/customer_add_order',//接口
        method: 'post',
        header: {
          'content-type': 'application/json',
        },
        data: send,
        success(res) {
          console.log(res.data);
          Dialog.alert({
            message: '下单成功！请凭订单号' + res.data + '前往' + that.data.picker[that.data.index]+'领取您的商品',
          }).then(() => {
            that.setData({
              goodsItem: null,
              iscart: false,
              pirceAll: 0
            })
            // on close
          });
        },
        fail: function (e) {
          console.log("失败")
        },
      })
    }

  },

})

