Page({
  data: {
    iscart: false,
    cart: [], //数据
    count: 1,   //商品数量默认是1
    total: 0,    //总金额
    goodsCount: 0 //数量
  },
  onLoad: function (options) {

  },
  onShow: function () {
    var that = this;
    // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）
    var arr = wx.getStorageSync('cart') || [];
    // 有数据的话，就遍历数据，计算总金额 和 总数量
    if (arr.length > 0) {
      for (var i in arr) {
        that.data.total += Number(arr[i].price) * Number(arr[i].count);
        that.data.goodsCount += Number(arr[i].count);
      }
      // 更新数据
      this.setData({
        iscart: true,
        cart: arr,
        total: that.data.total,
        goodsCount: that.data.goodsCount
      });
    }
  },
  onHide: function () {
    // 清除数据
    this.setData({
      iscart: false,
      cart: [], //数据
      total: 0,    //总金额
      goodsCount: 0 //数量
    });
  },
  /* 减数 */
  delCount: function (e) {
    console.log(e)
    // 获取购物车该商品的数量
    // [获取设置在该btn的id,即list的index值]
    if (this.data.cart[e.target.id.substring(3)].count <= 1) {
      return;
    }
    // 商品总数量-1
    this.data.goodsCount -= 1;
    // 总价钱 减去 对应项的价钱单价
    this.data.total -= Number(this.data.cart[e.target.id.substring(3)].price);
    // 购物车主体数据对应的项的数量-1  并赋给主体数据对应的项内
    this.data.cart[e.target.id.substring(3)].count = --this.data.cart[e.target.id.substring(3)].count;
    // 更新data数据对象
    this.setData({
      cart: this.data.cart,
      total: this.data.total,
      goodsCount: this.data.goodsCount
    })
    // 主体数据重新赋入缓存内
    try {
      wx.setStorageSync('cart', this.data.cart)
    } catch (e) {
      console.log(e)
    }
  },
  /* 加数 */
  addCount: function (e) {
    // 商品总数量+1
    this.data.goodsCount += 1;
    // 总价钱 加上 对应项的价钱单价
    this.data.total += Number(this.data.cart[e.target.id.substring(3)].price);
    // 购物车主体数据对应的项的数量+1  并赋给主体数据对应的项内
    this.data.cart[e.target.id.substring(3)].count = ++this.data.cart[e.target.id.substring(3)].count;
    // 更新data数据对象
    this.setData({
      cart: this.data.cart,
      total: this.data.total,
      goodsCount: this.data.goodsCount
    })
    // 主体数据重新赋入缓存内
    try {
      wx.setStorageSync('cart', this.data.cart)
    } catch (e) {
      console.log(e)
    }
  },
  /* 删除item */
  delGoods: function (e) {
    // 商品总数量  减去  对应删除项的数量
    this.data.goodsCount = this.data.goodsCount - this.data.cart[e.target.id.substring(3)].count;
    // 总价钱  减去  对应删除项的单价*数量
    this.data.total -= this.data.cart[e.target.id.substring(3)].price * this.data.cart[e.target.id.substring(3)].count;
    // 主体数据的数组移除该项
    this.data.cart.splice(e.target.id.substring(3), 1);
    // 更新data数据对象
    this.setData({
      cart: this.data.cart,
      total: this.data.total,
      goodsCount: this.data.goodsCount
    })
    // 主体数据重新赋入缓存内
    try {
      wx.setStorageSync('cart', this.data.cart)
    } catch (e) {
      console.log(e)
    }
  }
})