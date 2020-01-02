import formatTime from '../../utils/formatTime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    find: {},
    commentList: [],
    findId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      findId: options.findId
    })
    this._getFindDetail()
  },

  _getFindDetail() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    wx.cloud.callFunction({
      name: 'find',
      data: {
        findId: this.data.findId,
        $url: 'detail',
      }
    }).then((res) => {
      let commentList = res.result.commentList.data
      for (let i = 0, len = commentList.length; i < len; i++) {
        commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
      }


      this.setData({
        commentList,
        find: res.result.detail[0],
      })

      wx.hideLoading()
    })
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
    const find = this.data.find
    return {
      title: find.content,
      path: `/pages/find-comment/find-comment?findId=${find._id}`,

    }
  }
})