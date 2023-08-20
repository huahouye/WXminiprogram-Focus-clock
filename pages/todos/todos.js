Page({
  data: {
    input: '',
    todo_list: [],
    leftCount: 0,
    allCompleted: false,
    todo_logs: [],
    toastHidden: true,
  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '待办清单'
    })

  },

  save: function () {
    wx.setStorageSync('todo_list', this.data.todo_list)
    wx.setStorageSync('todo_logs', this.data.todo_logs)
  },

  load: function () {
    var todo_list = wx.getStorageSync('todo_list')
    if (todo_list) {
      var leftCount = todo_list.filter(function (item) {
        return !item.completed
      }).length
      this.setData({ todo_list: todo_list, leftCount: leftCount })
    }
    var todo_logs = wx.getStorageSync('todo_logs')
    if (todo_logs) {
      this.setData({ todo_logs: todo_logs })
    }
  },

  onLoad: function () {
    this.load()
  },

  inputChangeHandle: function (e) {
    this.setData({ input: e.detail.value })
  },

  addTodoHandle: function (e) {
    if (!this.data.input || !this.data.input.trim()) return
    var todo_list = this.data.todo_list
    todo_list.push({ name: this.data.input, completed: false })
    var todo_logs = this.data.todo_logs
    todo_logs.push({ timestamp: new Date(), action: 'Add', name: this.data.input })
    this.setData({
      input: '',
      todo_list: todo_list,
      leftCount: this.data.leftCount + 1,
      todo_logs: todo_logs
    })
    this.save()
  },

  toggleTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todo_list = this.data.todo_list
    todo_list[index].completed = !todo_list[index].completed
    var todo_logs = this.data.todo_logs
    todo_logs.push({
      timestamp: new Date(),
      action: todo_list[index].completed ? 'Finish' : 'Restart',
      name: todo_list[index].name
    })
    this.setData({
      todo_list: todo_list,
      leftCount: this.data.leftCount + (todo_list[index].completed ? -1 : 1),
      todo_logs: todo_logs
    })
    this.save()

  },

  removeTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todo_list = this.data.todo_list
    var remove = todo_list.splice(index, 1)[0]
    var todo_logs = this.data.todo_logs
    todo_logs.push({ timestamp: new Date(), action: 'Remove', name: remove.name })
    this.setData({
      todo_list: todo_list,
      leftCount: this.data.leftCount - (remove.completed ? 0 : 1),
      todo_logs: todo_logs
    })
    this.save()
  },

  toggleAllHandle: function (e) {
    this.data.allCompleted = !this.data.allCompleted
    var todo_list = this.data.todo_list
    for (var i = todo_list.length - 1; i >= 0; i--) {
      todo_list[i].completed = this.data.allCompleted
    }
    var todo_logs = this.data.todo_logs
    todo_logs.push({
      timestamp: new Date(),
      action: this.data.allCompleted ? 'Finish' : 'Restart',
      name: 'All todos'
    })
    this.setData({
      todo_list: todo_list,
      leftCount: this.data.allCompleted ? 0 : todo_list.length,
      todo_logs: todo_logs
    })
    this.save()
    wx.vibrateShort()
  },
  
  clearCompletedHandle: function (e) {
    var todo_list = this.data.todo_list
    var remains = []
    for (var i = 0; i < todo_list.length; i++) {
      todo_list[i].completed || remains.push(todo_list[i])
    }
    var todo_logs = this.data.todo_logs
    todo_logs.push({
      timestamp: new Date(),
      action: 'Clear',
      name: 'Completed todo'
    })
    this.setData({ todo_list: remains, todo_logs: todo_logs })
    this.save()
    this.setData({
      toastHidden: false
    })
  wx.vibrateShort()
  },
  hideToast: function() {
    this.setData({
      toastHidden: true
    })
  },
  onShareAppMessage: function (res) {

    if (res.from ==='button') {
      // 来自页面内转发按钮
      console.log(res.target)
      return {
        title:'管理时间，保持专注！让自律成为习惯！',
         path: '/pages/index/index',
        imageUrl:'/image/share.jpg' //不设置则默认为当前页面的截图
      }
    }
  },
    onShareTimeline: function (res){
        return{  
          title: '管理时间，保持专注，让自律成为习惯！',
          query: {   
            // key: 'value' //要携带的参数 
          },  
          imageUrl: '/image/about.png'   
        }    
      }
   
})
