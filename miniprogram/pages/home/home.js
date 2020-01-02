const MAX_LIMIT = 15
const db = wx.cloud.database()
import regeneratorRuntime from '../../utils/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reolayPicList: [],
    content: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHomeData()
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

  getHomeData: function () {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'getIndexData',
      data: {
        $url: 'replayPicList',
      }
    }).then((res) => {
      this.setData({
        reolayPicList: res.result.data
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })

    wx.cloud.callFunction({
      name: 'getIndexData',
      data: {
        $url: 'content',
      }
    }).then((res) => {
      this.setData({
        content: res.result.data
      })
      console.log(res)
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  }
})