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

  order(e) {
    var that = this;
    if (this.data.index == null) {
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
    else {
      var index = 0;
      for (var i = 0; i < this.data.goodsItem.length; i++) {
        if (e.currentTarget.id == this.data.goodsItem[i].name) {
          index = i;
          break;
        }
      }    
      var send = [
        { 'face_token': '0ae83ffd1cabed5275dc437ab851f91d', 
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

  //增加按钮
  click1(e){
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
        'face_token': '0ae83ffd1cabed5275dc437ab851f91d',
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


  //减少按钮
  click2(e) {
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
        'face_token': '0ae83ffd1cabed5275dc437ab851f91d',
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

// 删除
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
           'face_token': '0ae83ffd1cabed5275dc437ab851f91d',
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
        'face_token': '0ae83ffd1cabed5275dc437ab851f91d'
        // app.globalData.userInfo,
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


  //  下单
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
        { 'face_token': '0ae83ffd1cabed5275dc437ab851f91d', 'shop': that.data.picker[that.data.index]}
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




// goodsItem:[{
    //   number: 2,
    //   tagg: "宠物", 
    //   price1: "15000.00",
    //   info: "我超可爱",
    //   title1: "快来吧我抱回家",
    //   imageURL: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566904383767&di=1fd8ce3ded74e626ea7dff9599c88949&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201605%2F09%2F20160509144239_xSTPX.thumb.700_0.jpeg"
    // },
    //   {

    //     number: 3,
    //     tagg: "废物",
    //     price1: "15.00",
    //     info: "我超二",
    //     title1: "谁敢把我抱回家",
    //     imageURL: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3249712317,2640666993&fm=26&gp=0.jpg"
    //   },
    //   {

    //     number: 5,
    //     tagg: "宠物",
    //     price1: "1000.00",
    //     info: "我超可爱",
    //     title1: "快来抱我吧",
    //     imageURL: "http://5b0988e595225.cdn.sohucs.com/q_70,c_zoom,w_640/images/20180606/7f059b3b1d614bf3b649d857ccb3d4ac.jpeg"
    //   },
    // ],