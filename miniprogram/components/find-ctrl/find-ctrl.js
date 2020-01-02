// components/find-ctrl/find-ctrl.js
import formatTime from '../../utils/formatTime.js'

let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    findId: String,
    find: Object,
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],

  /**
   * 组件的初始数据
   */
  data: {
    // 登录组件是否显示
    loginShow: false,
    // 底部弹出层是否显示
    modalShow: false,
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                // 显示评论弹出层
                this.setData({
                  modalShow: true,
                })
              }
            })
          } else {
            this.setData({
              loginShow: true,
            })
          }
        }
      })
    },

    onLoginsuccess(event) {
      userInfo = event.detail
      // 授权框消失，评论框显示
      this.setData({
        loginShow: false,
      }, () => {
        this.setData({
          modalShow: true,
        })
      })
    },

    onLoginfail() {
      wx.showModal({
        title: '授权用户才能进行评价',
        content: '',
      })
    },

    onInputChange(e) {
      this.setData({ content: e.detail.value })
    },

    onSend(e) {
      const content = this.data.content;
      const findId = this.properties.findId;
      const _this = this;
      wx.requestSubscribeMessage({
        tmplIds: ['4CtYNADmGcR12HC4Jim1ay7Gjyoijv9ds525fn5yTD8'],
        success(res) {
          if (res.errMsg === 'requestSubscribeMessage:ok') {
            // 插入数据库
            if (content.trim() == '') {
              wx.showModal({
                title: '评论内容不能为空',
                content: '',
              })
              return
            }
            wx.showLoading({
              title: '评论中',
              mask: true,
            })
            db.collection('find-comment').add({
              data: {
                content,
                createTime: db.serverDate(),
                findId,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl
              }
            }).then((res) => {
              // 推送模板消息
              wx.cloud.callFunction({
                name: 'sendMessage',
                data: {
                  findId: _this.properties.findId,
                  data: {
                    name2: {
                      value: userInfo.nickName
                    },
                    thing3: {
                      value: content
                    },
                    date4: {
                      value: formatTime(new Date(), 'yyyy-MM-dd')
                    }
                  },
                  templateId: '4CtYNADmGcR12HC4Jim1ay7Gjyoijv9ds525fn5yTD8',
                }
              }).then((res) => {
                console.log(res)
                wx.hideLoading()
                wx.showToast({
                  title: '评论成功',
                })
                _this.setData({
                  modalShow: false,
                  content: '',
                })

                // 父元素刷新评论页面
                _this.triggerEvent('refreshCommentList')
              })
              .catch(() => {
                wx.showToast({
                  title: '评论失败'
                });
              });
            })
          }
        }
      })
    },
  }
})