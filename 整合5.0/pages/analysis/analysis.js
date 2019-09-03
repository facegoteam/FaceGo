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
    ringchartData : 
    [
      {
        name: '食品',
        data: 80,
      }, {
        name: '日用品',
        data: 35,
      }, {
        name: '家电',
        data: 78,
      }, {
        name: '杂志书刊',
        data: 63,
      }],
    colchartdata: [15, 20, 45, 37, 39, 22, 14, 94],
    colchartcategories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月']
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
        'face_token':'0ae83ffd1cabed5275dc437ab851f91d'
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
        'face_token': '0ae83ffd1cabed5275dc437ab851f91d'
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
        //var that = this;

        console.log(that.data.ringchartData);

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
    // var windowWidth = 320;
    // try {
    //   var res = wx.getSystemInfoSync();
    //   windowWidth = res.windowWidth;
    // } catch (e) {
    //   console.error('getSystemInfoSync failed!');
    // }
    // var that = this;

    // console.log(this.data.ringchartData);

    // ringChart = new wxCharts({
    //   animation: true,
    //   canvasId: 'ringCanvas',
    //   type: 'ring',
    //   extra: {
    //     ringWidth: 20,
    //     pie: {
    //       offsetAngle: -45
    //     }
    //   },
    //   series: that.data.ringchartData,//.main,
    //   disablePieStroke: true,
    //   width: windowWidth,
    //   height: (250 * windowW),
      
    //   background: '#f5f5f5',
    //   padding: 0
    // });

    // //完成构图
    // ringChart.addEventListener('renderComplete', () => {
    //   console.log('renderComplete');
    // });

    // setTimeout(() => {
    //   ringChart.stopAnimation();
    // }, 500);

    // //柱状图
    // columnChart = new wxCharts({
    //   canvasId: 'columnCanvas',
    //   type: 'column',
    //   animation: true,
    //   categories: this.data.colchartcategories,
    //   series: [{
    //     name: '消费额',
    //     data: this.data.colchartdata,
    //     format: function (val, name) {
    //       return val.toFixed(1) + '元';
    //     }
    //   }],
    //   yAxis: {
    //     format: function (val) {
    //       return val + '元';
    //     },
    //     min: 0
    //   },
    //   xAxis: {
    //     disableGrid: false,
    //     type: 'calibration'
    //   },
    //   extra: {
    //     column: {
    //       width: 15
    //     }
    //   },
    //   width: windowWidth,
    //   height: 200,
    // });
  }
})