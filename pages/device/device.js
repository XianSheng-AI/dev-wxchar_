// pages/device/device.js
const call = require("../../utils/request.js");
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList:[]
  },

  showDevice:function (e){
    let code = e.currentTarget.dataset['code'];
    app.globalData.deviceTypeCode = code;

    wx.navigateTo({
      url: '../map/map',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('access_token');
    call.getData('api/device/getDeviceTypeList?access_token='+token, this.doSuccess,this.doFail)
  },
  doSuccess(data){
    this.setData({deviceList:data.data});
    console.log(data);
    
  },
  doFail(){
    this.setData({ deviceList: data.data });
    console.log('失败了')
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