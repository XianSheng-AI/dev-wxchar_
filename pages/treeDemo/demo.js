// pages/treeDemo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    treeData: {
      text: 'My Tree',
      id: 0,
      childMenus: [
        {
          text: 'Parent 1',
          id: 1,
          childMenus: [
            {
              text: 'Child 1',
              id: 2,
              childMenus: [
                {
                  text: 'Grandchild 1',
                  id: 3,
                },
                {
                  text: 'Grandchild 2',
                  id: 4,
                },
              ]
            },
            {
              text: 'Child 2',
              id: 5,
            }
          ]
        },
        {
          text: 'Parent 2',
          id: 6,
          childMenus: [
            {
              text: 'Child 1',
              id: 7,
            },
            {
              text: 'Child 2',
              id: 8,
            }
          ]
        }
      ]
    }
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