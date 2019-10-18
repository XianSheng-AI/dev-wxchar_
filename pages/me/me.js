// pages/me/me.js
const call = require("../../utils/request.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showFixBool:false,
    newWordRepeat:'',
    fixData:{
      oldWord:'',
      newWord:''
    }
  },
  /**
   * 点击修改密码
   */
  showFix(){
    
    this.setData({ showFixBool: !this.data.showFixBool })
  },
  oldPassword(e){
    this.setData({ 'fixData.oldWord': e.detail.value})
  },
  newPassword(e) {
    this.setData({ 'fixData.newWord': e.detail.value })
  },
  newPassword_(e) {
    this.setData({ 'newWordRepeat': e.detail.value })
  },

  fixPassword(){
    if (!this.data.fixData.oldWord || !this.data.fixData.newWord || !this.data.newWordRepeat){
      wx.showToast({
        title: '请完善修改密码信息!',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.newWordRepeat!==this.data.fixData.newWord){
      console.log("密码不一致!");
      wx.showToast({
        title: '密码不一致!',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // /api/appInfo / fixPassword
    console.log(this.data.fixData)
    let token = wx.getStorageSync("access_token");
    call.request('api/appInfo/fixPassword?access_token=' + token + '&oldWord=' + this.data.fixData.oldWord + '&newWord=' + this.data.fixData.newWord, {}, this.fixPasswordSuc, this.fixPasswordFail);
  },
  fixPasswordSuc(data){
    console.log('这是成功回调!')
  },
  fixPasswordFail(data){
    console.log('这是失败回调!')
    let tip = '';
    if (data.data) {
      this.setData({ showFixBool: !this.data.showFixBool });
      tip = '修改成功!';
    } else {
      tip = '修改失败!';
    }
    wx.showToast({
      title: tip,
      icon: 'success',
      duration: 2000
    })
    // NI2BZ - VRPKJ - UNVFS - FOZFQ - 65IEV - GFFE5
  },
  showAboutUs(){
    wx.navigateTo({
      url: '../about-us/index'
    })
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