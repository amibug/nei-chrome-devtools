/*
 * @Author: hzwuyuedong
 * @Date: 2018-12-17 15:38:38
 * @Last Modified by:   hzwuyuedong
 * @Last Modified time: 2018-12-17 15:38:38
 */

'use strict';
/**
 * 注入劫持 ajax 类型的异步请求
 */

export default function mock(getAjaxMockUrl) {
  // mock xmlhttp
  const xhr = window.XMLHttpRequest ? window.XMLHttpRequest : new window.ActiveXObject('MSXML2.XMLHTTP.3.0');
  xhr.prototype._mcOpen = xhr.prototype.open;
  xhr.prototype.open = function (method, url, async, username, password) {
    // var mockUrl = getAjaxMockUrl(url);
    this._mcOpen(method, mockUrl ? mockUrl : url, async, username, password);
    if (mockUrl) {
      this.withCredentials = true; // 添加xhr允许跨域标识
    }
  };

  // mock fetch
  var rawFetch = window.fetch;
  if (rawFetch) {
    window.fetch = function (url, options) {
      // var mockUrl = getAjaxMockUrl(url);
      if (mockUrl) {
        options = options || {};
        options.credentials = 'include';
        options.mode = 'cors'; // 添加fetch允许跨域标识
      }
      return rawFetch(mockUrl ? mockUrl : url, options);
    };
  }
};
