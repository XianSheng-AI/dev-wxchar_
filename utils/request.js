var app = getApp();
const host = 'http://wwhl-iot.com/client_plat/';

/* POST请求， 
 * URL：接口
 * postData：参数
 * json 类型 
 * doSuccess：成功的回调函数 
 * doFail：失败的回调函数 
 */

function login(url, postData, doSuccess, doFail) {
  wx.request({
    url: host + url,
    header: {
      "content-type": "application/json;charset=UTF-8",
      'Authorization': "Basic Y2xpZW50Ondhbnd1aHVsaWFu" 
    },
    data: postData,
    method: 'POST',
    success: function (res) {
      doSuccess(res.data);
    },
    fail: function (err) {
      console.log(err)
      doFail();
    },
  })
}
function request(url, _this, postData, doSuccess, doFail) {
  wx.request({
    url: host + url,
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    data: postData,
    method: 'POST',
    success: function (res) {
      doSuccess(res.data);
    },
    fail: function () {
      doFail();
    },
  })
}
//GET请求，不需传参，直接URL调用，
function getData(url, doSuccess, doFail) {
  wx.request({ 
    url: host + url,
    header: { 
      "content-type": "application/json;charset=UTF-8"
    },
    method: 'GET',
    success (res) { 
      doSuccess(res.data); 
    },
    fail: function() {
      doFail(); 
    }
  })
}
// 导出方法
module.exports.request = request;
module.exports.getData = getData;
module.exports.login = login;