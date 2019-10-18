// pages/map/map.js
// let Charts = require('../../libs/wxcharts.js');
const call = require("../../utils/request.js")
var app = getApp()

// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.js');
var wxMarkerData = [];

Page({
  data: {
    // 百度地图
    markers: [],
    latitude: '',
    longitude: '',
    placeData: {},
    scale:5,

    // showDrinksBool: false,
    // showWenDuBool: false,
    // showModeBool: false,
    // showWaterBool: false,
    // showMarkInfoBool: false,
    // drinksIndex: 100,

    // 初始化区域选项
    fater: [],
    children1: [],
    children2: [],
    children3: [],
    bindChangeArr:[0,0,0],
    pickBool:false,
    areaVal:'所有区域',
    // value:'',

    // 统计
    selectArray4: [],
    selectArray5: [],
    // 下拉树（区域）
    allList:[],   //所有区域
    treeData: {
      zoneName: '所有区域',
      id: 0,
      childMenus: [{
        zoneName: '',
        id: 6
      }]
    },
    // 立即搜索表单
    searchData: {
      deviceTypeCode: '',
      deviceNo: '',
      deviceName: '',
      manufactor: '',
      deviceModel: '',
      zoneNo: '',
      deviceStatus: '',
      workStatus: ''

    },
    statusInfo: [{
        status: '在线',
        onlineNum: '0',
        statusPercentage: '0%'
      },
      {
        status: '离线',
        onlineNum: '0',
        statusPercentage: '0%'
      },
      {
        status: '故障',
        onlineNum: '0',
        statusPercentage: '0%'
      }
    ],
    areaRole:[],
    areaData:{},
    dataVal:[0,0,0,0,0,0,0],
    initBool: false,

    // controls: [{
    //   id: 1,
    //   iconPath: '../../public/img/mytree/xiaLa.png',
    //   position: {
    //     left: 250,
    //     top: 100,
    //     width: 60,
    //     height: 60
    //   },
    //   clickable: true
    // }, {
    //   id: 2,
    //     iconPath: '../../public/img/mytree/shangLa.png',
    //   position: {
    //     left: 250,
    //     top: 160,
    //     width: 60,
    //     height: 60
    //   },
    //   clickable: true
    // }],
    // markers: [],
    polyline: [{
      points: [],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    // controls: [],
    // 打开搜索框
    showBool: false
  },

  // 打开搜索框
  openSearch() {

    this.setData({
      showBool: true
    })
  },
  // 关闭搜索框
  hideSearch() {
    this.setData({
      showBool: false
    })
  },

  selectedTab(e) {
    let index = e.currentTarget.dataset['index'];
    this.setData({
      temperatureTabIndex: index
    });
  },

  onMyevent(e) {
    console.log(e.detail.zoneName);
    this.setData({
      'treeData.zoneName': e.detail.zoneName
    })
    // this.mytree.toggle(e)
  },


  regionchange(e) {
    // console.log(e.type)
  },
  makertap(e){
    let markers=this.data.markers;
    for(let i=0,len=markers.length;i<len;i++){
      if (e.markerId==markers[i].id){
        app.globalData.deviceNo = markers[i].deviceNo;
      }
    }
    wx.navigateTo({
      url: '../deviceInfo/deviceInfo',
    })
  },

  includePointsFn: function (Point1, Point2) {
    // 缩放视野展示所有经纬度(小程序API提供)
    this.mapCtx.includePoints({
      padding: [80, 50, 80, 50],
      points: [Point1, Point2]
    })
  },
  onReady() {
    this.mapCtx = wx.createMapContext('map'); // map为地图的id
  },
  initDevice(params = {}) {
    this.setData({
      initBool: false
    });
    let token = wx.getStorageSync("access_token");
    console.log(Object.keys(params) + '---------')
    if (Object.keys(params).length != 0) {
      console.log(params + '|||||||')
    } else {
      params.deviceTypeCode = getApp().globalData.deviceTypeCode;
      params.deviceNo = '';
      params.deviceStatus = '';
      params.zoneNo = '';
      params.deviceName = '';
      params.workStatus = '';
      params.manufactor = '';
      params.deviceModel = '';
    }
    console.log(params)
    call.getData('/api/device/getDeviceList?access_token=' + token + '&deviceTypeCode=' + params.deviceTypeCode + '&deviceNo=' + params.deviceNo + '&deviceStatus=' + params.deviceStatus + '&zoneNo=' + params.zoneNo + '&deviceName=' + params.deviceName + '&workStatus=' + params.workStatus + '&manufactor=' + params.manufactor + '&deviceModel=' + params.deviceModel, this.getDeviceSuc, this.getDeviceFail);
  },
  getDeviceSuc(data) {
    this.setData({
      initBool: true
    });
    console.log(data)
    let dad = data.data;
    let onLineN = 0,
      outLineN = 0,
      badN = 0;
    let onLineP = '',
      outLineP = '',
      badP = '';
    let bool = (!dad && typeof(dad) != "undefined" && dad != 0) || dad.length < 1;
    if (bool) {
      // 空数据
      this.setData({
        markers: []
      });
    } else {
      let dataArr = [];
      let obj = {};
      let icon='';
      for (let i = 0, len = data.data.length; i < len; i++) {
        if (data.data[i].deviceStatus == '100' && data.data[i].workStatus == '102') {
          icon = 'map_dot_good.png';
        } 
        if (data.data[i].deviceStatus == '100' && data.data[i].workStatus == '104') {
          icon = 'map_dot_bad.png';
        } 
        if (data.data[i].deviceStatus == '404') {
          console.log(data.data[i])
          icon = 'map_dot_out.png'
        } 

        
        obj = {
          iconPath: "../../images/"+icon,
          id: i,
          latitude: Number(data.data[i].latitude),
          longitude: Number(data.data[i].longitude),
          width: 20,
          height: 20,
          deviceNo:data.data[i].deviceNo
        }
        dataArr.push(obj);
      }
      console.log(this.data.markers)
      this.setData({
        markers: dataArr
      });
      console.log(this.data.markers)
      this.setData({
        deviceDetail: data.data[0]
      });
      this.setData({
        deviceNo: data.data[0].deviceNo
      });

      for (let i = 0, len = dad.length; i < len; i++) {
        if (dad[i].workStatus === '104') {
          // 104  故障
          badN++;
        }
        if (dad[i].workStatus === '102') {
          // 102  正常
        }
        if (dad[i].deviceStatus === '404') {
          // 404  离线
          outLineN++
        }
        if (dad[i].deviceStatus === '100') {
          // 100  在线
          onLineN++
        }
      }
    }
    this.hideSearch();
    onLineP = (isNaN(onLineN / (onLineN + outLineN) * 100) ? '0' : onLineN / (onLineN + outLineN) * 100) ;
    outLineP = (isNaN(outLineN / (onLineN + outLineN) * 100) ? '0' : outLineN / (onLineN + outLineN) * 100) ;
    badP = (isNaN(badN / (onLineN + outLineN) * 100) ? '0' : badN / (onLineN + outLineN) * 100)


    let onLineObj = {
      status: '在线',
      onlineNum: onLineN,
      statusPercentage: parseInt(onLineP)  + '%'
    }
    let outLineObj = {
      status: '离线',
      onlineNum: outLineN,
      statusPercentage: parseInt(outLineP)  + '%'
    }
    let badObj = {
      status: '故障',
      onlineNum: badN,
      statusPercentage: parseInt(badP)  + '%'
    }
    let arrInfo = [];
    arrInfo.push(onLineObj);
    arrInfo.push(outLineObj);
    arrInfo.push(badObj);
    this.setData({
      statusInfo: arrInfo
    });
    // }
    //  点击标记点
    let token = wx.getStorageSync("access_token");
    call.getData('api/device/deviceOrder?access_token=' + token + '&deviceNo=' + this.data.deviceNo, this.deviceDetailSuc, this.deviceDetailFail);
  },
  getDeviceFail() {
    console.log('失败料')
  },
  initOpt() {
    let token = wx.getStorageSync("access_token");
    call.getData('api/dictInfo/getDictList?access_token=' + token + '&dictCode=dict_type_netstatus', this.netstatusSuc, this.netstatusFail)
    call.getData('api/dictInfo/getDictList?access_token=' + token + '&dictCode=dict_type_workstatus', this.workstatusSuc, this.workstatusFail)
  },
  // 成功回调
  netstatusSuc(data) {
    let dat = data.data;
    dat[0].text = dat[0].dictName;
    dat[1].text = dat[1].dictName;
    let obj = {
      dictCode: "dict_type_netstatus",
      dictDescription: "",
      dictId: "",
      dictName: "",
      dictValue: "",
      enable: true,
      text: "所有"
    }
    dat.unshift(obj)
    this.setData({
      selectArray4: dat
    })
  },

  // 失败回调
  netstatusFail() {
    console.log('失败料');
  },
  // 成功回调
  workstatusSuc(data) {
    let dat = data.data;
    console.log(dat)
    dat[0].text = dat[0].dictName;
    dat[1].text = dat[1].dictName;
    dat[2].text = dat[2].dictName;
    let obj = {
      dictCode: "dict_type_workstatus",
      dictDescription: "",
      dictId: "",
      dictName: "",
      dictValue: "",
      enable: true,
      text: "所有"
    }
    dat.unshift(obj)
    
    this.setData({
      selectArray5: dat
    })
  },
  // 失败回调
  workstatusFail() {

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
    call.request('api/device/controlDevice?access_token=' + token + '&deviceNo=' + this.data.deviceNo + '&orderNo=SetLock&orderValue=' + lockValue, {}, this.lockDeviceSuc, this.lockDeviceFail)

  },
  

  // 填写搜索表单
  deviceNoM(e) {
    this.setData({
      'searchData.deviceNo': e.detail.value
    })
  },
  deviceNameM(e) {
    this.setData({
      'searchData.deviceName': e.detail.value
    })
  },
  manufactorM(e) {
    this.setData({
      'searchData.manufactor': e.detail.value
    })
  },
  deviceModelM(e) {
    this.setData({
      'searchData.deviceModel': e.detail.value
    })
  },
  controltap(e){
    var that = this;
    console.log(e)
    console.log("scale===" + this.data.scale)
    if (e.controlId === 1) {
      that.setData({
        scale: --this.data.scale
      })
    } else {
      that.setData({
        scale: ++this.data.scale
      })
    }
  },
  // 立即搜索
  searchMarkes() {

    let wordStatus = getApp().globalData.wordStatus;
    let netStatus = getApp().globalData.netStatus;
    let deviceTypeCode = getApp().globalData.deviceTypeCode;

  
    if (typeof(netStatus.dictValue) == "undefined") {
      netStatus.dictValue = ''
    }
    this.setData({
      'searchData.deviceStatus': netStatus.dictValue
    });
    if (typeof(wordStatus.dictValue) == "undefined") {
      wordStatus.dictValue = ''
    }
    this.setData({
      'searchData.workStatus': wordStatus.dictValue
    });
    this.setData({
      'searchData.deviceTypeCode': deviceTypeCode
    });

    console.log(this.data.searchData)
    this.initDevice(this.data.searchData)

    this.setData({ areaVal: '所有区域' })
    this.setData({ 'searchData.zoneNo':''})

  },

  lockDeviceSuc(data) {
    console.log(data);
  },
  lockDeviceFail() {

  },
  // 点击区域
  showPick(){
    // this.pickBool
    this.setData({ pickBool:!this.data.pickBool})
  },
  // 初始化区域选项
  initAreaOpt() {
    let token = wx.getStorageSync("access_token");
    call.getData('api/zone/getZoneList?access_token=' + token, this.areaOptSuc, this.areaOptFail);
  },
  // 递归区域
  recursion(data){
    console.log(data);
    let fater=[];
    for(let i=0,len=data.length;i<len;i++){
      if ((!data[i].highLevelNo && typeof (data[i].highLevelNo) != "undefined" && data[i].highLevelNo != 0) || data[i].highLevelNo===""){
        fater.push(data[i]);
      }
    }
    console.log(fater)
    this.setData({ allList:data})
    for(let u=0,lenu=fater.length;u<lenu;u++){
      this.getChild(fater[u])
    }
    console.log(fater)
    // this.data.areaRole.push(fater);
    let obj = {
      descriptions: "",
      enable: true,
      highLevelName: "",
      highLevelNo: "",
      zoneId: "",
      zoneName: "所有区域",
      zoneNo: ""
    }
    fater.unshift(obj);
    console.log(fater)
    this.setData({ 'areaRole[0]':fater})
    console.log(this.data.areaRole)
    return fater;
  },
  // 递归获得子集
  getChild(item){
    let data=this.data.allList;
    item.childMenus=[];
    let bol=false;
    for (var key in item) {
      if(key=='childMenus'){
        bol=true;
      }
    }
    if(!bol){
      item.childMenus=[];
    }
    for (let i = 0, len = data.length;i<len;i++){
      if (data[i].highLevelNo==item.zoneNo){
        console.log(data[i].zoneNo)
        item.childMenus.push(data[i]);
        console.log(item)
        this.getChild(data[i]);
      }
    }
  },
  areaOptSuc(data) {
    this.setData({ areaData:data.data});
    
    var tree=this.recursion(data.data);
    console.log(tree);

    this.setData({
      'treeData.childMenus': tree
    });
    let data1 = this.data.areaRole[0][0];
    this.getData1(data1,1);
  },
  getData1(data1,code){
    if(code==1){
      if (!!data1.childMenus && data1.childMenus.length > 0) {
        this.setData({ 'areaRole[1]': data1.childMenus });
        data1 = this.data.areaRole[1][0];
        code++;
      }else{
        this.setData({ 'areaRole[1]': [] });
        this.setData({ 'areaRole[2]': [] });
        this.setData({ 'areaRole[3]': [] });
        this.setData({ 'areaRole[4]': [] });
        this.setData({ 'areaRole[5]': [] });
        this.setData({ 'areaRole[6]': [] });
      }
    }
    if (code == 2) {
      if (!!data1.childMenus && data1.childMenus.length > 0) {
        this.setData({ 'areaRole[2]': data1.childMenus });
        data1 = this.data.areaRole[2][0];
        code++;
      } else {
        this.setData({ 'areaRole[2]': [] });
        this.setData({ 'areaRole[3]': [] });
        this.setData({ 'areaRole[4]': [] });
        this.setData({ 'areaRole[5]': [] });
        this.setData({ 'areaRole[6]': [] });
      }
    }
    if (code == 3) {
      if (!!data1.childMenus && data1.childMenus.length > 0) {
        this.setData({ 'areaRole[3]': data1.childMenus });
        data1 = this.data.areaRole[3][0];
        code++;
      } else {
        this.setData({ 'areaRole[3]': [] });
        this.setData({ 'areaRole[4]': [] });
        this.setData({ 'areaRole[5]': [] });
        this.setData({ 'areaRole[6]': [] });
      }
    }
    if (code == 4) {
      if (!!data1.childMenus && data1.childMenus.length > 0) {
        this.setData({ 'areaRole[4]': data1.childMenus });
        data1 = this.data.areaRole[4][0];
        code++;
      } else {
        this.setData({ 'areaRole[4]': [] });
        this.setData({ 'areaRole[5]': [] });
        this.setData({ 'areaRole[6]': [] });
      }
    }
    if (code == 5) {
      if (!!data1.childMenus && data1.childMenus.length > 0) {
        this.setData({ 'areaRole[5]': data1.childMenus });
        data1 = this.data.areaRole[5][0];
        code++;
      } else {
        this.setData({ 'areaRole[5]': [] });
        this.setData({ 'areaRole[6]': [] });
      }
    }
    if (code == 6) {
      if (!!data1.childMenus && data1.childMenus.length > 0) {
        this.setData({ 'areaRole[6]': data1.childMenus });
        data1 = this.data.areaRole[6][0];
        code++;
      }
    }
    // areaVal
    this.setData({ 'areaVal': data1.zoneName })
    this.setData({ 'searchData.zoneNo': data1.zoneNo})
    console.log(data1);
    console.log(this.data.searchData);
  },
  areaOptFail() {
    console.log('失败料')
  },
  // 初始化区域选项
  initArea() {
    let tree = this.data.dataTree;
    let arr1 = [];
    for (let i = 0, len = tree.length; i < len; i++) {
      this.data.fater.push(tree[i]);
    }

  },
  doBtn(e){
    console.log(e);
    this.setData({pickBool:!this.data.pickBool});
    let who = e.currentTarget.dataset.btn;

    this.setData({ 'areaRole[1]': [] });
    this.setData({ 'areaRole[2]': [] });
    this.setData({ 'areaRole[3]': [] });
    this.setData({ 'areaRole[4]': [] });
    this.setData({ 'areaRole[5]': [] });
    this.setData({ 'areaRole[6]': [] });
    // if (who === 'sure') {
    //   // console.log(this.data.children1);
    //   if (!!this.data.children1 && this.data.children1.length>0){
    //     let zoneNo = this.data.children1[this.data.bindChangeArr[1]].zoneNo;
    //     // console.log(zoneNo)
        
    //     this.data.searchData.zoneNo = zoneNo;
    //     this.setData({ 'searchData.zoneNo': zoneNo });
    //     // console.log(this.data.searchData.zoneNo)
    //     this.setData({ 'areaVal': this.data.children1[this.data.bindChangeArr[1]].zoneName});
    //     this.setData({ children1:[]});
    //   }else{
        
    //     let zoneNo = this.data.treeData.childMenus[this.data.bindChangeArr[0]].zoneNo;
    //     console.log(zoneNo)
    //     this.data.searchData.zoneNo = zoneNo;
    //     this.setData({ 'searchData.zoneNo': zoneNo });
    //     this.setData({ 'areaVal': this.data.treeData.childMenus[this.data.bindChangeArr[0]].zoneName });
        
    //   }
    //   return;
    // }


  },
  bindChange: function (e) {
    // console.log(this.data.value)
    const val = e.detail.value;
    console.log(val);
    let code1=val[0];
    if (code1 != this.data.dataVal[0]&&code1!=0){
      let data1 = this.data.areaRole[0][code1];
      this.getData1(data1, 1);
      this.setData({dataVal: val});
      return;
    }

    let code2 = val[1];
    if (code2 != this.data.dataVal[1] &&code2 != 0) {
      let data2 = this.data.areaRole[1][code2];
      this.getData1(data2, 2);
      this.setData({ dataVal: val });
      return;
    }
    let code3 = val[2];
    if (code3 != this.data.dataVal[2]&&code3 != 0) {
      let data3 = this.data.areaRole[2][code3];
      this.getData1(data3, 3);
      this.setData({ dataVal: val });
      return;
    }
    let code4 = val[3];
    if (code4 != this.data.dataVal[3]&&code4 != 0) {
      let data4 = this.data.areaRole[3][code4];
      this.getData1(data4, 4);
      this.setData({ dataVal: val });
      return;
    }
    let code5 = val[4];
    if (code5 != this.data.dataVal[4] && code5 != 0) {
      let data5 = this.data.areaRole[4][code5];
      this.getData1(data5, 5);
      this.setData({ dataVal: val });
      return;
    }
    let code6 = val[5];
    if (code6 != this.data.dataVal[5] && code6 != 0) {
      let data6 = this.data.areaRole[5][code6];
      this.getData1(data6, 6);
      this.setData({ dataVal: val });
      return;
    }

    let code7 = val[6];
    if (code7 != this.data.dataVal[6] && code6 != 0) {
      let data6 = this.data.areaRole[5][code6];
      this.getData1(data6, 6);
      this.setData({ dataVal: val });
      return;
    }
    let data7 = this.data.areaRole[0][0];
    this.getData1(data7, 1);
    this.setData({ dataVal: val });
  },


  zoomEnd(e){
    
    console.log(e.causedBy)
    console.log(e.type)
    
  },
  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      placeData: {
        title: '名称：' + data[i].title + '\n',
        address: '地址：' + data[i].address + '\n',
        telephone: '电话：' + data[i].telephone
      }
    });
  }, 
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../images/map_dot_bad.png";
      } else {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../images/map_dot_bad.png";
      }
      markers[j](data[j]);
    }
    that.setData({
      markers: markers
    });
  },
  onLoad() {
    
    var BMap = new bmap.BMapWX({
      ak: 'zzBbMfVOTrvmhkZGYVLpQFnvHzWSacgK'
    });
    this.initDevice();
    // this.initBiduMap()
    this.initOpt();
    this.initAreaOpt();
    // this.queryCategoryList();
    // this.initDeviceDetail();
  }
})