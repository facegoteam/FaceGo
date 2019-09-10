var wxCharts = require('./../../utils/wxcharts.js');
var app = getApp();
var ringChart = null;
var windowW = 0;
var columnChart = null;

Page({
  data: {
    chartTitle: '消费金额',
    ip: app.globalData.ip,
    isMainChartDisplay: true,
    ringchartData : null,
    colchartdata: null,
    colchartcategories: null
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_ask_for_type_statics',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        'face_token': app.globalData.userInfo
      },
      success(res) {
        console.log(res.data);
        //把数据读到listData里面
        that.setData({
          ringchartData: res.data
        })
        console.log(that.data.ringchartData)
      },
      fail: function (e) {
        console.log("失败")
      },
    });
    wx.request({
      url: 'http://' + app.globalData.ip +':8001/customer_ask_for_month_statics',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'face_token': app.globalData.userInfo,
      },
      success(res) {
        console.log(res.data);
        //把数据读到listData里面
        that.setData({
          colchartdata : res.data.data,
          colchartcategories:res.data.categories
        })

        var windowWidth = 320;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }

        ringChart = new wxCharts({
          animation: true,
          canvasId: 'ringCanvas',
          type: 'ring',
          extra: {
            ringWidth: 20,
            pie: {
              offsetAngle: -45
            }
          },
          series: that.data.ringchartData,//.main,
          disablePieStroke: true,
          width: windowWidth,
          height: (250 * windowW),
          background: '#f5f5f5',
          padding: 0
        });

        //完成构图
        ringChart.addEventListener('renderComplete', () => {
          console.log('renderComplete');
        });

        setTimeout(() => {
          ringChart.stopAnimation();
        }, 500);

        //柱状图
        columnChart = new wxCharts({
          canvasId: 'columnCanvas',
          type: 'column',
          animation: true,
          categories: that.data.colchartcategories,
          series: [{
            name: '消费额',
            data: that.data.colchartdata,
            format: function (val, name) {
              return val.toFixed(1) + '元';
            }
          }],
          yAxis: {
            format: function (val) {
              return val + '元';
            },
            min: 0
          },
          xAxis: {
            disableGrid: false,
            type: 'calibration'
          },
          extra: {
            column: {
              width: 15
            }
          },
          width: windowWidth,
          height: 200,
        });
      },
      fail: function (e) {
        console.log("失败")
      },
    })

    // 屏幕宽度
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth
    });
    console.log(this.data.imageWidth);

    //计算屏幕宽度比列
    windowW = this.data.imageWidth / 375;
    console.log(windowW);
  },

  //环图的点击处理函数
  touchHandler: function (e) {
    console.log(ringChart.getCurrentDataIndex(e));
  },
 
  onReady: function (e) {
  }
})