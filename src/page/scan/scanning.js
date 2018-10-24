import Vue from 'vue';

const hybrid = {
  install(Vue, options) {
// 添加实例方法
    Vue.prototype.$hybrid = this
// 添加全局方法或属性
    Vue.Hybrid = this
  },
  request: function (params) {
// 发送 scheme 协议，webview 会进行对应的解析
// 这部分就是网上很多，通过 iframe 来发送协议
// 处理有回调的情况，把回调函数保存到 Hybrid 对象上。
    if (params.callback && typeof params.callback === 'function') {
// 生成唯一执行函数，执行后销毁
      let callbackId = (new Date().getTime()) + '_';
      let callbackName = 'hybrid_' + params.tagname + '_' + callbackId
      let tmpFn;

      tmpFn = params.callback // 临时保存回调函数内容
      params.callback = callbackName;

      window.Hybrid[callbackName] = function (data) {
        console.log(params.tagname + '-hybrid请求响应-' + new Date().getTime())

        tmpFn(data)
      }
    }
    postRequest(params)

  },
// 统一的 android 回调接口 会在回调队列中进行查找
  callback: function (data) {
    var callbackId = data.callback
    if (!callbackId) return
    if (typeof data === 'string') data = JSON.parse(data)
    window.Hybrid[callbackId] && window.Hybrid[callbackId](data.data || {}, data)
    return true;
  }
}

// 发送到 window 对象上
window.Hybrid = hybrid
if (window.Vue) { // 自动绑定
  window.Vue.use(hybrid)
}

export default hybrid
export const install = hybrid.install
