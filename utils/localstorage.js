const logs_focus_key = 'logs_focus_key';
function saveFocusLogs(log) {
  var logs = wx.getStorageSync(logs_focus_key) || [];
  logs.unshift(log);
  wx.setStorageSync(logs_focus_key, logs);
}
function getFocusLogs(log) {
  var logs = wx.getStorageSync(logs_focus_key) || []
  return logs;
}

module.exports = {
  saveFocusLogs, getFocusLogs,
}