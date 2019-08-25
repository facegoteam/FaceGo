Page({

  /**
   * 页面的初始数据
   */
  data: {
    // banner
    imgUrls: [
      "https://m.360buyimg.com/n12/jfs/t11317/108/1080677336/325163/f4c2a03a/59fd8b17Nbe2fcca3.jpg!q70.jpg",
      "https://m.360buyimg.com/n12/jfs/t11575/282/348533702/60173/d75cd1cc/59edb8d6N688b420f.jpg!q70.jpg",
      "https://m.360buyimg.com/n12/jfs/t11536/279/360605865/15194/442cab0b/59edb8d3N163a7608.jpg!q70.jpg",
      "https://m.360buyimg.com/n12/s750x750_jfs/t9733/126/2033941175/68120/a4eb4468/59edb8d6N37bea6f7.jpg!q70.jpg",
      "https://m.360buyimg.com/n12/s750x750_jfs/t10744/195/2053933852/71608/94425578/59edb8d6Ne28c70ff.jpg!q70.jpg"
    ],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    // 商品详情介绍
    detailImg: [
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_0_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_500_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_1000_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_1500_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_2000_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_2500_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_3000_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_3500_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_4000_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_4500_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_5000_750_500&imageView&thumbnail=710x0&quality=85",
      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_5500_750_500&imageView&thumbnail=710x0&quality=85",

      "https://haitao.nosdn1.127.net/8b8f60cb94b148e485dd50934e35ecca1511959468798jal1mola10610.jpg?imageView&quality=98&crop=0_6000_750_500&imageView&thumbnail=710x0&quality=85",

      "https://haitao.nos.netease.com/a108a6ae73914a91b7e07b8cc0ad32ad1511959470997jal1mqad10611.jpg?imageView&quality=98&crop=0_7500_750_500&imageView&thumbnail=710x0&quality=85",

      "https://haitao.nos.netease.com/a108a6ae73914a91b7e07b8cc0ad32ad1511959470997jal1mqad10611.jpg?imageView&quality=98&crop=0_8000_750_500&imageView&thumbnail=710x0&quality=85",

      "https://haitao.nos.netease.com/a108a6ae73914a91b7e07b8cc0ad32ad1511959470997jal1mqad10611.jpg?imageView&quality=98&crop=0_8500_750_500&imageView&thumbnail=710x0&quality=85",

      "https://haitao.nos.netease.com/a108a6ae73914a91b7e07b8cc0ad32ad1511959470997jal1mqad10611.jpg?imageView&quality=98&crop=0_9000_750_500&imageView&thumbnail=710x0&quality=85",

      "https://haitao.nos.netease.com/a108a6ae73914a91b7e07b8cc0ad32ad1511959470997jal1mqad10611.jpg?imageView&quality=98&crop=0_9500_750_376&imageView&thumbnail=710x0&quality=85",
    ],
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