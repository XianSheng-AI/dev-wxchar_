import * as echarts from '../../ec-canvas/echarts';
const call = require("../../utils/request.js");
var util=require("../../utils/util.js");
const app = getApp();

let deviceData = [
  {
    deviceName: '果酱机',
    data: [18, 36, 65, 30, 78, 40, 33]
  },
  {
    deviceName: '咖啡机',
    data: [12, 50, 51, 35, 70, 30, 20]
  },
  {
    deviceName: '糖果机',
    data: [10, 30, 31, 50, 40, 20, 10]
  }
];
var option = {
  color: ["#37A2DA", "#67E0E3"],
  
  legend: {
    data: ['果酱机', '咖啡机'],
    top: -4,
    left: 'center',
    z: 100,
    textStyle: {
      fontWeight: 300,
      fontSize: 12    //文字的字体大小
    },
  },
  grid: {
    containLabel: true
  },
  tooltip: {
    show: true,
    // trigger: 'axis'

    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
    },
    // confine: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
  },
  yAxis: {
    x: 'center',
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  
  series: [
    {
    name: '果酱机',
    type: 'line',
    smooth: true,
    barWidth: '20%',
    data: []
    }, 
    {
      name: '咖啡机',
      type: 'line',
      smooth: true,
        data: []
    }
    ]
};

var pieData={
  faultNum: "123",
  normalNum: "234",
  onlineNum: "100",
  outlineNum: "10"
};
// 饼图
function initChartPie(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width-80,
    height: height-80
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#00C957", "#808A87"],
    fontSize: 25,
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['在线', '离线']
    },
    series: [{

      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      label: {
        textStyle: {
          fontWeight: 300,
          fontSize: 12    //文字的字体大小
        },
        formatter: '{b}: {@2012}台 ({d}%)'
      },
      data: [
        { value: pieData.onlineNum, name: '在线' },
        { value: pieData.outlineNum, name: '离线' }
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };

  chart.setOption(option);
  return chart;
}



// 饼图2
function initChartPie2(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width-80,
    height: height-80
  });
  canvas.setChart(chart);
  var options = {
    backgroundColor: "#ffffff",
    color: ["#00C957", "#B22222"],
    fontSize: 25,
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['正常', '故障']
    },
    
    series: [{

      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      label: {
        textStyle: {
          fontWeight: 300,
          fontSize: 12    //文字的字体大小
        },
        formatter: '{b}: {@2012}台 ({d}%)'
      },
      // label: {
      //   normal: {
      //     formatter: '{b}:{c}',
      //     position: 'inside',
      //     fontSize: 13
      //   }
      // },
      data: [
        { value: pieData.normalNum, name: '正常' },
        { value: pieData.faultNum, name: '故障' }
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };

  chart.setOption(options);
  return chart;
}
var barec = null;

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () {
       },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: function (canvas, width, height) {
        barec = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barec);
        barec.setOption(option);
        return barec;
      }
    },
    showPieBool:false,
    timer:[],
    activeNumList:{
      timeNum:'0'
    },
    jamTotal:0,
    cofeeTotal:0,
    allTotal:0,
    
    eArg: null,
    eArg2:null,
    pie: {},
    pie2: {},
    _this:null,
    listlist:'',
    dnf:''
  },

  showStyle(e){
    let style = e.currentTarget.dataset['style'];
    let type='';
    let tip='';
    if (style === 'line') {
      type='line';
      tip='line';
    }
    if (style === 'bar') {
      type = 'bar';
      tip ='shadow'
    }
    if (style === 'refresh') {
      console.log(454)
      if (this.data.activeNumList.timeNum == '0') {
        this.setTimer('7');
      }
      if (this.data.activeNumList.timeNum == '1') {
        this.setTimer('30');
      }
      if (this.data.activeNumList.timeNum == '2') {
        this.setTimer('90');
      }
      if (this.data.activeNumList.timeNum == '3') {
        this.setTimer('183');
      }
      
      

      
    }
    option.tooltip.axisPointer.type=tip;
    for (let i = 0, len = option.series.length;i<len;i++){
      option.series[i].type=type;
    }
    barec.setOption(option)
  },


  getSellCountM(param) {
    let that=this;
    that.setData({ jamTotal: 315 });
    that.setData({ cofeeTotal: 201 });
    that.setData({ allTotal: 516 });
    let token = wx.getStorageSync("access_token");
    // call.getData('api/order/getSellCount?access_token=' + token + '&startTime=' + param.startTime + '&endTime=' + param.endTime, that.getSellCountSuc, that.getSellCountFail);
  },
  getSellCountSuc(data) {
    console.log(data)
    if(data.code==='200'){
      wx.showToast({
        title: '数据已更新',
        icon: 'success',
        duration: 1500
      })
    }
    let that = this;
    let listData=data.data;
    console.log(listData)
    let listTimer = this.data.timer;
    let jam = [];  //果酱机
    let cofee = [];  //咖啡机
    let allTo = 0;
    let jamT = 0;
    let cofeeT = 0
    for (let s = 0, len = listData.length; s < len; s++) {
      // 果酱机
      if (listData[s].type === "marmalade") {
        jam.push(listData[s]);
        jamT += Number(listData[s].count);
      }
      // 咖啡机
      if (listData[s].type === "cofee") {
        cofee.push(listData[s]);
        cofeeT += Number(listData[s].count);
      }
    }
    allTo = jamT + cofeeT;
    console.log(allTo)
    console.log(jamT)
    console.log(cofeeT)
    that.setData({ jamTotal: jamT.toFixed(3) });
    that.setData({ cofeeTotal: cofeeT.toFixed(3) });
    that.setData({ allTotal: allTo.toFixed(3) });
    
    option.series[0].data = [];
      // 果酱机
      for (let i = 0, len = jam.length;i<len;i++){
        for (let w = 0, lenw = listTimer.length; w < lenw;w++){
          if (jam[i].time==listTimer[w]){
            option.series[0].data[w] = jam[i].count;
          }
        }
      }
      for (let y = 0, leny = listTimer.length;y<leny;y++){
        if (!option.series[0].data[y]){
          option.series[0].data[y]=0;
        }
      }
      barec.setOption(option)

  },
  showData(event){
    let time = event.currentTarget.dataset['time'];
    let _this=this;
    
    
    if (time === 'week') {
      _this.setData({ 'activeNumList.timeNum': 0 })
      _this.setTimer('7');
    }
    if (time === 'month') {
      _this.setData({ 'activeNumList.timeNum': 1})
      _this.setTimer('30')
    }
    if (time === 'month3') {
      _this.setData({ 'activeNumList.timeNum': 2 })
      this.setTimer('90')
      
    }
    if (time === 'year') {
      _this.setData({ 'activeNumList.timeNum': 3 })
      this.setTimer('183')
    }
  },

  
  // 销售统计
  sellCount(val){
    if(val==='0'){

    }
  },
  // 时间推算
  setTimer(val) {
  
    let arr = [];
    let param = {};
    if(val==='7'){
      for (let i = 6; i >= 0; i--) {
        arr.push(util.getDay(-i));
      }
      
      param.startTime = arr[0];
      param.endTime = arr[arr.length - 1];
      
      this.getSellCountM(param);

    }
    if (val === '30') {
      arr=[];
      for (let i = 29; i >= 0; i--) {
        arr.push(util.getDay(-i));
      }
      param.startTime = arr[0];
      param.endTime = arr[arr.length - 1];
      this.getSellCountM(param);
      
    }
    if (val === '90') {
      for (let i = 89; i >= 0; i--) {
        arr.push(util.getDay(-i));
      }
      param.startTime = arr[0];
      param.endTime = arr[arr.length - 1];
      this.getSellCountM(param);
    }
    if (val === '183') {
      for (let i = 182; i >= 0; i--) {
        arr.push(util.getDay(-i));
      }
      param.startTime = arr[0];
      param.endTime = arr[arr.length - 1];
      this.getSellCountM(param);
    }


    this.data.timer=arr;
    option.xAxis.data = arr;
    setTimeout(function (){
      barec.setOption(option)
    },500)
    
    
  },
  // 初始化饼图数据
  // 饼图
  echartInit(e) {
    let token = wx.getStorageSync("access_token");
    wx.request({
      url: 'http://wwhl-iot.com/client_plat/api/order/getDeviceNetStatus?access_token=' + token,
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      method: 'GET',
      success(res) {
        pieData = res.data.data;
        initChartPie(e.detail.canvas, e.detail.width, e.detail.height);
      },
      fail: function () {
        console.log(Error);
      }
    })
  },
  // 饼图2
  echartInit2(e) {
    let token = wx.getStorageSync("access_token");
    wx.request({
      url: 'http://wwhl-iot.com/client_plat/api/order/getDeviceNetStatus?access_token=' + token,
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      method: 'GET',
      success(res) {
        pieData = res.data.data;
        initChartPie2(e.detail.canvas, e.detail.width, e.detail.height);
      },
      fail: function () {
        console.log(Error);
      }
    })
  },
  onLoad(){
    this.setTimer('7');
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {

  },
  onReady() {
    
  }
});
