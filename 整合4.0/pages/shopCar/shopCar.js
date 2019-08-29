import Toast from '../../dist/toast/toast';
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceAll: 0,
    iscart:true,
    listnum:0,
    goodsItem:[{
      id:1,
      number: 2,
      tagg: "宠物",
      price1: "15000.00",
      info: "我超可爱",
      title1: "快来吧我抱回家",
      imageURL: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566904383767&di=1fd8ce3ded74e626ea7dff9599c88949&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201605%2F09%2F20160509144239_xSTPX.thumb.700_0.jpeg"
    },
      {
        id:2,
        number: 3,
        tagg: "废物",
        price1: "15.00",
        info: "我超二",
        title1: "快敢把我抱回家",
        imageURL: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3249712317,2640666993&fm=26&gp=0.jpg"
      },
      {
        id: 3,
        number: 5,
        tagg: "宠物",
        price1: "1000.00",
        info: "我超可爱",
        title1: "快来吧我抱回家",
        imageURL: "http://5b0988e595225.cdn.sohucs.com/q_70,c_zoom,w_640/images/20180606/7f059b3b1d614bf3b649d857ccb3d4ac.jpeg"
      },
    ],
   
  },


  click1(e){
    console.log(e);
    var index=0;
   for(var i=0;i<this.data.goodsItem.length;i++)
   {
     if (e.currentTarget.id==this.data.goodsItem[i].id)
     {
       index=i;
       break;
     }

   }

  
    this.setData({
      [`goodsItem[${index}].number`]: this.data.goodsItem[index].number+1
    })

    // this.setData({
    //   [`goodsItem[${e.currentTarget.id - 1}].number`]: this.data.goodsItem[e.currentTarget.id - 1].number + 1
    // })



    // console.log(this.data.goodsItem[e.currentTarget.id - 1].number);
   
  },
  click2(e) {

    var index = 0;
    for (var i = 0; i < this.data.goodsItem.length; i++) {
      if (e.currentTarget.id == this.data.goodsItem[i].id) {
        index = i;
        break;
      }

    }



    
    console.log(e);
    if (this.data.goodsItem[index].number-1<=0){
      Dialog.alert({
        message: '都没了！憋减了！',
      }).then(() => {
        // on close
      });
    }
 
    else
    this.setData({
      
      [`goodsItem[${index}].number`]: this.data.goodsItem[index].number-1
  })
    // console.log(this.data.goodsItem[e.currentTarget.id - 1].number);
  },

// 删除
 delete(e){

   var index = 0;
   for (var i = 0; i < this.data.goodsItem.length; i++) {
     if (e.currentTarget.id == this.data.goodsItem[i].id) {
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

       this.data.goodsItem.splice(index, 1);
       this.setData({
         goodsItem: goodsItem

       })


       setTimeout(() => {
         Dialog.close();
       }, 1000);
     })
     .catch(() => {
       Dialog.close();
     });


// console.log(e);
//    console.log(this.data.goodsItem[e.currentTarget.id - 1].info);
  //  this.data.goodsItem.splice(e.currentTarget.id - 1,1);
  //  this.setData({
  //    goodsItem: goodsItem
  //  })
 },
//  下单
order(){

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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