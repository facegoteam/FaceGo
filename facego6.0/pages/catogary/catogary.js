const app = getApp()

Page({
  data: {
    ip: app.globalData.ip,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,
    click: true,
  },

  onLoad() {
    var that = this;
    var list1 = [{}];
    for (let i = 0; i < 4; i++) {
      list1[i] = {};
      list1[i].id = i;
    }
    list1[0].name = '食品';
    list1[1].name = '饮品';
    list1[2].name = '日用品';
    list1[3].name = '书籍杂志';

    this.setData({
      list: list1,
      listCur: list1[0]
    });

    //与服务器连接传输数据
    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_ask_for_good',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'type': '食品'
      },
      success(res) {
        console.log(res.data);
        var temp = "list[" + 0 + "].listdata";//先用一个变量，把(list[0].listdata)用字符串拼接起来
        that.setData({
          [temp]: res.data,
        });
      },
      fail: function (e) {
        console.log("失败")
      },
    })

    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_ask_for_good',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'type': '饮品'
      },
      success(res) {
        console.log(res.data);
        list1[1].listdata = res.data;
        var temp = "list[" + 1 + "].listdata";//先用一个变量，把(list[0].listdata)用字符串拼接起来
        that.setData({
          [temp]: res.data,
        });
      },
      fail: function (e) {
        console.log("失败")
      },
    })

    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_ask_for_good',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'type': '日用品'
      },
      success(res) {
        console.log(res.data);
        list1[2].listdata = res.data;
        var temp = "list[" + 2 + "].listdata";//先用一个变量，把(list[0].listdata)用字符串拼接起来
        that.setData({
          [temp]: res.data,
        });
      },
      fail: function (e) {
        console.log("失败")
      },
    })

    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_ask_for_good',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'type': '书籍杂志'
      },
      success(res) {
        console.log(res.data);
        list1[3].listdata = res.data;
        var temp = "list[" + 3 + "].listdata";//先用一个变量，把(list[0].listdata)用字符串拼接起来
        that.setData({
          [temp]: res.data,
        });
      },
      fail: function (e) {
        console.log("失败")
      },
    })

    wx.showLoading({
      title: '加载中...',
      mask: true
    });
  },

  onReady() {
    wx.hideLoading();
  },

  catchTap: function (e) {
    var click = this.data.click;
    this.setData({
      click: false
    })
    setTimeout(function () {
      console.log(e.currentTarget.dataset.type)
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + e.currentTarget.dataset.type,
      })
    }, 50)
  },


  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },

  inputTyping: function (e) {
    //搜索数据
    this.setData({
      inputVal: e.detail.value
    });
  },


  onSearch: function (e) {
    console.log('111111')
    //搜索数据
    // getList(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });

    var that = this;
    setTimeout(function () {
      // console.log(e.currentTarget.dataset.type)
      wx.navigateTo({
        url: '/pages/search/search?id=' + e.detail.value,
      })
    }, 50)
  },

  
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  }
})