// pages/login/login.js
const call = require("../../utils/request.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account:{
      userName: '',
      password: ''
    }
  },

  userName(e) {
    let val = e.detail.value;
    this.setData({'account.userName':val})
  },
  password(e) {
    let val = e.detail.value;
    this.setData({ 'account.password': val })
  },
  login(){
    let params=this.data.account;
    call.login('oauth/token?grant_type=password&username='+params.userName+'&password='+params.password,this.shuffleSuc,this.fail);
  },
  shuffleSuc(data){
    console.log(data)
    wx.setStorage({
      key: 'access_token',         
      data: data.access_token  
    })
    console.log(data)
    wx.setStorage({
      key: 'token_type',
      data: data.token_type
    })
    wx.getStorage({
      key: 'token_type',
      success: function(res) {
        console.log(res)
      },
    })
    wx.switchTab({
      url: '../device/device',
    })
  },
  fail: function () {
    wx.switchTab({
      url: '../device/device',
    })
    console.log("失败")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
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