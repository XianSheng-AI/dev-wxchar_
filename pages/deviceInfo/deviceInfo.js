// let Charts = require('../../libs/wxcharts.js');
const call = require("../../utils/request.js");
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');  //腾讯地图SDK
var qqmapsdk;
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDrinksBool: false,
    showWenDuBool: false,
    showModeBool: false,
    showWaterBool: false,
    showMarkInfoBool: false,
    drinksIndex: 100,



    argData:{},


    

    // 设备详情
    deviceDetail: {},
    deviceNo: '',
    // 温度设置
    wenduIndex: 0,

    slider1: '50',
    slider2: '14',
    slider3: '22',

    // 开始打杯
    startGroupBool: false,
    // 打几号杯
    dabeiNum: 100,
    // 模式设置
    modeActiveIndex: 0,

    wenduActive: true,
    tonActive: true,
    wuActive:true,
    // 锁定设备
    lockDeviceBool: false,
    dd:true,
    // 水位设置
    waterData:{
      water1: '',
      water2: '',
      water3: '',
      water4:''
    },

    argStatus:{
      workMode:'',
      workStatus:'',
      waterPosi:'',
      yuanliaoTem:''

    },

    modeList:{
      dabei:'',
      wendu:'',
      shuiwei:'',
      mode:'',
      lock:''
    },

    
    workStatus:'',

    selectArray1: [{
        "id": "1",
        "text": "区域1"
      },
      {
        "id": "1",
        "text": "区域2"
      },
      {
        "id": "1",
        "text": "区域3"
      }
    ],
    temperatureTabIndex: 2,
    temperatureTab: [{
        value: '加热'
      },
      {
        value: '制冷'
      },
      {
        value: '原料箱温度'
      }
    ]
  },
  // 饮料打杯
  showDaBei() {
    this.setData({
      showDrinksBool: !this.data.showDrinksBool
    })
  },
  // 选择杯号
  daBeiM(e) {
    let token = wx.getStorageSync("access_token");
    let index = e.currentTarget.dataset['dabei'];
    
    console.log(index, this.data.drinksIndex);
    let bool=false;
    if (index === this.data.drinksIndex){
      bool=true;
      // 取消打杯
      call.request('api/device/controlDevice?access_token=' + token + '&deviceNo=' + this.data.deviceNo + '&orderNo=Cancel&orderValue=' + this.data.dabeiNum+'&orderSource=WeChat', {}, this.cancelSuc, this.cancelFail);
      index='10';
    }
    this.setData({
      dabeiNum: Number(index) + 1
    });
    this.setData({
      drinksIndex: index
    });
    
    // 开始打杯
    if(!bool){
      call.request('api/device/controlDevice?access_token=' + token + '&deviceNo=' + this.data.deviceNo + '&orderNo=PayOK&orderValue=' + this.data.dabeiNum + '&orderSource=WeChat', {}, this.payOKSuc, this.payOKFail)
    }
    
    
  },
  cancelSuc(data) {
    console.log(data);
  },
  cancelFail() {

  },
  // 开始打杯
  // startGroupUp() {
  //   let token = wx.getStorageSync("access_token");
  //   call.request('api/device/controlDevice?access_token=' + token + '&deviceNo=' + this.data.deviceNo + '&orderNo=PayOK&orderValue=' + this.data.dabeiNum, {}, this.payOKSuc, this.payOKFail)

  //   this.setData({
  //     startGroupBool: true
  //   });
  // },
  payOKSuc(data) {
    console.log(data);
  },
  payOKFail() {

  },
  // 温度设置
  showWenDu() {
    this.setData({
      showWenDuBool: !this.data.showWenDuBool
    })
  },
  wenduM(e) {
    let index = e.currentTarget.dataset['wendu'];
    console.log(index)
    this.setData({
      wenduIndex: index
    });
  },
  selectedTab(e) {
    console.log(e)

    let index = e.currentTarget.dataset['index'];
    this.setData({
      temperatureTabIndex: index
    });
  },
  // 加热
  changeSlider1(e) {
    this.setData({ slider1: e.detail.value });
  },
  // 制冷
  changeSlider2(e) {
    this.setData({ slider2: e.detail.value });
  },
  // 原料箱温度
  changeSlider3(e) {
    this.setData({ slider3: e.detail.value });
  },

  wenduSub(e){
    console.log(e);
    let params={
      deviceNo:'',
      orderNo:'',
      orderValue:''
    }
    console.log(e.target.dataset.wendu)
    let target = e.target.dataset.wendu;
    
    let token = wx.getStorageSync("access_token");
    let setValue='';
    setValue = this.data.slider1 + ',0,' + this.data.slider2 + ',0,' + this.data.slider3+',0';
    console.log(setValue)
    call.request('api/device/controlDevice?access_token=' + token + '&deviceNo=' + this.data.deviceNo + '&orderNo=SetTemp&orderValue=' + setValue + '&orderSource=WeChat', {}, this.controlDeviceSuc, this.controlDeviceFail)
  },
  controlDeviceSuc(data){
    console.log(data)
  },
  controlDeviceFail(){
    console.log('失败了')
  },

  // 模式设置
  changeMode(e) {
    let mode = e.currentTarget.dataset['mode'];
    // console.log(this.data.argData);
    if (mode === 'hot') {
      this.setData({ 'argData.temModel': '0'});
    }
    if (mode === 'cool') {
      this.setData({ 'argData.temModel': '1' });
    }
    if (mode === 'ton') {
      this.setData({ 'argData.waterModel': '0'});
    }
    if (mode === 'zhi') {
      this.setData({ 'argData.waterModel': '1' });
    }
    if (mode === 'net') {
      this.setData({ 'argData.workModel': '0' });
    }
    if (mode === 'free') {
      this.setData({ 'argData.workModel': '1' });
    }

    let setValue = this.data.argData.temModel + ',' + this.data.argData.waterModel + ',0,0,' + this.data.argData.workModel + ',0,0,0';
    console.log(setValue);
    let token = wx.getStorageSync("access_token");
    call.request('api/device/controlDevice?access_token=' + token + '&deviceNo=' + this.data.deviceNo + '&orderNo=SetMode&orderValue=' + setValue + '&orderSource=WeChat', {}, this.modeActiveSuc, this.modeActiveFail)

    // this.setData({
    //   modeActiveIndex: index
    // });
  },
  modeActiveSuc(data){
    console.log(data)
  },
  modeActiveFail(){

  },
  showMode() {
    this.setData({
      showModeBool: !this.data.showModeBool
    })
  },
  // 水位设置
  showWater() {
    this.setData({
      showWaterBool: !this.data.showWaterBool
    })
  },
  water1(e) {
    this.setData({
      'waterData.water1': e.detail.value
    })
  },
  water2(e) {
    this.setData({
      'waterData.water2': e.detail.value
    })
  },
  water3(e) {
    this.setData({
      'waterData.water3': e.detail.value
    })
  },
  water4(e) {
    this.setData({
      'waterData.water4': e.detail.value
    })
  },
  setSub(){
    console.log(this.data.waterData);
    let token = wx.getStorageSync("access_token");
    let setValue='';
    setValue = this.data.waterData.water1 + "," + this.data.waterData.water2 + ",0," + this.data.waterData.water3 + ",0,0," + this.data.waterData.water4;
    console.log(setValue);
    call.request('api/device/controlDevice?access_token=' + token + '&deviceNo=' + this.data.deviceNo + '&orderNo=SetLevel&orderValue=' + setValue + '&orderSource=WeChat', {}, this.setSubSuc, this.setSubFail)
  },
  setSubSuc(data){
    console.log(data)
  },
  setSubFail(){

  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    wx.navigateTo({
      url: '../deviceInfo/deviceInfo',
    })
  },
  controltap(e) {
    // console.log(e.controlId)
  },
  onReady() {

  },
  initDevice() {
    let token = wx.getStorageSync("access_token");
    let params = {};
    params.deviceTypeCode = getApp().globalData.deviceTypeCode;
    params.deviceNo = '';
    params.deviceStatus = '';
    params.zoneNo = '';
    params.deviceName = '';
    params.workStatus = '';
    params.manufactor = '';
    params.deviceModel = '';
    call.getData('/api/device/getDeviceList?access_token=' + token + '&deviceTypeCode=' + params.deviceTypeCode + '&deviceNo=' + params.deviceNo + '&deviceStatus=' + params.deviceStatus + '&zoneNo=' + params.zoneNo + '&deviceName=' + params.deviceName + '&workStatus=' + params.workStatus + '&manufactor=' + params.manufactor + '&deviceModel=' + params.deviceModel, this.getDeviceSuc, this.getDeviceFail);
  },
  getDeviceSuc(data) {
    console.log(data);
        let that=this;
        let address='';
        var latitude = data.data[0].latitude // 纬度，浮点数，范围为90 ~ -90
        var longitude = data.data[0].longitude // 经度，浮点数，范围为180 ~ -180
    console.log(latitude)
    console.log(longitude)
        //根据经纬度获取所在城市
        qqmapsdk.reverseGeocoder({
          location: { latitude: latitude, longitude: longitude },
          success: function (res) {
            console.log(res)
            //address 城市
            address = res.result.address;
            // that.setData({ address: res.result.address_component.city })
            // wx.showToast({
            //   title: `当前位置： ` + that.data.address,
            //   icon: 'none'
            // });
            data.data[0].truePosition = address;
            that.setData({
              deviceDetail: data.data[0]
            });
          }
        });
    
    // console.log(data.data[0])
    
   
    // deviceNo有了
    
    if (data.code === "200") {
      let onLineN = 0,
        outLineN = 0,
        badN = 0;
      let onLineP = '',
        outLineP = '',
        badP = '';
      let dat = data.data;
      for (let i = 0, len = dat.length; i < len; i++) {
        if (dat[i].workStatus === '104') {
          // 104  故障
          badN++;
        }
        if (dat[i].workStatus === '102') {
          // 102  正常
        }
        if (dat[i].deviceStatus === '404') {
          // 404  离线
          outLineN++
        }
        if (dat[i].deviceStatus === '100') {
          // 100  在线
          onLineN++
        }
      }
      onLineP = onLineN / (onLineN + outLineN) * 100 + '%';
      outLineP = outLineN / (onLineN + outLineN) * 100 + '%';
      badP = badN / (onLineN + outLineN + badN) * 100 + '%';
      console.log(onLineP, outLineP, badP)
      let onLineObj = {
        status: '在线',
        onlineNum: onLineN,
        statusPercentage: onLineP
      }
      let outLineObj = {
        status: '离线',
        onlineNum: outLineN,
        statusPercentage: outLineP
      }
      let badObj = {
        status: '故障',
        onlineNum: badN,
        statusPercentage: badP
      }
      let arrInfo = [];
      arrInfo.push(onLineObj);
      arrInfo.push(outLineObj);
      arrInfo.push(badObj);
      this.setData({
        statusInfo: arrInfo
      });
    }
    //  点击标记点
    let token = wx.getStorageSync("access_token");
    call.getData('api/device/deviceOrder?access_token=' + token + '&deviceNo=' + this.data.deviceNo, this.deviceDetailSuc, this.deviceDetailFail);
  },
  getDeviceFail() {
    console.log('失败料')
  },

  
  initDeviceDetail() {
    console.log(this.data.deviceNo);
    let token = wx.getStorageSync("access_token");
    call.getData('api/device/deviceOrder?access_token=' + token + '&deviceNo=' + this.data.deviceNo, this.deviceDetailSuc, this.deviceDetailFail);
  },
  deviceDetailSuc(data) {
    console.log(data);
  },
  deviceDetailFail() {
    
  },

  initArg() {
    let token = wx.getStorageSync("access_token");
    // console.log(this.data.deviceNo)
    call.getData('api/order/getDeviceAttr?access_token=' + token + '&deviceNo=' + this.data.deviceNo, this.initArgSuc, this.initArgFail);
  },
  initArgSuc(data) {
    console.log(data);
    if (!(!data.data && typeof (data.data) != "undefined" && data.data != 0)){
      console.log(data);
      let dat = data.data
      this.setData({ argData: dat  });
      let ws = dat.workStatus;
      if (ws === 'S0') {
        console.log(0)
        this.setData({ 'argStatus.workStatus':'系统 Ready'})
      }
      if (ws === 'S1') {
        console.log(0)
        this.setData({ 'argStatus.workStatus': '补水中' })
      }
      if (ws === 'S2') {
        console.log(0)
        this.setData({ 'argStatus.workStatus': '加热中' })
      }
      if (ws === 'S3') {
        console.log(0)
        this.setData({ 'argStatus.workStatus': '制冷中' })
      }
      if (ws === 'S4') {
        console.log(0)
        this.setData({ 'argStatus.workStatus': '出杯中' })
      }
      if (ws === 'S5') {
        console.log(0)
        this.setData({ 'argStatus.workStatus': '故障' })
      }
      if (ws === 'S6') {
        console.log(0)
        this.setData({ 'argStatus.workStatus': '缺粉预警' })
      }
      if (ws === 'S7') {
        console.log(0)
        this.setData({ 'argStatus.workStatus': '缺粉报警(对应饮料停止出杯)' })
      }
      if (ws === 'S8') {
        console.log(0)
        this.setData({ 'argStatus.workStatus': '强制加热温度预警' })
      }
      if (ws === 'S9') {
        console.log(0)
        this.setData({ 'argStatus.workStatus': '强制加热温度报警(停止出杯)' })
      }
      this.setData({ slider1: dat.hotTemSet });
      this.setData({ slider2: dat.coolTemSet });
      this.setData({ slider3: dat.rawBoxTemSet});
      return;
    }
    console.log(6546546546454654646)
    
  },
  initArgFail() {
    console.log('失败咯')
  },
  lockDevice() {
    this.setData({
      lockDeviceBool: !this.data.lockDeviceBool
    });
    let lockValue = '0';
    console.log(this.data.lockDeviceBool)
    if (this.data.lockDeviceBool) {
      lockValue = '0';
    } else {
      lockValue = '1';
    }

    let token = wx.getStorageSync("access_token");
    call.request('api/device/controlDevice?access_token=' + token + '&deviceNo=' + this.data.deviceNo + '&orderNo=SetLock&orderValue=' + lockValue +'&orderSource=WeChat', {}, this.lockDeviceSuc, this.lockDeviceFail)

  },
  lockDeviceSuc(data) {
    console.log(data);
  },
  lockDeviceFail() {

  },
  initModeList(){
    let token = wx.getStorageSync("access_token");
    call.getData('api/device/deviceOrder?access_token=' + token + '&deviceNo=' + this.data.deviceNo, this.initModeListSuc, this.initModeListFail);
  },
  initModeListSuc(data){
    console.log(data);
    let modeArr = data.data.deviceOrderDtos;
    console.log(modeArr)
    for (let i = 0, len = modeArr.length; i < len; i++) {
      if (modeArr[i].orderCode == "PayOK") {
        this.setData({ 'modeList.dabei': modeArr[i].orderCode })
      }
      if (modeArr[i].orderCode == "SetTemp") {
        this.setData({ 'modeList.wendu': modeArr[i].orderCode })
      }
      if (modeArr[i].orderCode == "SetLevel") {
        this.setData({ 'modeList.shuiwei': modeArr[i].orderCode })
      }
      if (modeArr[i].orderCode == "SetMode") {
        this.setData({ 'modeList.mode': modeArr[i].orderCode })
      }
      if (modeArr[i].orderCode == "SetLock") {
        this.setData({ 'modeList.lock': modeArr[i].orderCode })
      }
    }

    console.log(this.data.modeList)
    // this.setData({ modeList: data.deviceOrderDtos})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({deviceNo:app.globalData.deviceNo});
    
    
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'NI2BZ-VRPKJ-UNVFS-FOZFQ-65IEV-GFFE5'
    }),
    this.initDevice();
    this.initModeList()
    this.initArg();
    // this.initModeList();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})