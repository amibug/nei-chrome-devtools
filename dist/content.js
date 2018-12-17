/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/content/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/content/index.js":
/*!******************************!*\
  !*** ./src/content/index.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mock */ "./src/content/mock.js");
/*
 * @Author: hzwuyuedong
 * @Date: 2018-12-17 15:38:31
 * @Last Modified by:   hzwuyuedong
 * @Last Modified time: 2018-12-17 15:38:31
 */

Object(_mock__WEBPACK_IMPORTED_MODULE_0__["default"])();

/***/ }),

/***/ "./src/content/mock.js":
/*!*****************************!*\
  !*** ./src/content/mock.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return mock; });
/*
 * @Author: hzwuyuedong
 * @Date: 2018-12-17 15:38:38
 * @Last Modified by:   hzwuyuedong
 * @Last Modified time: 2018-12-17 15:38:38
 */

/**
 * 注入劫持 ajax 类型的异步请求
 */

function mock(getAjaxMockUrl) {
  // mock xmlhttp
  var xhr = window.XMLHttpRequest ? window.XMLHttpRequest : new window.ActiveXObject('MSXML2.XMLHTTP.3.0');
  xhr.prototype._mcOpen = xhr.prototype.open;

  xhr.prototype.open = function (method, url, async, username, password) {
    // var mockUrl = getAjaxMockUrl(url);
    this._mcOpen(method, mockUrl ? mockUrl : url, async, username, password);

    if (mockUrl) {
      this.withCredentials = true; // 添加xhr允许跨域标识
    }
  }; // mock fetch


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
}
;

/***/ })

/******/ });
//# sourceMappingURL=content.js.map