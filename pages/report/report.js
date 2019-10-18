var wxCharts = require('../../libs/wxcharts.js');   //引入wxChart文件
var app = getApp();
var lineChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  torecord() {
    // wx.navigateTo({
    //   url: '../lookrecord/lookrecord',
    // })
    wx.navigateBack({
      delta: 1,
    })
  },
  touchHandler: function (e) {
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  // createSimulationData: function () {
  //   var categories = [];
  //   var data = [];
  //   for (var i = 6; i > 0; i--) {
  //     categories.unshift('2018-' + (i + 1));
  //     data.push(Math.random() * (20 - 10) + 10);
  //   }
  //   // data[4] = null;
  //   return {
  //     categories: categories,
  //     data: data
  //   }
  // },
  updateData: function (e) {
    // var simulationData = this.createSimulationData();
    // var series = [{
    //   name: '成交量1',
    //   data: simulationData.data,
    //   format: function (val, name) {
    //     return val.toFixed(2) + '万';
    //   }
    // }];
    // lineChart.updateData({
    //   categories: simulationData.categories,
    //   series: series
    // });
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var windowWidth = '', windowHeight = '';    //定义宽高
    try {
      var res = wx.getSystemInfoSync();    //试图获取屏幕宽高数据
      windowWidth = res.windowWidth / 750 * 690;   //以设计图750为主进行比例算换
      windowHeight = res.windowWidth / 750 * 550    //以设计图750为主进行比例算换
    } catch (e) {
      console.error('getSystemInfoSync failed!');   //如果获取失败
    }
    lineChart = new wxCharts({     //定义一个wxCharts图表实例
      canvasId: 'lineCanvas',     //输入wxml中canvas的id
      type: 'line',       //图标展示的类型有:'line','pie','column','area','ring','radar'
      categories: ['2018-6-13', '2018-6-14', '2018-6-15', '2018-6-16', '2018-6-17', '2018-6-18', '2018-6-19'],    //模拟的x轴横坐标参数
      animation: true,  //是否开启动画
      series: [{   //具体坐标数据
        name: '果酱机',  //名字
        data: [60, 90, 60, 110, 120, 105, 70],  //数据点
        format: function (val, name) {  //点击显示的数据注释
          return val + 'L';
        }
      }, {
        name: '咖啡机',
        data: [50, 100, 80, 115, 120, 90, 125],
        format: function (val, name) {
          return val + 'L';
        }
      }, {
        name: '糖果机',
        data: [60, 70, 90, 105, 120, 130, 95],
        format: function (val, name) {
          return val + 'L';
        }
      }
      ],
      xAxis: {   //是否隐藏x轴分割线
        disableGrid: true,
      },
      yAxis: {      //y轴数据
        title: '数值（L）',  //标题
        format: function (val) {  //返回数值
          return val.toFixed(2);
        },
        min: 30,   //最小值
        max: 180,   //最大值
        gridColor: '#D8D8D8',
      },
      width: windowWidth,  //图表展示内容宽度
      height: windowHeight,  //图表展示内容高度
      dataLabel: false,  //是否在图表上直接显示数据
      dataPointShape: true, //是否在图标上显示数据点标志
      extra: {
        lineStyle: 'curve'  //曲线
      },
    });
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

  },
})