Page({
  data: {
    input: '',
    randomselects: [],
    leftCount: 0,
    allCompleted: false,
    randomselect_logs: [],
    chosen_one_logs: [],
    toastHidden: true,
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '随机选'
    })

  },

  save: function () {
    wx.setStorageSync('randomselect_list', this.data.randomselects)
    wx.setStorageSync('randomselect_logs', this.data.randomselect_logs)
    wx.setStorageSync('chosen_one_logs', this.data.chosen_one_logs)
  },

  load: function () {
    var randomselects = wx.getStorageSync('randomselect_list')
    if (randomselects) {
      var leftCount = randomselects.filter(function (item) {
        return !item.completed
      }).length
      this.setData({ randomselects: randomselects, leftCount: leftCount })
    }
    var logs = wx.getStorageSync('randomselect_logs')
    if (logs) {
      this.setData({ randomselect_logs: logs })
    }
  },

  onLoad: function () {
    this.load()
  },

  inputChangeHandle: function (e) {
    this.setData({ input: e.detail.value })
  },

  addItemHandle: function (e) {
    if (!this.data.input || !this.data.input.trim()) return
    var randomselects = this.data.randomselects
    randomselects.push({ name: this.data.input, completed: false })
    var logs = this.data.randomselect_logs
    logs.push({ timestamp: new Date(), action: 'Add', name: this.data.input })
    this.setData({
      input: '',
      randomselects: randomselects,
      leftCount: this.data.leftCount + 1,
      randomselect_logs: logs
    })
    this.save()
  },

  toggleItemHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var randomselects = this.data.randomselects
    randomselects[index].completed = !randomselects[index].completed
    var logs = this.data.randomselect_logs
    logs.push({
      timestamp: new Date(),
      action: randomselects[index].completed ? 'Finish' : 'Restart',
      name: randomselects[index].name
    })
    this.setData({
      randomselects: randomselects,
      leftCount: this.data.leftCount + (randomselects[index].completed ? -1 : 1),
      randomselect_logs: logs
    })
    this.save()
  },

  removeItemHandle: function (e) {
    let thiz = this;
    wx.showModal({
      title: '提示',
      content: '确定删除',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var index = e.currentTarget.dataset.index
          var randomselects = thiz.data.randomselects
          var remove = randomselects.splice(index, 1)[0]
          var logs = thiz.data.randomselect_logs
          logs.push({ timestamp: new Date(), action: 'Remove', name: remove.name })
          thiz.setData({
            randomselects: randomselects,
            leftCount: thiz.data.leftCount - (remove.completed ? 0 : 1),
            randomselect_logs: logs
          })
          thiz.save()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  toggleAllHandle: function (e) {
    this.data.allCompleted = !this.data.allCompleted
    var randomselects = this.data.randomselects
    for (var i = randomselects.length - 1; i >= 0; i--) {
      randomselects[i].completed = this.data.allCompleted
    }
    var logs = this.data.randomselect_logs
    logs.push({
      timestamp: new Date(),
      action: this.data.allCompleted ? 'Finish' : 'Restart',
      name: 'All randomselects'
    })
    this.setData({
      randomselects: randomselects,
      leftCount: this.data.allCompleted ? 0 : randomselects.length,
      randomselect_logs: logs
    })
    this.save()
    wx.vibrateShort()
  },

  startHandle: function (e) {
    var rand = Math.floor(Math.random() * this.data.randomselects.length);
    var ri = this.data.randomselects[rand];
    while (ri.completed) {
      rand = Math.floor(Math.random() * this.data.randomselects.length);
      ri = this.data.randomselects[rand];
    }

    wx.showLoading({
      title: '抽取中 ...',
    });
    var thiz = this;
    setTimeout(function () {
      wx.hideLoading()
      wx.showModal({
        title: '随机选中了：',
        content: ri.name,
        cancelText: "重来",
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            var logs = thiz.data.chosen_one_logs
            logs.push({
              timestamp: new Date(),
              name: ri.name
            })
            thiz.setData({
              chosen_one_logs: logs
            })
            thiz.save()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }, 2000);
  },

  hideToast: function () {
    this.setData({
      toastHidden: true
    })
  },
  onShareAppMessage: function (res) {

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      return {
        title: '管理时间，保持专注！让自律成为习惯！',
        path: '/pages/index/index',
        imageUrl: '/image/share.jpg' //不设置则默认为当前页面的截图
      }
    }
  },
  onShareTimeline: function (res) {
    return {
      title: '管理时间，保持专注，让自律成为习惯！',
      query: {
        // key: 'value' //要携带的参数 
      },
      imageUrl: '/image/about.png'
    }
  }

})
