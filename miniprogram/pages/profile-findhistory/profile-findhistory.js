const MAX_LIMIT = 10
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    findList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this._getListByCloudFn()
    this._getListByMiniprogram()
  },

  _getListByCloudFn() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'find',
      data: {
        $url: 'getListByOpenid',
        start: this.data.findList.length,
        count: MAX_LIMIT
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        findList: this.data.findList.concat(res.result)
      })

      wx.hideLoading()
    })
  },

  _getListByMiniprogram() {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('find').skip(this.data.findList.length)
      .limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then((res) => {
        console.log(res)
        let _findlist = res.data
        for (let i = 0, len = _findlist.length; i < len; i++) {
          _findlist[i].createTime = _findlist[i].createTime.toString()
        }

        this.setData({
          findList: this.data.findList.concat(_findlist)
        })

        wx.hideLoading()
      })

  },

  goComment(event) {
    wx.navigateTo({
      url: `../find-comment/find-comment?findId=${event.target.dataset.findid}`,
    })
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
    // this._getListByCloudFn()
    this._getListByMiniprogram()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
    const find = event.target.dataset.find
    return {
      title: find.content,
      path: `/pages/find-comment/find-comment?findId=${find._id}`
    }
  }
})