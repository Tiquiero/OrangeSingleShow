// pages/find/find.js

let keyword = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
    findList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadFindList()
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
    this.setData({
      findList: []
    })
    this._loadFindList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadFindList(this.data.findList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    let findObj = event.target.dataset.find
    return {
      title: findObj.content,
      // path: `/pages/find-comment/find-comment?findId=${findObj._id}`,
      // imageUrl: ''
    }
  },

  _loadFindList(start = 0) {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'find',
      data: {
        keyword,
        start,
        count: 10,
        $url: 'findList',
      }
    }).then((res) => {
      this.setData({
        findList: this.data.findList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  // 发布功能
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalShow: true,
          })
        }
      }
    })
  },

  onLoginSuccess(event) {
    const detail = event.detail
    wx.navigateTo({
      url: `../find-edit/find-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },

  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },

  onSearch(event) {
    this.setData({
      findList: []
    })
    keyword = event.detail.keyword
    this._loadFindList(0)
  },

  goComment(event) {
    wx.navigateTo({
      url: '../../pages/find-detail/find-detail?findId=' + event.target.dataset.findid,
    })
  },
})