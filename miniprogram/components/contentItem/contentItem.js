// components/contentItem.js
import formatTime from '../../utils/formatTime.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: Object
  },

  observers: {
    ['itemData.updateTime'](val) {
      this.setData({
        _updateTime: formatTime(new Date(), 'yyyy-MM-dd')
      })
    } 
  },

  /**
   * 组件的初始数据
   */
  data: {
    _updateTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
