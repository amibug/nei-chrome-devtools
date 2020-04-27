/*
 * @Author: hzwuyuedong
 * @Date: 2018-12-17 15:38:50
 * @Last Modified by:   hzwuyuedong
 * @Last Modified time: 2018-12-17 15:38:50
 */

"use strict";
import parse from 'url-parse';
import { checkPathEnable } from '../util';

const MOCK_SERVER_DOMAIN = 'https://nei.hz.netease.com'
let panelWindow = null;

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.type === 'xmlhttprequest' && details.url && details.url.indexOf(MOCK_SERVER_DOMAIN) === -1) {
      const urlObj = (parse(details.url, true) || {});
      const path = urlObj.pathname
        .replace('/weapi', '/api'); // 兼容music加密
      // 判断是否命中缓存
      const check = checkPathEnable(path);
      if (check.flag) {
        let q = '';
        const keys = Object.keys(urlObj.query);
        keys.forEach(k => {
          q = q + `${k}=${urlObj.query[k]}`;
        });
        const url = path + (q === '' ? q : `?${q}`);
        return { redirectUrl: `${MOCK_SERVER_DOMAIN}/api/apimock/${check.key}${url}` };
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

if ("panels" in chrome.devtools) {
  chrome.devtools.panels.create(
    "NEI",
    "icons/.png",
    "devtools-panel.html",
    panel => {
      panel.onShown.addListener(window => {
        panelWindow = window;
      });
      panel.onHidden.addListener(window => {
        panelWindow = null;
      });
      if (panel.onSearch) {
        panel.onSearch.addListener((eventName, queryString) => {
          if (panelWindow)
            panelWindow.postMessage({ type: eventName, queryString }, "*");
        });
      }
    }
  );
}
