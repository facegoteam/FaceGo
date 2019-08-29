var wxCharts = require('./../../utils/wxcharts.js');
var app = getApp();
var ringChart = null;
var windowW = 0;
var columnChart = null;
var colchartData = {
  main: {
    title: '消费金额',
    data: [15, 20, 45, 37, 39, 22, 14, 94],
    categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月']
  },
  // sub: [{
  //   title: '2012年度成交量',
  //   data: [70, 40, 65, 100, 34, 18],
  //   categories: ['1', '2', '3', '4', '5', '6']
  // }, {
  //   title: '2013年度成交量',
  //   data: [55, 30, 45, 36, 56, 13],
  //   categories: ['1', '2', '3', '4', '5', '6']
  // }, {
  //   title: '2014年度成交量',
  //   data: [76, 45, 32, 74, 54, 35],
  //   categories: ['1', '2', '3', '4', '5', '6']
  // }, {
  //   title: '2015年度成交量',
  //   data: [76, 54, 23, 12, 45, 65],
  //   categories: ['1', '2', '3', '4', '5', '6']
  // }]
};

var ringchartData = {
  main:[
  {
    name: '食品',
    data: 80,
    stroke: false
  }, {
    name: '日用品',
    data: 35,
    stroke: false
  }, {
    name: '家电',
    data: 78,
    stroke: false
  }, {
    name: '杂志书刊',
    data: 63,
    stroke: false
  }]
};



Page({
  data: {
    chartTitle: '消费金额',
    isMainChartDisplay: true
  },

  onLoad: function (options) {
    wx.request({
      url: 'http://10.203.202.167:8001/customer_ask_for_shop',//接口
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        console.log(res.data);
        //把数据读到listData里面
        that.setData({
          listData: res.data
        })
      },
      fail: function (e) {
        console.log("失败")
      },
    })





    //ringchartData.main[0].data=40;
    
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
  // updateData: function () {
  //   ringChart.updateData({
  //     title: {
  //       name: '80%'
  //     },
  //     subtitle: {
  //       color: '#ff0000'
  //     }
  //   });
  // },
  onReady: function (e) {
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
      // title: {
      //   name: '70%',
      //   color: '#7cb5ec',
      //   fontSize: 25
      // },
      // subtitle: {
      //   name: '收益率',
      //   color: '#666666',
      //   fontSize: 15
      // },
      series: ringchartData.main,

      disablePieStroke: true,
    //  dataLabel: false,
    //legend: false,
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

    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: colchartData.main.categories,
      series: [{
        name: '消费额',
        data: colchartData.main.data,
        format: function (val, name) {
          return val.toFixed(1) + '元';
        }
      }],
      yAxis: {
        format: function (val) {
          return val + '元';
        },
        //title: 'hello',
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
  }
})
