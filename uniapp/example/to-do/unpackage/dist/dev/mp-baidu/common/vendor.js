(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!***********************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-baidu/dist/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _swan$getSystemInfoSy =




  swan.getSystemInfoSync(),platform = _swan$getSystemInfoSy.platform,pixelRatio = _swan$getSystemInfoSy.pixelRatio,windowWidth = _swan$getSystemInfoSy.windowWidth; // uni=>swan runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


// 不支持的 API 列表
var todos = [
'hideKeyboard',
'onGyroscopeChange',
'startGyroscope',
'stopGyroscope',
'openBluetoothAdapter',
'startBluetoothDevicesDiscovery',
'onBluetoothDeviceFound',
'stopBluetoothDevicesDiscovery',
'onBluetoothAdapterStateChange',
'getConnectedBluetoothDevices',
'getBluetoothDevices',
'getBluetoothAdapterState',
'closeBluetoothAdapter',
'writeBLECharacteristicValue',
'readBLECharacteristicValue',
'onBLEConnectionStateChange',
'onBLECharacteristicValueChange',
'notifyBLECharacteristicValueChange',
'getBLEDeviceServices',
'getBLEDeviceCharacteristics',
'createBLEConnection',
'closeBLEConnection',
'onBeaconServiceChange',
'onBeaconUpdate',
'getBeacons',
'startBeaconDiscovery',
'stopBeaconDiscovery',
'hideShareMenu',
'onWindowResize',
'offWindowResize',
'vibrate'];


// 存在兼容性的 API 列表
var canIUses = [];

function createTodoMethod(contextName, methodName) {
  return function unsupported() {
    console.error("\u767E\u5EA6\u5C0F\u7A0B\u5E8F ".concat(contextName, "\u6682\u4E0D\u652F\u6301").concat(methodName));
  };
}

function _handleEnvInfo(result) {
  result.miniProgram = {
    appId: result.appKey };

  result.plugin = {
    version: result.sdkVersion };

}

// 需要做转换的 API 列表
var protocols = {
  request: {
    args: function args(fromArgs) {
      // TODO
      // data 不支持 ArrayBuffer
      // method 不支持 TRACE, CONNECT
      return {
        method: 'method',
        dataType: function dataType(type) {
          return {
            name: 'dataType',
            value: type === 'json' ? type : 'string' };

        } };

    } },

  connectSocket: {
    args: {
      method: false } },


  previewImage: previewImage,
  getRecorderManager: {
    returnValue: function returnValue(fromRet) {
      fromRet.onFrameRecorded = createTodoMethod('RecorderManager', 'onFrameRecorded');
    } },

  getBackgroundAudioManager: {
    returnValue: function returnValue(fromRet) {
      fromRet.onPrev = createTodoMethod('BackgroundAudioManager', 'onPrev');
      fromRet.onNext = createTodoMethod('BackgroundAudioManager', 'onNext');
    } },

  scanCode: {
    args: {
      onlyFromCamera: false,
      scanType: false } },


  navigateToMiniProgram: {
    name: 'navigateToSmartProgram',
    args: {
      appId: 'appKey',
      envVersion: false } },


  navigateBackMiniProgram: {
    name: 'navigateBackSmartProgram' },

  showShareMenu: {
    name: 'openShare' },

  getAccountInfoSync: {
    name: 'getEnvInfoSync',
    returnValue: _handleEnvInfo } };



var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u767E\u5EA6\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u767E\u5EA6\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = swan[options.name || methodName].apply(swan, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['baidu'],
  share: ['baidu'],
  payment: ['baidu'],
  push: ['baidu'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });


function requestPayment(params) {
  var parseError = false;
  if (typeof params.orderInfo === 'string') {
    try {
      params.orderInfo = JSON.parse(params.orderInfo);
    } catch (e) {
      parseError = true;
    }
  }
  if (parseError) {
    params.fail && params.fail({
      errMsg: 'requestPayment:fail: 参数 orderInfo 数据结构不正确，参考：https://uniapp.dcloud.io/api/plugins/payment?id=orderinfo' });

  } else {
    swan.requestPolymerPayment(params);
  }
}

var api = /*#__PURE__*/Object.freeze({
  requestPayment: requestPayment });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-baidu","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "swan".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  {
    if (
    defaultValue === false &&
    Array.isArray(type) &&
    type.length === 2 &&
    type.indexOf(String) !== -1 &&
    type.indexOf(Boolean) !== -1)
    {// [String,Boolean]=>Boolean
      if (file) {
        console.warn("props.".concat(
        key, ".type should use Boolean instead of [String,Boolean] at ").concat(file));

      }
      return Boolean;
    }
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type, value, file);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts, null, file);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  {// mp-baidu，checked=>value
    if (
    isPlainObject(event.detail) &&
    hasOwn(event.detail, 'checked') &&
    !hasOwn(event.detail, 'value'))
    {
      event.detail.value = event.detail.checked;
    }
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-baidu";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属
  var parentVm = $children.find(function (childVm) {return childVm.$scope._$vueId === vuePid;});
  if (parentVm) {
    return parentVm;
  }
  // 反向递归查找
  for (var i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

var mocks = ['nodeId', 'componentName'];

function isPage() {
  return !this.ownerId;
}

function initRelation(detail) {
  this.dispatch('__l', detail);
}

function parseApp(vm) {
  // 百度 onShow 竟然会在 onLaunch 之前
  var appOptions = parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

  appOptions.onShow = function onShow(args) {
    if (!this.$vm) {
      this.onLaunch(args);
    }
    this.$vm.__call_hook('onShow', args);
  };
  return appOptions;
}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

var newLifecycle = swan.canIUse('lifecycle-2-0');

function parseComponent(vueOptions) {
  var componentOptions = parseBaseComponent(vueOptions, {
    isPage: isPage,
    initRelation: initRelation });


  // 关于百度小程序生命周期的说明(组件作为页面时):
  // lifetimes:attached --> methods:onShow --> methods:onLoad --> methods:onReady
  // 这里在强制将onShow挪到onLoad之后触发,另外一处修改在page-parser.js
  var oldAttached = componentOptions.lifetimes.attached;
  componentOptions.lifetimes.attached = function attached() {
    oldAttached.call(this);
    if (isPage.call(this)) {// 百度 onLoad 在 attached 之前触发
      // 百度 当组件作为页面时 pageinstancce 不是原来组件的 instance
      this.pageinstance.$vm = this.$vm;
      if (hasOwn(this.pageinstance, '_$args')) {
        this.$vm.$mp.query = this.pageinstance._$args;
        this.$vm.__call_hook('onLoad', this.pageinstance._$args);
        this.$vm.__call_hook('onShow');
        delete this.pageinstance._$args;
      }
    } else {
      // 百度小程序组件不触发methods内的onReady
      if (this.$vm) {
        this.$vm._isMounted = true;
        this.$vm.__call_hook('mounted');
      }
    }
  };

  if (newLifecycle) {
    delete componentOptions.lifetimes.ready;
    componentOptions.methods.onReady = function () {
      if (this.$vm) {
        this.$vm._isMounted = true;
        this.$vm.__call_hook('mounted');
        this.$vm.__call_hook('onReady');
      }
    };
  }

  componentOptions.messages = {
    '__l': componentOptions.methods['__l'] };

  delete componentOptions.methods['__l'];

  return componentOptions;
}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function detached($vm) {
  $vm.$children.forEach(function (childVm) {
    childVm.$scope.detached();
  });
  $vm.$scope.detached();
}

function onPageUnload($vm) {
  $vm.$destroy();
  $vm.$children.forEach(function (childVm) {
    detached(childVm);
  });
}

function parsePage(vuePageOptions) {
  var pageOptions = parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });


  // 纠正百度小程序生命周期methods:onShow在methods:onLoad之前触发的问题
  pageOptions.methods.onShow = function onShow() {
    if (this.$vm && this.$vm.$mp.query) {
      this.$vm.__call_hook('onShow');
    }
  };

  pageOptions.methods.onLoad = function onLoad(args) {
    // 百度 onLoad 在 attached 之前触发，先存储 args, 在 attached 里边触发 onLoad
    if (this.$vm) {
      this.$vm.$mp.query = args;
      this.$vm.__call_hook('onLoad', args);
      this.$vm.__call_hook('onShow');
    } else {
      this.pageinstance._$args = args;
    }
  };

  pageOptions.methods.onUnload = function onUnload() {
    this.$vm.__call_hook('onUnload');
    onPageUnload(this.$vm);
  };

  return pageOptions;
}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!swan.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-baidu" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(swan, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, swan[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(swan).forEach(function (name) {
    if (hasOwn(swan, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, swan[name]));
    }
  });
}

swan.createApp = createApp;
swan.createPage = createPage;
swan.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),
/* 2 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.10
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.10';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-baidu","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-baidu","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-baidu","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-baidu","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    console.error(err);
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope) {
        return this.$scope[method](args)
      }
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!*************************************************!*\
  !*** /Users/mehaotian/Desktop/to-do/pages.json ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-baidu"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-baidu/dist/index.js */ 1)["default"]))

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@^2.0.0-alpha-24420191128001","_id":"@dcloudio/uni-stat@2.0.0-v3-24020191018001","_inBundle":false,"_integrity":"sha512-nYBm5pRrYzrj2dKMqucWSF2PwInUMnn3MLHM/ik3gnLUEKSW61rzcY1RPlUwaH7c+Snm6N+bAJzmj3GvlrlVXA==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"@dcloudio/uni-stat@^2.0.0-alpha-24420191128001","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"^2.0.0-alpha-24420191128001","saveSpec":null,"fetchSpec":"^2.0.0-alpha-24420191128001"},"_requiredBy":["/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-v3-24020191018001.tgz","_shasum":"6ef04326cc0b945726413eebe442ab8f47c7536c","_spec":"@dcloudio/uni-stat@^2.0.0-alpha-24420191128001","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"197e8df53cc9d4c3f6eb722b918ccf51672b5cfe","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-v3-24020191018001"};

/***/ }),
/* 7 */
/*!******************************************************************!*\
  !*** /Users/mehaotian/Desktop/to-do/pages.json?{"type":"style"} ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "todo", "component": true, "usingComponents": {} } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "uni-app", "navigationBarBackgroundColor": "#F8F8F8", "backgroundColor": "#F8F8F8" } };exports.default = _default;

/***/ }),
/* 8 */
/*!*****************************************************************!*\
  !*** /Users/mehaotian/Desktop/to-do/pages.json?{"type":"stat"} ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__C75F581" };exports.default = _default;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ })
]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRjbG91ZGlvL3VuaS1tcC1iYWlkdS9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZGNsb3VkaW8vdnVlLWNsaS1wbHVnaW4tdW5pL3BhY2thZ2VzL21wLXZ1ZS9kaXN0L21wLnJ1bnRpbWUuZXNtLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BkY2xvdWRpby91bmktc3RhdC9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMvbWVoYW90aWFuL0Rlc2t0b3AvdG8tZG8vcGFnZXMuanNvbiIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvcnVudGltZS9jb21wb25lbnROb3JtYWxpemVyLmpzIl0sIm5hbWVzIjpbIl90b1N0cmluZyIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiaGFzT3duUHJvcGVydHkiLCJpc0ZuIiwiZm4iLCJpc1N0ciIsInN0ciIsImlzUGxhaW5PYmplY3QiLCJvYmoiLCJjYWxsIiwiaGFzT3duIiwia2V5Iiwibm9vcCIsImNhY2hlZCIsImNhY2hlIiwiY3JlYXRlIiwiY2FjaGVkRm4iLCJoaXQiLCJjYW1lbGl6ZVJFIiwiY2FtZWxpemUiLCJyZXBsYWNlIiwiXyIsImMiLCJ0b1VwcGVyQ2FzZSIsIkhPT0tTIiwiZ2xvYmFsSW50ZXJjZXB0b3JzIiwic2NvcGVkSW50ZXJjZXB0b3JzIiwibWVyZ2VIb29rIiwicGFyZW50VmFsIiwiY2hpbGRWYWwiLCJyZXMiLCJjb25jYXQiLCJBcnJheSIsImlzQXJyYXkiLCJkZWR1cGVIb29rcyIsImhvb2tzIiwiaSIsImxlbmd0aCIsImluZGV4T2YiLCJwdXNoIiwicmVtb3ZlSG9vayIsImhvb2siLCJpbmRleCIsInNwbGljZSIsIm1lcmdlSW50ZXJjZXB0b3JIb29rIiwiaW50ZXJjZXB0b3IiLCJvcHRpb24iLCJrZXlzIiwiZm9yRWFjaCIsInJlbW92ZUludGVyY2VwdG9ySG9vayIsImFkZEludGVyY2VwdG9yIiwibWV0aG9kIiwicmVtb3ZlSW50ZXJjZXB0b3IiLCJ3cmFwcGVySG9vayIsImRhdGEiLCJpc1Byb21pc2UiLCJ0aGVuIiwicXVldWUiLCJwcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJjYWxsYmFjayIsIndyYXBwZXJPcHRpb25zIiwib3B0aW9ucyIsIm5hbWUiLCJvbGRDYWxsYmFjayIsImNhbGxiYWNrSW50ZXJjZXB0b3IiLCJ3cmFwcGVyUmV0dXJuVmFsdWUiLCJyZXR1cm5WYWx1ZSIsInJldHVyblZhbHVlSG9va3MiLCJnZXRBcGlJbnRlcmNlcHRvckhvb2tzIiwic2xpY2UiLCJzY29wZWRJbnRlcmNlcHRvciIsImludm9rZUFwaSIsImFwaSIsInBhcmFtcyIsImludm9rZSIsInByb21pc2VJbnRlcmNlcHRvciIsImNhdGNoIiwiU1lOQ19BUElfUkUiLCJDT05URVhUX0FQSV9SRSIsIkNBTExCQUNLX0FQSV9SRSIsImlzQ29udGV4dEFwaSIsInRlc3QiLCJpc1N5bmNBcGkiLCJpc0NhbGxiYWNrQXBpIiwiaGFuZGxlUHJvbWlzZSIsImVyciIsInNob3VsZFByb21pc2UiLCJwcm9taXNpZnkiLCJwcm9taXNlQXBpIiwic3VjY2VzcyIsImZhaWwiLCJjb21wbGV0ZSIsInJlamVjdCIsImFzc2lnbiIsImZpbmFsbHkiLCJjb25zdHJ1Y3RvciIsInZhbHVlIiwicmVhc29uIiwiRVBTIiwiQkFTRV9ERVZJQ0VfV0lEVEgiLCJpc0lPUyIsImRldmljZVdpZHRoIiwiZGV2aWNlRFBSIiwiY2hlY2tEZXZpY2VXaWR0aCIsInN3YW4iLCJnZXRTeXN0ZW1JbmZvU3luYyIsInBsYXRmb3JtIiwicGl4ZWxSYXRpbyIsIndpbmRvd1dpZHRoIiwidXB4MnB4IiwibnVtYmVyIiwibmV3RGV2aWNlV2lkdGgiLCJOdW1iZXIiLCJyZXN1bHQiLCJNYXRoIiwiZmxvb3IiLCJpbnRlcmNlcHRvcnMiLCJiYXNlQXBpIiwiZnJlZXplIiwicHJldmlld0ltYWdlIiwiYXJncyIsImZyb21BcmdzIiwiY3VycmVudEluZGV4IiwicGFyc2VJbnQiLCJjdXJyZW50IiwiaXNOYU4iLCJ1cmxzIiwibGVuIiwiZmlsdGVyIiwiaXRlbSIsImluZGljYXRvciIsImxvb3AiLCJ0b2RvcyIsImNhbklVc2VzIiwiY3JlYXRlVG9kb01ldGhvZCIsImNvbnRleHROYW1lIiwibWV0aG9kTmFtZSIsInVuc3VwcG9ydGVkIiwiY29uc29sZSIsImVycm9yIiwiX2hhbmRsZUVudkluZm8iLCJtaW5pUHJvZ3JhbSIsImFwcElkIiwiYXBwS2V5IiwicGx1Z2luIiwidmVyc2lvbiIsInNka1ZlcnNpb24iLCJwcm90b2NvbHMiLCJyZXF1ZXN0IiwiZGF0YVR5cGUiLCJ0eXBlIiwiY29ubmVjdFNvY2tldCIsImdldFJlY29yZGVyTWFuYWdlciIsImZyb21SZXQiLCJvbkZyYW1lUmVjb3JkZWQiLCJnZXRCYWNrZ3JvdW5kQXVkaW9NYW5hZ2VyIiwib25QcmV2Iiwib25OZXh0Iiwic2NhbkNvZGUiLCJvbmx5RnJvbUNhbWVyYSIsInNjYW5UeXBlIiwibmF2aWdhdGVUb01pbmlQcm9ncmFtIiwiZW52VmVyc2lvbiIsIm5hdmlnYXRlQmFja01pbmlQcm9ncmFtIiwic2hvd1NoYXJlTWVudSIsImdldEFjY291bnRJbmZvU3luYyIsIkNBTExCQUNLUyIsInByb2Nlc3NDYWxsYmFjayIsInByb2Nlc3NSZXR1cm5WYWx1ZSIsInByb2Nlc3NBcmdzIiwiYXJnc09wdGlvbiIsImtlZXBGcm9tQXJncyIsInRvQXJncyIsImtleU9wdGlvbiIsIndhcm4iLCJrZWVwUmV0dXJuVmFsdWUiLCJ3cmFwcGVyIiwicHJvdG9jb2wiLCJhcmcxIiwiYXJnMiIsImFwcGx5IiwidG9kb0FwaXMiLCJUT0RPUyIsImNyZWF0ZVRvZG9BcGkiLCJ0b2RvQXBpIiwiZXJyTXNnIiwicHJvdmlkZXJzIiwib2F1dGgiLCJzaGFyZSIsInBheW1lbnQiLCJnZXRQcm92aWRlciIsInNlcnZpY2UiLCJwcm92aWRlciIsImV4dHJhQXBpIiwiZ2V0RW1pdHRlciIsImdldFVuaUVtaXR0ZXIiLCJFbWl0dGVyIiwiVnVlIiwiY3R4IiwiJG9uIiwiYXJndW1lbnRzIiwiJG9mZiIsIiRvbmNlIiwiJGVtaXQiLCJldmVudEFwaSIsInJlcXVlc3RQYXltZW50IiwicGFyc2VFcnJvciIsIm9yZGVySW5mbyIsIkpTT04iLCJwYXJzZSIsImUiLCJyZXF1ZXN0UG9seW1lclBheW1lbnQiLCJNUFBhZ2UiLCJQYWdlIiwiTVBDb21wb25lbnQiLCJDb21wb25lbnQiLCJjdXN0b21pemVSRSIsImN1c3RvbWl6ZSIsImluaXRUcmlnZ2VyRXZlbnQiLCJtcEluc3RhbmNlIiwib2xkVHJpZ2dlckV2ZW50IiwidHJpZ2dlckV2ZW50IiwiZXZlbnQiLCJpbml0SG9vayIsIm9sZEhvb2siLCJQQUdFX0VWRU5UX0hPT0tTIiwiaW5pdE1vY2tzIiwidm0iLCJtb2NrcyIsIiRtcCIsIm1wVHlwZSIsIm1vY2siLCJoYXNIb29rIiwidnVlT3B0aW9ucyIsImRlZmF1bHQiLCJleHRlbmRPcHRpb25zIiwic3VwZXIiLCJtaXhpbnMiLCJmaW5kIiwibWl4aW4iLCJpbml0SG9va3MiLCJtcE9wdGlvbnMiLCIkdm0iLCJfX2NhbGxfaG9vayIsImluaXRWdWVDb21wb25lbnQiLCJWdWVDb21wb25lbnQiLCJleHRlbmQiLCJpbml0U2xvdHMiLCJ2dWVTbG90cyIsIiRzbG90cyIsInNsb3ROYW1lIiwiJHNjb3BlZFNsb3RzIiwiaW5pdFZ1ZUlkcyIsInZ1ZUlkcyIsInNwbGl0IiwiXyR2dWVJZCIsIl8kdnVlUGlkIiwiaW5pdERhdGEiLCJjb250ZXh0IiwibWV0aG9kcyIsInByb2Nlc3MiLCJWVUVfQVBQX0RFQlVHIiwic3RyaW5naWZ5IiwiX19saWZlY3ljbGVfaG9va3NfXyIsIlBST1BfVFlQRVMiLCJTdHJpbmciLCJCb29sZWFuIiwiY3JlYXRlT2JzZXJ2ZXIiLCJvYnNlcnZlciIsIm5ld1ZhbCIsIm9sZFZhbCIsImluaXRCZWhhdmlvcnMiLCJpbml0QmVoYXZpb3IiLCJ2dWVCZWhhdmlvcnMiLCJ2dWVFeHRlbmRzIiwidnVlTWl4aW5zIiwidnVlUHJvcHMiLCJiZWhhdmlvcnMiLCJiZWhhdmlvciIsIkRhdGUiLCJwcm9wcyIsInByb3BlcnRpZXMiLCJpbml0UHJvcGVydGllcyIsInZ1ZU1peGluIiwicGFyc2VQcm9wVHlwZSIsImRlZmF1bHRWYWx1ZSIsImZpbGUiLCJpc0JlaGF2aW9yIiwidnVlSWQiLCJzZXREYXRhIiwib3B0cyIsIndyYXBwZXIkMSIsIm1wIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJ0YXJnZXQiLCJkZXRhaWwiLCJjaGVja2VkIiwiZ2V0RXh0cmFWYWx1ZSIsImRhdGFQYXRoc0FycmF5IiwiZGF0YVBhdGhBcnJheSIsImRhdGFQYXRoIiwicHJvcFBhdGgiLCJ2YWx1ZVBhdGgiLCJ2Rm9yIiwiX19nZXRfdmFsdWUiLCJpc0ludGVnZXIiLCJ2Rm9ySXRlbSIsInZGb3JLZXkiLCJwcm9jZXNzRXZlbnRFeHRyYSIsImV4dHJhIiwiZXh0cmFPYmoiLCJnZXRPYmpCeUFycmF5IiwiYXJyIiwiZWxlbWVudCIsInByb2Nlc3NFdmVudEFyZ3MiLCJpc0N1c3RvbSIsImlzQ3VzdG9tTVBFdmVudCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwiY29tVHlwZSIsIl9fYXJnc19fIiwicmV0IiwiYXJnIiwiT05DRSIsIkNVU1RPTSIsImlzTWF0Y2hFdmVudFR5cGUiLCJldmVudFR5cGUiLCJvcHRUeXBlIiwiaGFuZGxlRXZlbnQiLCJldmVudE9wdHMiLCJldmVudE9wdCIsImV2ZW50c0FycmF5IiwiY2hhckF0IiwiaXNPbmNlIiwiZXZlbnRBcnJheSIsImhhbmRsZXJDdHgiLCIkb3B0aW9ucyIsImdlbmVyaWMiLCIkcGFyZW50IiwiaGFuZGxlciIsIkVycm9yIiwib25jZSIsInBhcnNlQmFzZUFwcCIsImluaXRSZWZzIiwic3RvcmUiLCIkc3RvcmUiLCJtcEhvc3QiLCJiZWZvcmVDcmVhdGUiLCIkc2NvcGUiLCJhcHBPcHRpb25zIiwib25MYXVuY2giLCJhcHAiLCJnbG9iYWxEYXRhIiwiX2lzTW91bnRlZCIsImZpbmRWbUJ5VnVlSWQiLCJ2dWVQaWQiLCIkY2hpbGRyZW4iLCJwYXJlbnRWbSIsImNoaWxkVm0iLCJCZWhhdmlvciIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiJHJlZnMiLCJjb21wb25lbnRzIiwic2VsZWN0QWxsQ29tcG9uZW50cyIsImNvbXBvbmVudCIsInJlZiIsImZvckNvbXBvbmVudHMiLCJoYW5kbGVMaW5rIiwicGFyZW50IiwiaXNQYWdlIiwib3duZXJJZCIsImluaXRSZWxhdGlvbiIsImRpc3BhdGNoIiwicGFyc2VBcHAiLCJvblNob3ciLCJjcmVhdGVBcHAiLCJBcHAiLCJwYXJzZUJhc2VDb21wb25lbnQiLCJ2dWVDb21wb25lbnRPcHRpb25zIiwibXVsdGlwbGVTbG90cyIsImFkZEdsb2JhbENsYXNzIiwiY29tcG9uZW50T3B0aW9ucyIsIl9fZmlsZSIsImxpZmV0aW1lcyIsImF0dGFjaGVkIiwicHJvcHNEYXRhIiwiJG1vdW50IiwicmVhZHkiLCJkZXRhY2hlZCIsIiRkZXN0cm95IiwicGFnZUxpZmV0aW1lcyIsInNob3ciLCJoaWRlIiwicmVzaXplIiwic2l6ZSIsIl9fbCIsIl9fZSIsInd4c0NhbGxNZXRob2RzIiwiY2FsbE1ldGhvZCIsIm5ld0xpZmVjeWNsZSIsImNhbklVc2UiLCJwYXJzZUNvbXBvbmVudCIsIm9sZEF0dGFjaGVkIiwicGFnZWluc3RhbmNlIiwicXVlcnkiLCJfJGFyZ3MiLCJvblJlYWR5IiwibWVzc2FnZXMiLCJob29rcyQxIiwicGFyc2VCYXNlUGFnZSIsInZ1ZVBhZ2VPcHRpb25zIiwicGFnZU9wdGlvbnMiLCJvbkxvYWQiLCJvblBhZ2VVbmxvYWQiLCJwYXJzZVBhZ2UiLCJvblVubG9hZCIsImNyZWF0ZVBhZ2UiLCJjcmVhdGVDb21wb25lbnQiLCJjYW5JVXNlQXBpIiwiYXBpTmFtZSIsInVuaSIsIlByb3h5Iiwic2V0IiwidW5pJDEiLCJTVEFUX1ZFUlNJT04iLCJTVEFUX1VSTCIsIlNUQVRfSDVfVVJMIiwiUEFHRV9QVkVSX1RJTUUiLCJBUFBfUFZFUl9USU1FIiwiT1BFUkFUSU5HX1RJTUUiLCJVVUlEX0tFWSIsIlVVSURfVkFMVUUiLCJnZXRVdWlkIiwidXVpZCIsImdldFBsYXRmb3JtTmFtZSIsInBsdXMiLCJydW50aW1lIiwiZ2V0RENsb3VkSWQiLCJnZXRTdG9yYWdlU3luYyIsIm5vdyIsInJhbmRvbSIsInNldFN0b3JhZ2VTeW5jIiwiZ2V0U2dpbiIsInN0YXREYXRhIiwic29ydEFyciIsInNvcnQiLCJzZ2luIiwic2dpblN0ciIsInNpZ24iLCJzdWJzdHIiLCJnZXRTcGxpY2luZyIsImdldFRpbWUiLCJwbGF0Zm9ybUxpc3QiLCJnZXRQYWNrTmFtZSIsInBhY2tOYW1lIiwiZ2V0VmVyc2lvbiIsImdldENoYW5uZWwiLCJwbGF0Zm9ybU5hbWUiLCJjaGFubmVsIiwiZ2V0U2NlbmUiLCJzY2VuZSIsImdldExhdW5jaE9wdGlvbnNTeW5jIiwiRmlyc3RfX1Zpc2l0X19UaW1lX19LRVkiLCJMYXN0X19WaXNpdF9fVGltZV9fS0VZIiwiZ2V0Rmlyc3RWaXNpdFRpbWUiLCJ0aW1lU3RvcmdlIiwidGltZSIsInJlbW92ZVN0b3JhZ2VTeW5jIiwiZ2V0TGFzdFZpc2l0VGltZSIsIlBBR0VfUkVTSURFTkNFX1RJTUUiLCJGaXJzdF9QYWdlX3Jlc2lkZW5jZV90aW1lIiwiTGFzdF9QYWdlX3Jlc2lkZW5jZV90aW1lIiwic2V0UGFnZVJlc2lkZW5jZVRpbWUiLCJnZXRQYWdlUmVzaWRlbmNlVGltZSIsIlRPVEFMX19WSVNJVF9fQ09VTlQiLCJnZXRUb3RhbFZpc2l0Q291bnQiLCJjb3VudCIsIkdldEVuY29kZVVSSUNvbXBvbmVudE9wdGlvbnMiLCJwcm9wIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiU2V0X19GaXJzdF9fVGltZSIsIlNldF9fTGFzdF9fVGltZSIsImdldEZpcnN0VGltZSIsImdldExhc3RUaW1lIiwiZ2V0UmVzaWRlbmNlVGltZSIsInJlc2lkZW5jZVRpbWUiLCJvdmVydGltZSIsImdldFJvdXRlIiwicGFnZXMiLCJnZXRDdXJyZW50UGFnZXMiLCJwYWdlIiwiX3NlbGYiLCJpcyIsInJvdXRlIiwiZ2V0UGFnZVJvdXRlIiwic2VsZiIsIl9xdWVyeSIsImdldFBhZ2VUeXBlcyIsImNhbGlicmF0aW9uIiwiZXZlbnROYW1lIiwiUGFnZXNKc29uIiwicmVxdWlyZSIsInN0YXRDb25maWciLCJyZXN1bHRPcHRpb25zIiwiVXRpbCIsIl9yZXRyeSIsIl9wbGF0Zm9ybSIsIl9uYXZpZ2F0aW9uQmFyVGl0bGUiLCJjb25maWciLCJyZXBvcnQiLCJsdCIsIl9vcGVyYXRpbmdUaW1lIiwiX3JlcG9ydGluZ1JlcXVlc3REYXRhIiwiX19wcmV2ZW50X3RyaWdnZXJpbmciLCJfX2xpY2F0aW9uSGlkZSIsIl9fbGljYXRpb25TaG93IiwiX2xhc3RQYWdlUm91dGUiLCJ1dCIsIm1wbiIsImFrIiwiYXBwaWQiLCJ1c3YiLCJ2IiwiY2giLCJjbiIsInBuIiwiY3QiLCJ0IiwidHQiLCJwIiwiYnJhbmQiLCJtZCIsIm1vZGVsIiwic3YiLCJzeXN0ZW0iLCJtcHNkayIsIlNES1ZlcnNpb24iLCJtcHYiLCJsYW5nIiwibGFuZ3VhZ2UiLCJwciIsInd3Iiwid2giLCJ3aW5kb3dIZWlnaHQiLCJzdyIsInNjcmVlbldpZHRoIiwic2giLCJzY3JlZW5IZWlnaHQiLCJwYXRoIiwic2MiLCJfc2VuZFJlcG9ydFJlcXVlc3QiLCJfc2VuZEhpZGVSZXF1ZXN0IiwidXJscmVmIiwidXJscmVmX3RzIiwicm91dGVwYXRoIiwidGl0bGVOVmlldyIsInRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJfc2VuZFBhZ2VSZXF1ZXN0IiwidXJsIiwiX3NlbmRFdmVudFJlcXVlc3QiLCJmdnRzIiwibHZ0cyIsInR2YyIsImdldFByb3BlcnR5IiwiZ2V0TmV0d29ya0luZm8iLCJvcHQiLCJlX24iLCJlX3YiLCJnZXROZXR3b3JrVHlwZSIsIm5ldCIsIm5ldHdvcmtUeXBlIiwiZ2V0TG9jYXRpb24iLCJ3Z3RpbmZvIiwiZ2VvY29kZSIsImFkZHJlc3MiLCJjb3VudHJ5IiwicHJvdmluY2UiLCJjaXR5IiwibGF0IiwibGF0aXR1ZGUiLCJsbmciLCJsb25naXR1ZGUiLCJ0aXRsZSIsInR0biIsInR0cGoiLCJ0dGMiLCJyZXF1ZXN0RGF0YSIsInVuaVN0YXREYXRhIiwiZmlyc3RBcnIiLCJjb250ZW50QXJyIiwibGFzdEFyciIsInJkIiwiZWxtIiwibmV3RGF0YSIsIm9wdGlvbnNEYXRhIiwicmVxdWVzdHMiLCJpbWFnZVJlcXVlc3QiLCJzZXRUaW1lb3V0IiwiX3NlbmRSZXF1ZXN0IiwiaW1hZ2UiLCJJbWFnZSIsInNyYyIsIlN0YXQiLCJpbnN0YW5jZSIsImFkZEludGVyY2VwdG9ySW5pdCIsImludGVyY2VwdExvZ2luIiwiaW50ZXJjZXB0U2hhcmUiLCJpbnRlcmNlcHRSZXF1ZXN0UGF5bWVudCIsIl9sb2dpbiIsIl9zaGFyZSIsIl9wYXltZW50IiwiX3BhZ2VTaG93IiwiX2FwcGxpY2F0aW9uU2hvdyIsIl9wYWdlSGlkZSIsIl9hcHBsaWNhdGlvbkhpZGUiLCJlbSIsImluZm8iLCJlbVZhbCIsIm1lc3NhZ2UiLCJzdGFjayIsInN0YXQiLCJnZXRJbnN0YW5jZSIsImlzSGlkZSIsImxpZmVjeWNsZSIsImxvYWQiLCJvblNoYXJlQXBwTWVzc2FnZSIsIm9sZFNoYXJlQXBwTWVzc2FnZSIsIm9uSGlkZSIsIm9uRXJyb3IiLCJtYWluIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OytMQUFBLHFFOztBQUVBLElBQU1BLFNBQVMsR0FBR0MsTUFBTSxDQUFDQyxTQUFQLENBQWlCQyxRQUFuQztBQUNBLElBQU1DLGNBQWMsR0FBR0gsTUFBTSxDQUFDQyxTQUFQLENBQWlCRSxjQUF4Qzs7QUFFQSxTQUFTQyxJQUFULENBQWVDLEVBQWYsRUFBbUI7QUFDakIsU0FBTyxPQUFPQSxFQUFQLEtBQWMsVUFBckI7QUFDRDs7QUFFRCxTQUFTQyxLQUFULENBQWdCQyxHQUFoQixFQUFxQjtBQUNuQixTQUFPLE9BQU9BLEdBQVAsS0FBZSxRQUF0QjtBQUNEOztBQUVELFNBQVNDLGFBQVQsQ0FBd0JDLEdBQXhCLEVBQTZCO0FBQzNCLFNBQU9WLFNBQVMsQ0FBQ1csSUFBVixDQUFlRCxHQUFmLE1BQXdCLGlCQUEvQjtBQUNEOztBQUVELFNBQVNFLE1BQVQsQ0FBaUJGLEdBQWpCLEVBQXNCRyxHQUF0QixFQUEyQjtBQUN6QixTQUFPVCxjQUFjLENBQUNPLElBQWYsQ0FBb0JELEdBQXBCLEVBQXlCRyxHQUF6QixDQUFQO0FBQ0Q7O0FBRUQsU0FBU0MsSUFBVCxHQUFpQixDQUFFOztBQUVuQjs7O0FBR0EsU0FBU0MsTUFBVCxDQUFpQlQsRUFBakIsRUFBcUI7QUFDbkIsTUFBTVUsS0FBSyxHQUFHZixNQUFNLENBQUNnQixNQUFQLENBQWMsSUFBZCxDQUFkO0FBQ0EsU0FBTyxTQUFTQyxRQUFULENBQW1CVixHQUFuQixFQUF3QjtBQUM3QixRQUFNVyxHQUFHLEdBQUdILEtBQUssQ0FBQ1IsR0FBRCxDQUFqQjtBQUNBLFdBQU9XLEdBQUcsS0FBS0gsS0FBSyxDQUFDUixHQUFELENBQUwsR0FBYUYsRUFBRSxDQUFDRSxHQUFELENBQXBCLENBQVY7QUFDRCxHQUhEO0FBSUQ7O0FBRUQ7OztBQUdBLElBQU1ZLFVBQVUsR0FBRyxRQUFuQjtBQUNBLElBQU1DLFFBQVEsR0FBR04sTUFBTSxDQUFDLFVBQUNQLEdBQUQsRUFBUztBQUMvQixTQUFPQSxHQUFHLENBQUNjLE9BQUosQ0FBWUYsVUFBWixFQUF3QixVQUFDRyxDQUFELEVBQUlDLENBQUosVUFBVUEsQ0FBQyxHQUFHQSxDQUFDLENBQUNDLFdBQUYsRUFBSCxHQUFxQixFQUFoQyxFQUF4QixDQUFQO0FBQ0QsQ0FGc0IsQ0FBdkI7O0FBSUEsSUFBTUMsS0FBSyxHQUFHO0FBQ1osUUFEWTtBQUVaLFNBRlk7QUFHWixNQUhZO0FBSVosVUFKWTtBQUtaLGFBTFksQ0FBZDs7O0FBUUEsSUFBTUMsa0JBQWtCLEdBQUcsRUFBM0I7QUFDQSxJQUFNQyxrQkFBa0IsR0FBRyxFQUEzQjs7QUFFQSxTQUFTQyxTQUFULENBQW9CQyxTQUFwQixFQUErQkMsUUFBL0IsRUFBeUM7QUFDdkMsTUFBTUMsR0FBRyxHQUFHRCxRQUFRO0FBQ2hCRCxXQUFTO0FBQ1BBLFdBQVMsQ0FBQ0csTUFBVixDQUFpQkYsUUFBakIsQ0FETztBQUVQRyxPQUFLLENBQUNDLE9BQU4sQ0FBY0osUUFBZDtBQUNFQSxVQURGLEdBQ2EsQ0FBQ0EsUUFBRCxDQUpDO0FBS2hCRCxXQUxKO0FBTUEsU0FBT0UsR0FBRztBQUNOSSxhQUFXLENBQUNKLEdBQUQsQ0FETDtBQUVOQSxLQUZKO0FBR0Q7O0FBRUQsU0FBU0ksV0FBVCxDQUFzQkMsS0FBdEIsRUFBNkI7QUFDM0IsTUFBTUwsR0FBRyxHQUFHLEVBQVo7QUFDQSxPQUFLLElBQUlNLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELEtBQUssQ0FBQ0UsTUFBMUIsRUFBa0NELENBQUMsRUFBbkMsRUFBdUM7QUFDckMsUUFBSU4sR0FBRyxDQUFDUSxPQUFKLENBQVlILEtBQUssQ0FBQ0MsQ0FBRCxDQUFqQixNQUEwQixDQUFDLENBQS9CLEVBQWtDO0FBQ2hDTixTQUFHLENBQUNTLElBQUosQ0FBU0osS0FBSyxDQUFDQyxDQUFELENBQWQ7QUFDRDtBQUNGO0FBQ0QsU0FBT04sR0FBUDtBQUNEOztBQUVELFNBQVNVLFVBQVQsQ0FBcUJMLEtBQXJCLEVBQTRCTSxJQUE1QixFQUFrQztBQUNoQyxNQUFNQyxLQUFLLEdBQUdQLEtBQUssQ0FBQ0csT0FBTixDQUFjRyxJQUFkLENBQWQ7QUFDQSxNQUFJQyxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCUCxTQUFLLENBQUNRLE1BQU4sQ0FBYUQsS0FBYixFQUFvQixDQUFwQjtBQUNEO0FBQ0Y7O0FBRUQsU0FBU0Usb0JBQVQsQ0FBK0JDLFdBQS9CLEVBQTRDQyxNQUE1QyxFQUFvRDtBQUNsRC9DLFFBQU0sQ0FBQ2dELElBQVAsQ0FBWUQsTUFBWixFQUFvQkUsT0FBcEIsQ0FBNEIsVUFBQVAsSUFBSSxFQUFJO0FBQ2xDLFFBQUlqQixLQUFLLENBQUNjLE9BQU4sQ0FBY0csSUFBZCxNQUF3QixDQUFDLENBQXpCLElBQThCdEMsSUFBSSxDQUFDMkMsTUFBTSxDQUFDTCxJQUFELENBQVAsQ0FBdEMsRUFBc0Q7QUFDcERJLGlCQUFXLENBQUNKLElBQUQsQ0FBWCxHQUFvQmQsU0FBUyxDQUFDa0IsV0FBVyxDQUFDSixJQUFELENBQVosRUFBb0JLLE1BQU0sQ0FBQ0wsSUFBRCxDQUExQixDQUE3QjtBQUNEO0FBQ0YsR0FKRDtBQUtEOztBQUVELFNBQVNRLHFCQUFULENBQWdDSixXQUFoQyxFQUE2Q0MsTUFBN0MsRUFBcUQ7QUFDbkQsTUFBSSxDQUFDRCxXQUFELElBQWdCLENBQUNDLE1BQXJCLEVBQTZCO0FBQzNCO0FBQ0Q7QUFDRC9DLFFBQU0sQ0FBQ2dELElBQVAsQ0FBWUQsTUFBWixFQUFvQkUsT0FBcEIsQ0FBNEIsVUFBQVAsSUFBSSxFQUFJO0FBQ2xDLFFBQUlqQixLQUFLLENBQUNjLE9BQU4sQ0FBY0csSUFBZCxNQUF3QixDQUFDLENBQXpCLElBQThCdEMsSUFBSSxDQUFDMkMsTUFBTSxDQUFDTCxJQUFELENBQVAsQ0FBdEMsRUFBc0Q7QUFDcERELGdCQUFVLENBQUNLLFdBQVcsQ0FBQ0osSUFBRCxDQUFaLEVBQW9CSyxNQUFNLENBQUNMLElBQUQsQ0FBMUIsQ0FBVjtBQUNEO0FBQ0YsR0FKRDtBQUtEOztBQUVELFNBQVNTLGNBQVQsQ0FBeUJDLE1BQXpCLEVBQWlDTCxNQUFqQyxFQUF5QztBQUN2QyxNQUFJLE9BQU9LLE1BQVAsS0FBa0IsUUFBbEIsSUFBOEI1QyxhQUFhLENBQUN1QyxNQUFELENBQS9DLEVBQXlEO0FBQ3ZERix3QkFBb0IsQ0FBQ2xCLGtCQUFrQixDQUFDeUIsTUFBRCxDQUFsQixLQUErQnpCLGtCQUFrQixDQUFDeUIsTUFBRCxDQUFsQixHQUE2QixFQUE1RCxDQUFELEVBQWtFTCxNQUFsRSxDQUFwQjtBQUNELEdBRkQsTUFFTyxJQUFJdkMsYUFBYSxDQUFDNEMsTUFBRCxDQUFqQixFQUEyQjtBQUNoQ1Asd0JBQW9CLENBQUNuQixrQkFBRCxFQUFxQjBCLE1BQXJCLENBQXBCO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTQyxpQkFBVCxDQUE0QkQsTUFBNUIsRUFBb0NMLE1BQXBDLEVBQTRDO0FBQzFDLE1BQUksT0FBT0ssTUFBUCxLQUFrQixRQUF0QixFQUFnQztBQUM5QixRQUFJNUMsYUFBYSxDQUFDdUMsTUFBRCxDQUFqQixFQUEyQjtBQUN6QkcsMkJBQXFCLENBQUN2QixrQkFBa0IsQ0FBQ3lCLE1BQUQsQ0FBbkIsRUFBNkJMLE1BQTdCLENBQXJCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBT3BCLGtCQUFrQixDQUFDeUIsTUFBRCxDQUF6QjtBQUNEO0FBQ0YsR0FORCxNQU1PLElBQUk1QyxhQUFhLENBQUM0QyxNQUFELENBQWpCLEVBQTJCO0FBQ2hDRix5QkFBcUIsQ0FBQ3hCLGtCQUFELEVBQXFCMEIsTUFBckIsQ0FBckI7QUFDRDtBQUNGOztBQUVELFNBQVNFLFdBQVQsQ0FBc0JaLElBQXRCLEVBQTRCO0FBQzFCLFNBQU8sVUFBVWEsSUFBVixFQUFnQjtBQUNyQixXQUFPYixJQUFJLENBQUNhLElBQUQsQ0FBSixJQUFjQSxJQUFyQjtBQUNELEdBRkQ7QUFHRDs7QUFFRCxTQUFTQyxTQUFULENBQW9CL0MsR0FBcEIsRUFBeUI7QUFDdkIsU0FBTyxDQUFDLENBQUNBLEdBQUYsS0FBVSxPQUFPQSxHQUFQLEtBQWUsUUFBZixJQUEyQixPQUFPQSxHQUFQLEtBQWUsVUFBcEQsS0FBbUUsT0FBT0EsR0FBRyxDQUFDZ0QsSUFBWCxLQUFvQixVQUE5RjtBQUNEOztBQUVELFNBQVNDLEtBQVQsQ0FBZ0J0QixLQUFoQixFQUF1Qm1CLElBQXZCLEVBQTZCO0FBQzNCLE1BQUlJLE9BQU8sR0FBRyxLQUFkO0FBQ0EsT0FBSyxJQUFJdEIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsS0FBSyxDQUFDRSxNQUExQixFQUFrQ0QsQ0FBQyxFQUFuQyxFQUF1QztBQUNyQyxRQUFNSyxJQUFJLEdBQUdOLEtBQUssQ0FBQ0MsQ0FBRCxDQUFsQjtBQUNBLFFBQUlzQixPQUFKLEVBQWE7QUFDWEEsYUFBTyxHQUFHQyxPQUFPLENBQUNILElBQVIsQ0FBYUgsV0FBVyxDQUFDWixJQUFELENBQXhCLENBQVY7QUFDRCxLQUZELE1BRU87QUFDTCxVQUFNWCxHQUFHLEdBQUdXLElBQUksQ0FBQ2EsSUFBRCxDQUFoQjtBQUNBLFVBQUlDLFNBQVMsQ0FBQ3pCLEdBQUQsQ0FBYixFQUFvQjtBQUNsQjRCLGVBQU8sR0FBR0MsT0FBTyxDQUFDQyxPQUFSLENBQWdCOUIsR0FBaEIsQ0FBVjtBQUNEO0FBQ0QsVUFBSUEsR0FBRyxLQUFLLEtBQVosRUFBbUI7QUFDakIsZUFBTztBQUNMMEIsY0FESyxrQkFDRyxDQUFFLENBREwsRUFBUDs7QUFHRDtBQUNGO0FBQ0Y7QUFDRCxTQUFPRSxPQUFPLElBQUk7QUFDaEJGLFFBRGdCLGdCQUNWSyxRQURVLEVBQ0E7QUFDZCxhQUFPQSxRQUFRLENBQUNQLElBQUQsQ0FBZjtBQUNELEtBSGUsRUFBbEI7O0FBS0Q7O0FBRUQsU0FBU1EsY0FBVCxDQUF5QmpCLFdBQXpCLEVBQW9ELEtBQWRrQixPQUFjLHVFQUFKLEVBQUk7QUFDbEQsR0FBQyxTQUFELEVBQVksTUFBWixFQUFvQixVQUFwQixFQUFnQ2YsT0FBaEMsQ0FBd0MsVUFBQWdCLElBQUksRUFBSTtBQUM5QyxRQUFJaEMsS0FBSyxDQUFDQyxPQUFOLENBQWNZLFdBQVcsQ0FBQ21CLElBQUQsQ0FBekIsQ0FBSixFQUFzQztBQUNwQyxVQUFNQyxXQUFXLEdBQUdGLE9BQU8sQ0FBQ0MsSUFBRCxDQUEzQjtBQUNBRCxhQUFPLENBQUNDLElBQUQsQ0FBUCxHQUFnQixTQUFTRSxtQkFBVCxDQUE4QnBDLEdBQTlCLEVBQW1DO0FBQ2pEMkIsYUFBSyxDQUFDWixXQUFXLENBQUNtQixJQUFELENBQVosRUFBb0JsQyxHQUFwQixDQUFMLENBQThCMEIsSUFBOUIsQ0FBbUMsVUFBQzFCLEdBQUQsRUFBUztBQUMxQztBQUNBLGlCQUFPM0IsSUFBSSxDQUFDOEQsV0FBRCxDQUFKLElBQXFCQSxXQUFXLENBQUNuQyxHQUFELENBQWhDLElBQXlDQSxHQUFoRDtBQUNELFNBSEQ7QUFJRCxPQUxEO0FBTUQ7QUFDRixHQVZEO0FBV0EsU0FBT2lDLE9BQVA7QUFDRDs7QUFFRCxTQUFTSSxrQkFBVCxDQUE2QmhCLE1BQTdCLEVBQXFDaUIsV0FBckMsRUFBa0Q7QUFDaEQsTUFBTUMsZ0JBQWdCLEdBQUcsRUFBekI7QUFDQSxNQUFJckMsS0FBSyxDQUFDQyxPQUFOLENBQWNSLGtCQUFrQixDQUFDMkMsV0FBakMsQ0FBSixFQUFtRDtBQUNqREMsb0JBQWdCLENBQUM5QixJQUFqQixPQUFBOEIsZ0JBQWdCLHFCQUFTNUMsa0JBQWtCLENBQUMyQyxXQUE1QixFQUFoQjtBQUNEO0FBQ0QsTUFBTXZCLFdBQVcsR0FBR25CLGtCQUFrQixDQUFDeUIsTUFBRCxDQUF0QztBQUNBLE1BQUlOLFdBQVcsSUFBSWIsS0FBSyxDQUFDQyxPQUFOLENBQWNZLFdBQVcsQ0FBQ3VCLFdBQTFCLENBQW5CLEVBQTJEO0FBQ3pEQyxvQkFBZ0IsQ0FBQzlCLElBQWpCLE9BQUE4QixnQkFBZ0IscUJBQVN4QixXQUFXLENBQUN1QixXQUFyQixFQUFoQjtBQUNEO0FBQ0RDLGtCQUFnQixDQUFDckIsT0FBakIsQ0FBeUIsVUFBQVAsSUFBSSxFQUFJO0FBQy9CMkIsZUFBVyxHQUFHM0IsSUFBSSxDQUFDMkIsV0FBRCxDQUFKLElBQXFCQSxXQUFuQztBQUNELEdBRkQ7QUFHQSxTQUFPQSxXQUFQO0FBQ0Q7O0FBRUQsU0FBU0Usc0JBQVQsQ0FBaUNuQixNQUFqQyxFQUF5QztBQUN2QyxNQUFNTixXQUFXLEdBQUc5QyxNQUFNLENBQUNnQixNQUFQLENBQWMsSUFBZCxDQUFwQjtBQUNBaEIsUUFBTSxDQUFDZ0QsSUFBUCxDQUFZdEIsa0JBQVosRUFBZ0N1QixPQUFoQyxDQUF3QyxVQUFBUCxJQUFJLEVBQUk7QUFDOUMsUUFBSUEsSUFBSSxLQUFLLGFBQWIsRUFBNEI7QUFDMUJJLGlCQUFXLENBQUNKLElBQUQsQ0FBWCxHQUFvQmhCLGtCQUFrQixDQUFDZ0IsSUFBRCxDQUFsQixDQUF5QjhCLEtBQXpCLEVBQXBCO0FBQ0Q7QUFDRixHQUpEO0FBS0EsTUFBTUMsaUJBQWlCLEdBQUc5QyxrQkFBa0IsQ0FBQ3lCLE1BQUQsQ0FBNUM7QUFDQSxNQUFJcUIsaUJBQUosRUFBdUI7QUFDckJ6RSxVQUFNLENBQUNnRCxJQUFQLENBQVl5QixpQkFBWixFQUErQnhCLE9BQS9CLENBQXVDLFVBQUFQLElBQUksRUFBSTtBQUM3QyxVQUFJQSxJQUFJLEtBQUssYUFBYixFQUE0QjtBQUMxQkksbUJBQVcsQ0FBQ0osSUFBRCxDQUFYLEdBQW9CLENBQUNJLFdBQVcsQ0FBQ0osSUFBRCxDQUFYLElBQXFCLEVBQXRCLEVBQTBCVixNQUExQixDQUFpQ3lDLGlCQUFpQixDQUFDL0IsSUFBRCxDQUFsRCxDQUFwQjtBQUNEO0FBQ0YsS0FKRDtBQUtEO0FBQ0QsU0FBT0ksV0FBUDtBQUNEOztBQUVELFNBQVM0QixTQUFULENBQW9CdEIsTUFBcEIsRUFBNEJ1QixHQUE1QixFQUFpQ1gsT0FBakMsRUFBcUQsbUNBQVJZLE1BQVEsdUVBQVJBLE1BQVE7QUFDbkQsTUFBTTlCLFdBQVcsR0FBR3lCLHNCQUFzQixDQUFDbkIsTUFBRCxDQUExQztBQUNBLE1BQUlOLFdBQVcsSUFBSTlDLE1BQU0sQ0FBQ2dELElBQVAsQ0FBWUYsV0FBWixFQUF5QlIsTUFBNUMsRUFBb0Q7QUFDbEQsUUFBSUwsS0FBSyxDQUFDQyxPQUFOLENBQWNZLFdBQVcsQ0FBQytCLE1BQTFCLENBQUosRUFBdUM7QUFDckMsVUFBTTlDLEdBQUcsR0FBRzJCLEtBQUssQ0FBQ1osV0FBVyxDQUFDK0IsTUFBYixFQUFxQmIsT0FBckIsQ0FBakI7QUFDQSxhQUFPakMsR0FBRyxDQUFDMEIsSUFBSixDQUFTLFVBQUNPLE9BQUQsRUFBYTtBQUMzQixlQUFPVyxHQUFHLE1BQUgsVUFBSVosY0FBYyxDQUFDakIsV0FBRCxFQUFja0IsT0FBZCxDQUFsQixTQUE2Q1ksTUFBN0MsRUFBUDtBQUNELE9BRk0sQ0FBUDtBQUdELEtBTEQsTUFLTztBQUNMLGFBQU9ELEdBQUcsTUFBSCxVQUFJWixjQUFjLENBQUNqQixXQUFELEVBQWNrQixPQUFkLENBQWxCLFNBQTZDWSxNQUE3QyxFQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU9ELEdBQUcsTUFBSCxVQUFJWCxPQUFKLFNBQWdCWSxNQUFoQixFQUFQO0FBQ0Q7O0FBRUQsSUFBTUUsa0JBQWtCLEdBQUc7QUFDekJULGFBRHlCLHVCQUNadEMsR0FEWSxFQUNQO0FBQ2hCLFFBQUksQ0FBQ3lCLFNBQVMsQ0FBQ3pCLEdBQUQsQ0FBZCxFQUFxQjtBQUNuQixhQUFPQSxHQUFQO0FBQ0Q7QUFDRCxXQUFPQSxHQUFHLENBQUMwQixJQUFKLENBQVMsVUFBQTFCLEdBQUcsRUFBSTtBQUNyQixhQUFPQSxHQUFHLENBQUMsQ0FBRCxDQUFWO0FBQ0QsS0FGTSxFQUVKZ0QsS0FGSSxDQUVFLFVBQUFoRCxHQUFHLEVBQUk7QUFDZCxhQUFPQSxHQUFHLENBQUMsQ0FBRCxDQUFWO0FBQ0QsS0FKTSxDQUFQO0FBS0QsR0FWd0IsRUFBM0I7OztBQWFBLElBQU1pRCxXQUFXO0FBQ2YscU9BREY7O0FBR0EsSUFBTUMsY0FBYyxHQUFHLGtCQUF2Qjs7QUFFQSxJQUFNQyxlQUFlLEdBQUcsS0FBeEI7O0FBRUEsU0FBU0MsWUFBVCxDQUF1QmxCLElBQXZCLEVBQTZCO0FBQzNCLFNBQU9nQixjQUFjLENBQUNHLElBQWYsQ0FBb0JuQixJQUFwQixDQUFQO0FBQ0Q7QUFDRCxTQUFTb0IsU0FBVCxDQUFvQnBCLElBQXBCLEVBQTBCO0FBQ3hCLFNBQU9lLFdBQVcsQ0FBQ0ksSUFBWixDQUFpQm5CLElBQWpCLENBQVA7QUFDRDs7QUFFRCxTQUFTcUIsYUFBVCxDQUF3QnJCLElBQXhCLEVBQThCO0FBQzVCLFNBQU9pQixlQUFlLENBQUNFLElBQWhCLENBQXFCbkIsSUFBckIsS0FBOEJBLElBQUksS0FBSyxRQUE5QztBQUNEOztBQUVELFNBQVNzQixhQUFULENBQXdCNUIsT0FBeEIsRUFBaUM7QUFDL0IsU0FBT0EsT0FBTyxDQUFDRixJQUFSLENBQWEsVUFBQUYsSUFBSSxFQUFJO0FBQzFCLFdBQU8sQ0FBQyxJQUFELEVBQU9BLElBQVAsQ0FBUDtBQUNELEdBRk07QUFHSndCLE9BSEksQ0FHRSxVQUFBUyxHQUFHLFVBQUksQ0FBQ0EsR0FBRCxDQUFKLEVBSEwsQ0FBUDtBQUlEOztBQUVELFNBQVNDLGFBQVQsQ0FBd0J4QixJQUF4QixFQUE4QjtBQUM1QjtBQUNFa0IsY0FBWSxDQUFDbEIsSUFBRCxDQUFaO0FBQ0FvQixXQUFTLENBQUNwQixJQUFELENBRFQ7QUFFQXFCLGVBQWEsQ0FBQ3JCLElBQUQsQ0FIZjtBQUlFO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxTQUFPLElBQVA7QUFDRDs7QUFFRCxTQUFTeUIsU0FBVCxDQUFvQnpCLElBQXBCLEVBQTBCVSxHQUExQixFQUErQjtBQUM3QixNQUFJLENBQUNjLGFBQWEsQ0FBQ3hCLElBQUQsQ0FBbEIsRUFBMEI7QUFDeEIsV0FBT1UsR0FBUDtBQUNEO0FBQ0QsU0FBTyxTQUFTZ0IsVUFBVCxHQUE4QyxLQUF6QjNCLE9BQXlCLHVFQUFmLEVBQWUsb0NBQVJZLE1BQVEsNkVBQVJBLE1BQVE7QUFDbkQsUUFBSXhFLElBQUksQ0FBQzRELE9BQU8sQ0FBQzRCLE9BQVQsQ0FBSixJQUF5QnhGLElBQUksQ0FBQzRELE9BQU8sQ0FBQzZCLElBQVQsQ0FBN0IsSUFBK0N6RixJQUFJLENBQUM0RCxPQUFPLENBQUM4QixRQUFULENBQXZELEVBQTJFO0FBQ3pFLGFBQU8xQixrQkFBa0IsQ0FBQ0gsSUFBRCxFQUFPUyxTQUFTLE1BQVQsVUFBVVQsSUFBVixFQUFnQlUsR0FBaEIsRUFBcUJYLE9BQXJCLFNBQWlDWSxNQUFqQyxFQUFQLENBQXpCO0FBQ0Q7QUFDRCxXQUFPUixrQkFBa0IsQ0FBQ0gsSUFBRCxFQUFPc0IsYUFBYSxDQUFDLElBQUkzQixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVa0MsTUFBVixFQUFxQjtBQUM3RXJCLGVBQVMsTUFBVCxVQUFVVCxJQUFWLEVBQWdCVSxHQUFoQixFQUFxQjNFLE1BQU0sQ0FBQ2dHLE1BQVAsQ0FBYyxFQUFkLEVBQWtCaEMsT0FBbEIsRUFBMkI7QUFDOUM0QixlQUFPLEVBQUUvQixPQURxQztBQUU5Q2dDLFlBQUksRUFBRUUsTUFGd0MsRUFBM0IsQ0FBckI7QUFHT25CLFlBSFA7QUFJQTtBQUNBLFVBQUksQ0FBQ2hCLE9BQU8sQ0FBQzNELFNBQVIsQ0FBa0JnRyxPQUF2QixFQUFnQztBQUM5QnJDLGVBQU8sQ0FBQzNELFNBQVIsQ0FBa0JnRyxPQUFsQixHQUE0QixVQUFVbkMsUUFBVixFQUFvQjtBQUM5QyxjQUFNSCxPQUFPLEdBQUcsS0FBS3VDLFdBQXJCO0FBQ0EsaUJBQU8sS0FBS3pDLElBQUw7QUFDTCxvQkFBQTBDLEtBQUssVUFBSXhDLE9BQU8sQ0FBQ0UsT0FBUixDQUFnQkMsUUFBUSxFQUF4QixFQUE0QkwsSUFBNUIsQ0FBaUMsb0JBQU0wQyxLQUFOLEVBQWpDLENBQUosRUFEQTtBQUVMLG9CQUFBQyxNQUFNLFVBQUl6QyxPQUFPLENBQUNFLE9BQVIsQ0FBZ0JDLFFBQVEsRUFBeEIsRUFBNEJMLElBQTVCLENBQWlDLFlBQU07QUFDL0Msb0JBQU0yQyxNQUFOO0FBQ0QsYUFGUyxDQUFKLEVBRkQsQ0FBUDs7QUFNRCxTQVJEO0FBU0Q7QUFDRixLQWpCNkMsQ0FBRCxDQUFwQixDQUF6QjtBQWtCRCxHQXRCRDtBQXVCRDs7QUFFRCxJQUFNQyxHQUFHLEdBQUcsSUFBWjtBQUNBLElBQU1DLGlCQUFpQixHQUFHLEdBQTFCO0FBQ0EsSUFBSUMsS0FBSyxHQUFHLEtBQVo7QUFDQSxJQUFJQyxXQUFXLEdBQUcsQ0FBbEI7QUFDQSxJQUFJQyxTQUFTLEdBQUcsQ0FBaEI7O0FBRUEsU0FBU0MsZ0JBQVQsR0FBNkI7Ozs7O0FBS3ZCQyxNQUFJLENBQUNDLGlCQUFMLEVBTHVCLENBRXpCQyxRQUZ5Qix5QkFFekJBLFFBRnlCLENBR3pCQyxVQUh5Qix5QkFHekJBLFVBSHlCLENBSXpCQyxXQUp5Qix5QkFJekJBLFdBSnlCLEVBS0c7O0FBRTlCUCxhQUFXLEdBQUdPLFdBQWQ7QUFDQU4sV0FBUyxHQUFHSyxVQUFaO0FBQ0FQLE9BQUssR0FBR00sUUFBUSxLQUFLLEtBQXJCO0FBQ0Q7O0FBRUQsU0FBU0csTUFBVCxDQUFpQkMsTUFBakIsRUFBeUJDLGNBQXpCLEVBQXlDO0FBQ3ZDLE1BQUlWLFdBQVcsS0FBSyxDQUFwQixFQUF1QjtBQUNyQkUsb0JBQWdCO0FBQ2pCOztBQUVETyxRQUFNLEdBQUdFLE1BQU0sQ0FBQ0YsTUFBRCxDQUFmO0FBQ0EsTUFBSUEsTUFBTSxLQUFLLENBQWYsRUFBa0I7QUFDaEIsV0FBTyxDQUFQO0FBQ0Q7QUFDRCxNQUFJRyxNQUFNLEdBQUlILE1BQU0sR0FBR1gsaUJBQVYsSUFBZ0NZLGNBQWMsSUFBSVYsV0FBbEQsQ0FBYjtBQUNBLE1BQUlZLE1BQU0sR0FBRyxDQUFiLEVBQWdCO0FBQ2RBLFVBQU0sR0FBRyxDQUFDQSxNQUFWO0FBQ0Q7QUFDREEsUUFBTSxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0YsTUFBTSxHQUFHZixHQUFwQixDQUFUO0FBQ0EsTUFBSWUsTUFBTSxLQUFLLENBQWYsRUFBa0I7QUFDaEIsUUFBSVgsU0FBUyxLQUFLLENBQWQsSUFBbUIsQ0FBQ0YsS0FBeEIsRUFBK0I7QUFDN0IsYUFBTyxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxHQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU9VLE1BQU0sR0FBRyxDQUFULEdBQWEsQ0FBQ0csTUFBZCxHQUF1QkEsTUFBOUI7QUFDRDs7QUFFRCxJQUFNRyxZQUFZLEdBQUc7QUFDbkJ6QyxvQkFBa0IsRUFBbEJBLGtCQURtQixFQUFyQjs7Ozs7QUFNQSxJQUFJMEMsT0FBTyxHQUFHLGFBQWF4SCxNQUFNLENBQUN5SCxNQUFQLENBQWM7QUFDdkNULFFBQU0sRUFBRUEsTUFEK0I7QUFFdkNPLGNBQVksRUFBRUEsWUFGeUI7QUFHdkNwRSxnQkFBYyxFQUFFQSxjQUh1QjtBQUl2Q0UsbUJBQWlCLEVBQUVBLGlCQUpvQixFQUFkLENBQTNCOzs7QUFPQSxJQUFJcUUsWUFBWSxHQUFHO0FBQ2pCQyxNQURpQixnQkFDWEMsUUFEVyxFQUNEO0FBQ2QsUUFBSUMsWUFBWSxHQUFHQyxRQUFRLENBQUNGLFFBQVEsQ0FBQ0csT0FBVixDQUEzQjtBQUNBLFFBQUlDLEtBQUssQ0FBQ0gsWUFBRCxDQUFULEVBQXlCO0FBQ3ZCO0FBQ0Q7QUFDRCxRQUFNSSxJQUFJLEdBQUdMLFFBQVEsQ0FBQ0ssSUFBdEI7QUFDQSxRQUFJLENBQUNoRyxLQUFLLENBQUNDLE9BQU4sQ0FBYytGLElBQWQsQ0FBTCxFQUEwQjtBQUN4QjtBQUNEO0FBQ0QsUUFBTUMsR0FBRyxHQUFHRCxJQUFJLENBQUMzRixNQUFqQjtBQUNBLFFBQUksQ0FBQzRGLEdBQUwsRUFBVTtBQUNSO0FBQ0Q7QUFDRCxRQUFJTCxZQUFZLEdBQUcsQ0FBbkIsRUFBc0I7QUFDcEJBLGtCQUFZLEdBQUcsQ0FBZjtBQUNELEtBRkQsTUFFTyxJQUFJQSxZQUFZLElBQUlLLEdBQXBCLEVBQXlCO0FBQzlCTCxrQkFBWSxHQUFHSyxHQUFHLEdBQUcsQ0FBckI7QUFDRDtBQUNELFFBQUlMLFlBQVksR0FBRyxDQUFuQixFQUFzQjtBQUNwQkQsY0FBUSxDQUFDRyxPQUFULEdBQW1CRSxJQUFJLENBQUNKLFlBQUQsQ0FBdkI7QUFDQUQsY0FBUSxDQUFDSyxJQUFULEdBQWdCQSxJQUFJLENBQUNFLE1BQUw7QUFDZCxnQkFBQ0MsSUFBRCxFQUFPekYsS0FBUCxVQUFpQkEsS0FBSyxHQUFHa0YsWUFBUixHQUF1Qk8sSUFBSSxLQUFLSCxJQUFJLENBQUNKLFlBQUQsQ0FBcEMsR0FBcUQsSUFBdEUsRUFEYyxDQUFoQjs7QUFHRCxLQUxELE1BS087QUFDTEQsY0FBUSxDQUFDRyxPQUFULEdBQW1CRSxJQUFJLENBQUMsQ0FBRCxDQUF2QjtBQUNEO0FBQ0QsV0FBTztBQUNMSSxlQUFTLEVBQUUsS0FETjtBQUVMQyxVQUFJLEVBQUUsS0FGRCxFQUFQOztBQUlELEdBL0JnQixFQUFuQjs7O0FBa0NBO0FBQ0EsSUFBTUMsS0FBSyxHQUFHO0FBQ1osY0FEWTtBQUVaLG1CQUZZO0FBR1osZ0JBSFk7QUFJWixlQUpZO0FBS1osc0JBTFk7QUFNWixnQ0FOWTtBQU9aLHdCQVBZO0FBUVosK0JBUlk7QUFTWiwrQkFUWTtBQVVaLDhCQVZZO0FBV1oscUJBWFk7QUFZWiwwQkFaWTtBQWFaLHVCQWJZO0FBY1osNkJBZFk7QUFlWiw0QkFmWTtBQWdCWiw0QkFoQlk7QUFpQlosZ0NBakJZO0FBa0JaLG9DQWxCWTtBQW1CWixzQkFuQlk7QUFvQlosNkJBcEJZO0FBcUJaLHFCQXJCWTtBQXNCWixvQkF0Qlk7QUF1QlosdUJBdkJZO0FBd0JaLGdCQXhCWTtBQXlCWixZQXpCWTtBQTBCWixzQkExQlk7QUEyQloscUJBM0JZO0FBNEJaLGVBNUJZO0FBNkJaLGdCQTdCWTtBQThCWixpQkE5Qlk7QUErQlosU0EvQlksQ0FBZDs7O0FBa0NBO0FBQ0EsSUFBTUMsUUFBUSxHQUFHLEVBQWpCOztBQUVBLFNBQVNDLGdCQUFULENBQTJCQyxXQUEzQixFQUF3Q0MsVUFBeEMsRUFBb0Q7QUFDbEQsU0FBTyxTQUFTQyxXQUFULEdBQXdCO0FBQzdCQyxXQUFPLENBQUNDLEtBQVIsMENBQXVCSixXQUF2QixxQ0FBeUNDLFVBQXpDO0FBQ0QsR0FGRDtBQUdEOztBQUVELFNBQVNJLGNBQVQsQ0FBeUIzQixNQUF6QixFQUFpQztBQUMvQkEsUUFBTSxDQUFDNEIsV0FBUCxHQUFxQjtBQUNuQkMsU0FBSyxFQUFFN0IsTUFBTSxDQUFDOEIsTUFESyxFQUFyQjs7QUFHQTlCLFFBQU0sQ0FBQytCLE1BQVAsR0FBZ0I7QUFDZEMsV0FBTyxFQUFFaEMsTUFBTSxDQUFDaUMsVUFERixFQUFoQjs7QUFHRDs7QUFFRDtBQUNBLElBQU1DLFNBQVMsR0FBRztBQUNoQkMsU0FBTyxFQUFFO0FBQ1A1QixRQURPLGdCQUNEQyxRQURDLEVBQ1M7QUFDZDtBQUNBO0FBQ0E7QUFDQSxhQUFPO0FBQ0x4RSxjQUFNLEVBQUUsUUFESDtBQUVMb0csZ0JBRkssb0JBRUtDLElBRkwsRUFFVztBQUNkLGlCQUFPO0FBQ0x4RixnQkFBSSxFQUFFLFVBREQ7QUFFTGtDLGlCQUFLLEVBQUVzRCxJQUFJLEtBQUssTUFBVCxHQUFrQkEsSUFBbEIsR0FBeUIsUUFGM0IsRUFBUDs7QUFJRCxTQVBJLEVBQVA7O0FBU0QsS0FkTSxFQURPOztBQWlCaEJDLGVBQWEsRUFBRTtBQUNiL0IsUUFBSSxFQUFFO0FBQ0p2RSxZQUFNLEVBQUUsS0FESixFQURPLEVBakJDOzs7QUFzQmhCc0UsY0FBWSxFQUFaQSxZQXRCZ0I7QUF1QmhCaUMsb0JBQWtCLEVBQUU7QUFDbEJ0RixlQURrQix1QkFDTHVGLE9BREssRUFDSTtBQUNwQkEsYUFBTyxDQUFDQyxlQUFSLEdBQTBCcEIsZ0JBQWdCLENBQUMsaUJBQUQsRUFBb0IsaUJBQXBCLENBQTFDO0FBQ0QsS0FIaUIsRUF2Qko7O0FBNEJoQnFCLDJCQUF5QixFQUFFO0FBQ3pCekYsZUFEeUIsdUJBQ1p1RixPQURZLEVBQ0g7QUFDcEJBLGFBQU8sQ0FBQ0csTUFBUixHQUFpQnRCLGdCQUFnQixDQUFDLHdCQUFELEVBQTJCLFFBQTNCLENBQWpDO0FBQ0FtQixhQUFPLENBQUNJLE1BQVIsR0FBaUJ2QixnQkFBZ0IsQ0FBQyx3QkFBRCxFQUEyQixRQUEzQixDQUFqQztBQUNELEtBSndCLEVBNUJYOztBQWtDaEJ3QixVQUFRLEVBQUU7QUFDUnRDLFFBQUksRUFBRTtBQUNKdUMsb0JBQWMsRUFBRSxLQURaO0FBRUpDLGNBQVEsRUFBRSxLQUZOLEVBREUsRUFsQ007OztBQXdDaEJDLHVCQUFxQixFQUFFO0FBQ3JCbkcsUUFBSSxFQUFFLHdCQURlO0FBRXJCMEQsUUFBSSxFQUFFO0FBQ0pzQixXQUFLLEVBQUUsUUFESDtBQUVKb0IsZ0JBQVUsRUFBRSxLQUZSLEVBRmUsRUF4Q1A7OztBQStDaEJDLHlCQUF1QixFQUFFO0FBQ3ZCckcsUUFBSSxFQUFFLDBCQURpQixFQS9DVDs7QUFrRGhCc0csZUFBYSxFQUFFO0FBQ2J0RyxRQUFJLEVBQUUsV0FETyxFQWxEQzs7QUFxRGhCdUcsb0JBQWtCLEVBQUU7QUFDbEJ2RyxRQUFJLEVBQUUsZ0JBRFk7QUFFbEJJLGVBQVcsRUFBRTBFLGNBRkssRUFyREosRUFBbEI7Ozs7QUEyREEsSUFBTTBCLFNBQVMsR0FBRyxDQUFDLFNBQUQsRUFBWSxNQUFaLEVBQW9CLFFBQXBCLEVBQThCLFVBQTlCLENBQWxCOztBQUVBLFNBQVNDLGVBQVQsQ0FBMEIvQixVQUExQixFQUFzQ3ZGLE1BQXRDLEVBQThDaUIsV0FBOUMsRUFBMkQ7QUFDekQsU0FBTyxVQUFVdEMsR0FBVixFQUFlO0FBQ3BCLFdBQU9xQixNQUFNLENBQUN1SCxrQkFBa0IsQ0FBQ2hDLFVBQUQsRUFBYTVHLEdBQWIsRUFBa0JzQyxXQUFsQixDQUFuQixDQUFiO0FBQ0QsR0FGRDtBQUdEOztBQUVELFNBQVN1RyxXQUFULENBQXNCakMsVUFBdEIsRUFBa0NmLFFBQWxDLEVBQXFHLEtBQXpEaUQsVUFBeUQsdUVBQTVDLEVBQTRDLEtBQXhDeEcsV0FBd0MsdUVBQTFCLEVBQTBCLEtBQXRCeUcsWUFBc0IsdUVBQVAsS0FBTztBQUNuRyxNQUFJdEssYUFBYSxDQUFDb0gsUUFBRCxDQUFqQixFQUE2QixDQUFFO0FBQzdCLFFBQU1tRCxNQUFNLEdBQUdELFlBQVksS0FBSyxJQUFqQixHQUF3QmxELFFBQXhCLEdBQW1DLEVBQWxELENBRDJCLENBQzJCO0FBQ3RELFFBQUl4SCxJQUFJLENBQUN5SyxVQUFELENBQVIsRUFBc0I7QUFDcEJBLGdCQUFVLEdBQUdBLFVBQVUsQ0FBQ2pELFFBQUQsRUFBV21ELE1BQVgsQ0FBVixJQUFnQyxFQUE3QztBQUNEO0FBQ0QsU0FBSyxJQUFJbkssR0FBVCxJQUFnQmdILFFBQWhCLEVBQTBCO0FBQ3hCLFVBQUlqSCxNQUFNLENBQUNrSyxVQUFELEVBQWFqSyxHQUFiLENBQVYsRUFBNkI7QUFDM0IsWUFBSW9LLFNBQVMsR0FBR0gsVUFBVSxDQUFDakssR0FBRCxDQUExQjtBQUNBLFlBQUlSLElBQUksQ0FBQzRLLFNBQUQsQ0FBUixFQUFxQjtBQUNuQkEsbUJBQVMsR0FBR0EsU0FBUyxDQUFDcEQsUUFBUSxDQUFDaEgsR0FBRCxDQUFULEVBQWdCZ0gsUUFBaEIsRUFBMEJtRCxNQUExQixDQUFyQjtBQUNEO0FBQ0QsWUFBSSxDQUFDQyxTQUFMLEVBQWdCLENBQUU7QUFDaEJuQyxpQkFBTyxDQUFDb0MsSUFBUiwwQ0FBc0J0QyxVQUF0QixxQ0FBdUMvSCxHQUF2QztBQUNELFNBRkQsTUFFTyxJQUFJTixLQUFLLENBQUMwSyxTQUFELENBQVQsRUFBc0IsQ0FBRTtBQUM3QkQsZ0JBQU0sQ0FBQ0MsU0FBRCxDQUFOLEdBQW9CcEQsUUFBUSxDQUFDaEgsR0FBRCxDQUE1QjtBQUNELFNBRk0sTUFFQSxJQUFJSixhQUFhLENBQUN3SyxTQUFELENBQWpCLEVBQThCLENBQUU7QUFDckNELGdCQUFNLENBQUNDLFNBQVMsQ0FBQy9HLElBQVYsR0FBaUIrRyxTQUFTLENBQUMvRyxJQUEzQixHQUFrQ3JELEdBQW5DLENBQU4sR0FBZ0RvSyxTQUFTLENBQUM3RSxLQUExRDtBQUNEO0FBQ0YsT0FaRCxNQVlPLElBQUlzRSxTQUFTLENBQUNsSSxPQUFWLENBQWtCM0IsR0FBbEIsTUFBMkIsQ0FBQyxDQUFoQyxFQUFtQztBQUN4Q21LLGNBQU0sQ0FBQ25LLEdBQUQsQ0FBTixHQUFjOEosZUFBZSxDQUFDL0IsVUFBRCxFQUFhZixRQUFRLENBQUNoSCxHQUFELENBQXJCLEVBQTRCeUQsV0FBNUIsQ0FBN0I7QUFDRCxPQUZNLE1BRUE7QUFDTCxZQUFJLENBQUN5RyxZQUFMLEVBQW1CO0FBQ2pCQyxnQkFBTSxDQUFDbkssR0FBRCxDQUFOLEdBQWNnSCxRQUFRLENBQUNoSCxHQUFELENBQXRCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsV0FBT21LLE1BQVA7QUFDRCxHQTNCRCxNQTJCTyxJQUFJM0ssSUFBSSxDQUFDd0gsUUFBRCxDQUFSLEVBQW9CO0FBQ3pCQSxZQUFRLEdBQUc4QyxlQUFlLENBQUMvQixVQUFELEVBQWFmLFFBQWIsRUFBdUJ2RCxXQUF2QixDQUExQjtBQUNEO0FBQ0QsU0FBT3VELFFBQVA7QUFDRDs7QUFFRCxTQUFTK0Msa0JBQVQsQ0FBNkJoQyxVQUE3QixFQUF5QzVHLEdBQXpDLEVBQThDc0MsV0FBOUMsRUFBb0YsS0FBekI2RyxlQUF5Qix1RUFBUCxLQUFPO0FBQ2xGLE1BQUk5SyxJQUFJLENBQUNrSixTQUFTLENBQUNqRixXQUFYLENBQVIsRUFBaUMsQ0FBRTtBQUNqQ3RDLE9BQUcsR0FBR3VILFNBQVMsQ0FBQ2pGLFdBQVYsQ0FBc0JzRSxVQUF0QixFQUFrQzVHLEdBQWxDLENBQU47QUFDRDtBQUNELFNBQU82SSxXQUFXLENBQUNqQyxVQUFELEVBQWE1RyxHQUFiLEVBQWtCc0MsV0FBbEIsRUFBK0IsRUFBL0IsRUFBbUM2RyxlQUFuQyxDQUFsQjtBQUNEOztBQUVELFNBQVNDLE9BQVQsQ0FBa0J4QyxVQUFsQixFQUE4QnZGLE1BQTlCLEVBQXNDO0FBQ3BDLE1BQUl6QyxNQUFNLENBQUMySSxTQUFELEVBQVlYLFVBQVosQ0FBVixFQUFtQztBQUNqQyxRQUFNeUMsUUFBUSxHQUFHOUIsU0FBUyxDQUFDWCxVQUFELENBQTFCO0FBQ0EsUUFBSSxDQUFDeUMsUUFBTCxFQUFlLENBQUU7QUFDZixhQUFPLFlBQVk7QUFDakJ2QyxlQUFPLENBQUNDLEtBQVIsa0VBQTJCSCxVQUEzQjtBQUNELE9BRkQ7QUFHRDtBQUNELFdBQU8sVUFBVTBDLElBQVYsRUFBZ0JDLElBQWhCLEVBQXNCLENBQUU7QUFDN0IsVUFBSXRILE9BQU8sR0FBR29ILFFBQWQ7QUFDQSxVQUFJaEwsSUFBSSxDQUFDZ0wsUUFBRCxDQUFSLEVBQW9CO0FBQ2xCcEgsZUFBTyxHQUFHb0gsUUFBUSxDQUFDQyxJQUFELENBQWxCO0FBQ0Q7O0FBRURBLFVBQUksR0FBR1QsV0FBVyxDQUFDakMsVUFBRCxFQUFhMEMsSUFBYixFQUFtQnJILE9BQU8sQ0FBQzJELElBQTNCLEVBQWlDM0QsT0FBTyxDQUFDSyxXQUF6QyxDQUFsQjs7QUFFQSxVQUFNc0QsSUFBSSxHQUFHLENBQUMwRCxJQUFELENBQWI7QUFDQSxVQUFJLE9BQU9DLElBQVAsS0FBZ0IsV0FBcEIsRUFBaUM7QUFDL0IzRCxZQUFJLENBQUNuRixJQUFMLENBQVU4SSxJQUFWO0FBQ0Q7QUFDRCxVQUFNakgsV0FBVyxHQUFHc0MsSUFBSSxDQUFDM0MsT0FBTyxDQUFDQyxJQUFSLElBQWdCMEUsVUFBakIsQ0FBSixDQUFpQzRDLEtBQWpDLENBQXVDNUUsSUFBdkMsRUFBNkNnQixJQUE3QyxDQUFwQjtBQUNBLFVBQUl0QyxTQUFTLENBQUNzRCxVQUFELENBQWIsRUFBMkIsQ0FBRTtBQUMzQixlQUFPZ0Msa0JBQWtCLENBQUNoQyxVQUFELEVBQWF0RSxXQUFiLEVBQTBCTCxPQUFPLENBQUNLLFdBQWxDLEVBQStDYyxZQUFZLENBQUN3RCxVQUFELENBQTNELENBQXpCO0FBQ0Q7QUFDRCxhQUFPdEUsV0FBUDtBQUNELEtBakJEO0FBa0JEO0FBQ0QsU0FBT2pCLE1BQVA7QUFDRDs7QUFFRCxJQUFNb0ksUUFBUSxHQUFHeEwsTUFBTSxDQUFDZ0IsTUFBUCxDQUFjLElBQWQsQ0FBakI7O0FBRUEsSUFBTXlLLEtBQUssR0FBRztBQUNaLHNCQURZO0FBRVosZUFGWTtBQUdaLGlCQUhZO0FBSVosUUFKWTtBQUtaLFNBTFk7QUFNWixPQU5ZLENBQWQ7OztBQVNBLFNBQVNDLGFBQVQsQ0FBd0J6SCxJQUF4QixFQUE4QjtBQUM1QixTQUFPLFNBQVMwSCxPQUFUOzs7QUFHSixPQUZEOUYsSUFFQyxRQUZEQSxJQUVDLENBRERDLFFBQ0MsUUFEREEsUUFDQztBQUNELFFBQU0vRCxHQUFHLEdBQUc7QUFDVjZKLFlBQU0sWUFBSzNILElBQUwsNENBQXVCQSxJQUF2QixrQkFESSxFQUFaOztBQUdBN0QsUUFBSSxDQUFDeUYsSUFBRCxDQUFKLElBQWNBLElBQUksQ0FBQzlELEdBQUQsQ0FBbEI7QUFDQTNCLFFBQUksQ0FBQzBGLFFBQUQsQ0FBSixJQUFrQkEsUUFBUSxDQUFDL0QsR0FBRCxDQUExQjtBQUNELEdBVEQ7QUFVRDs7QUFFRDBKLEtBQUssQ0FBQ3hJLE9BQU4sQ0FBYyxVQUFVZ0IsSUFBVixFQUFnQjtBQUM1QnVILFVBQVEsQ0FBQ3ZILElBQUQsQ0FBUixHQUFpQnlILGFBQWEsQ0FBQ3pILElBQUQsQ0FBOUI7QUFDRCxDQUZEOztBQUlBLElBQUk0SCxTQUFTLEdBQUc7QUFDZEMsT0FBSyxFQUFFLENBQUMsT0FBRCxDQURPO0FBRWRDLE9BQUssRUFBRSxDQUFDLE9BQUQsQ0FGTztBQUdkQyxTQUFPLEVBQUUsQ0FBQyxPQUFELENBSEs7QUFJZHhKLE1BQUksRUFBRSxDQUFDLE9BQUQsQ0FKUSxFQUFoQjs7O0FBT0EsU0FBU3lKLFdBQVQ7Ozs7O0FBS0csS0FKREMsT0FJQyxTQUpEQSxPQUlDLENBSER0RyxPQUdDLFNBSERBLE9BR0MsQ0FGREMsSUFFQyxTQUZEQSxJQUVDLENBRERDLFFBQ0MsU0FEREEsUUFDQztBQUNELE1BQUkvRCxHQUFHLEdBQUcsS0FBVjtBQUNBLE1BQUk4SixTQUFTLENBQUNLLE9BQUQsQ0FBYixFQUF3QjtBQUN0Qm5LLE9BQUcsR0FBRztBQUNKNkosWUFBTSxFQUFFLGdCQURKO0FBRUpNLGFBQU8sRUFBUEEsT0FGSTtBQUdKQyxjQUFRLEVBQUVOLFNBQVMsQ0FBQ0ssT0FBRCxDQUhmLEVBQU47O0FBS0E5TCxRQUFJLENBQUN3RixPQUFELENBQUosSUFBaUJBLE9BQU8sQ0FBQzdELEdBQUQsQ0FBeEI7QUFDRCxHQVBELE1BT087QUFDTEEsT0FBRyxHQUFHO0FBQ0o2SixZQUFNLEVBQUUseUJBQXlCTSxPQUF6QixHQUFtQyxNQUR2QyxFQUFOOztBQUdBOUwsUUFBSSxDQUFDeUYsSUFBRCxDQUFKLElBQWNBLElBQUksQ0FBQzlELEdBQUQsQ0FBbEI7QUFDRDtBQUNEM0IsTUFBSSxDQUFDMEYsUUFBRCxDQUFKLElBQWtCQSxRQUFRLENBQUMvRCxHQUFELENBQTFCO0FBQ0Q7O0FBRUQsSUFBSXFLLFFBQVEsR0FBRyxhQUFhcE0sTUFBTSxDQUFDeUgsTUFBUCxDQUFjO0FBQ3hDd0UsYUFBVyxFQUFFQSxXQUQyQixFQUFkLENBQTVCOzs7QUFJQSxJQUFNSSxVQUFVLEdBQUksWUFBWTtBQUM5QixNQUFJLE9BQU9DLGFBQVAsS0FBeUIsVUFBN0IsRUFBeUM7QUFDdkM7QUFDQSxXQUFPQSxhQUFQO0FBQ0Q7QUFDRCxNQUFJQyxPQUFKO0FBQ0EsU0FBTyxTQUFTRCxhQUFULEdBQTBCO0FBQy9CLFFBQUksQ0FBQ0MsT0FBTCxFQUFjO0FBQ1pBLGFBQU8sR0FBRyxJQUFJQyxZQUFKLEVBQVY7QUFDRDtBQUNELFdBQU9ELE9BQVA7QUFDRCxHQUxEO0FBTUQsQ0Faa0IsRUFBbkI7O0FBY0EsU0FBU2hCLEtBQVQsQ0FBZ0JrQixHQUFoQixFQUFxQnJKLE1BQXJCLEVBQTZCdUUsSUFBN0IsRUFBbUM7QUFDakMsU0FBTzhFLEdBQUcsQ0FBQ3JKLE1BQUQsQ0FBSCxDQUFZbUksS0FBWixDQUFrQmtCLEdBQWxCLEVBQXVCOUUsSUFBdkIsQ0FBUDtBQUNEOztBQUVELFNBQVMrRSxHQUFULEdBQWdCO0FBQ2QsU0FBT25CLEtBQUssQ0FBQ2MsVUFBVSxFQUFYLEVBQWUsS0FBZiw2QkFBMEJNLFNBQTFCLEVBQVo7QUFDRDtBQUNELFNBQVNDLElBQVQsR0FBaUI7QUFDZixTQUFPckIsS0FBSyxDQUFDYyxVQUFVLEVBQVgsRUFBZSxNQUFmLDZCQUEyQk0sU0FBM0IsRUFBWjtBQUNEO0FBQ0QsU0FBU0UsS0FBVCxHQUFrQjtBQUNoQixTQUFPdEIsS0FBSyxDQUFDYyxVQUFVLEVBQVgsRUFBZSxPQUFmLDZCQUE0Qk0sU0FBNUIsRUFBWjtBQUNEO0FBQ0QsU0FBU0csS0FBVCxHQUFrQjtBQUNoQixTQUFPdkIsS0FBSyxDQUFDYyxVQUFVLEVBQVgsRUFBZSxPQUFmLDZCQUE0Qk0sU0FBNUIsRUFBWjtBQUNEOztBQUVELElBQUlJLFFBQVEsR0FBRyxhQUFhL00sTUFBTSxDQUFDeUgsTUFBUCxDQUFjO0FBQ3hDaUYsS0FBRyxFQUFFQSxHQURtQztBQUV4Q0UsTUFBSSxFQUFFQSxJQUZrQztBQUd4Q0MsT0FBSyxFQUFFQSxLQUhpQztBQUl4Q0MsT0FBSyxFQUFFQSxLQUppQyxFQUFkLENBQTVCOzs7QUFPQSxTQUFTRSxjQUFULENBQXlCcEksTUFBekIsRUFBaUM7QUFDL0IsTUFBSXFJLFVBQVUsR0FBRyxLQUFqQjtBQUNBLE1BQUksT0FBT3JJLE1BQU0sQ0FBQ3NJLFNBQWQsS0FBNEIsUUFBaEMsRUFBMEM7QUFDeEMsUUFBSTtBQUNGdEksWUFBTSxDQUFDc0ksU0FBUCxHQUFtQkMsSUFBSSxDQUFDQyxLQUFMLENBQVd4SSxNQUFNLENBQUNzSSxTQUFsQixDQUFuQjtBQUNELEtBRkQsQ0FFRSxPQUFPRyxDQUFQLEVBQVU7QUFDVkosZ0JBQVUsR0FBRyxJQUFiO0FBQ0Q7QUFDRjtBQUNELE1BQUlBLFVBQUosRUFBZ0I7QUFDZHJJLFVBQU0sQ0FBQ2lCLElBQVAsSUFBZWpCLE1BQU0sQ0FBQ2lCLElBQVAsQ0FBWTtBQUN6QitGLFlBQU0sRUFBRSx3R0FEaUIsRUFBWixDQUFmOztBQUdELEdBSkQsTUFJTztBQUNMakYsUUFBSSxDQUFDMkcscUJBQUwsQ0FBMkIxSSxNQUEzQjtBQUNEO0FBQ0Y7O0FBRUQsSUFBSUQsR0FBRyxHQUFHLGFBQWEzRSxNQUFNLENBQUN5SCxNQUFQLENBQWM7QUFDbkN1RixnQkFBYyxFQUFFQSxjQURtQixFQUFkLENBQXZCOzs7QUFJQSxJQUFNTyxNQUFNLEdBQUdDLElBQWY7QUFDQSxJQUFNQyxXQUFXLEdBQUdDLFNBQXBCOztBQUVBLElBQU1DLFdBQVcsR0FBRyxJQUFwQjs7QUFFQSxJQUFNQyxTQUFTLEdBQUc5TSxNQUFNLENBQUMsVUFBQ1AsR0FBRCxFQUFTO0FBQ2hDLFNBQU9hLFFBQVEsQ0FBQ2IsR0FBRyxDQUFDYyxPQUFKLENBQVlzTSxXQUFaLEVBQXlCLEdBQXpCLENBQUQsQ0FBZjtBQUNELENBRnVCLENBQXhCOztBQUlBLFNBQVNFLGdCQUFULENBQTJCQyxVQUEzQixFQUF1QztBQUNyQyxNQUFNQyxlQUFlLEdBQUdELFVBQVUsQ0FBQ0UsWUFBbkM7QUFDQUYsWUFBVSxDQUFDRSxZQUFYLEdBQTBCLFVBQVVDLEtBQVYsRUFBMEIsb0NBQU50RyxJQUFNLDZFQUFOQSxJQUFNO0FBQ2xELFdBQU9vRyxlQUFlLENBQUN4QyxLQUFoQixDQUFzQnVDLFVBQXRCLEdBQW1DRixTQUFTLENBQUNLLEtBQUQsQ0FBNUMsU0FBd0R0RyxJQUF4RCxFQUFQO0FBQ0QsR0FGRDtBQUdEOztBQUVELFNBQVN1RyxRQUFULENBQW1CakssSUFBbkIsRUFBeUJELE9BQXpCLEVBQWtDO0FBQ2hDLE1BQU1tSyxPQUFPLEdBQUduSyxPQUFPLENBQUNDLElBQUQsQ0FBdkI7QUFDQSxNQUFJLENBQUNrSyxPQUFMLEVBQWM7QUFDWm5LLFdBQU8sQ0FBQ0MsSUFBRCxDQUFQLEdBQWdCLFlBQVk7QUFDMUI0SixzQkFBZ0IsQ0FBQyxJQUFELENBQWhCO0FBQ0QsS0FGRDtBQUdELEdBSkQsTUFJTztBQUNMN0osV0FBTyxDQUFDQyxJQUFELENBQVAsR0FBZ0IsWUFBbUI7QUFDakM0SixzQkFBZ0IsQ0FBQyxJQUFELENBQWhCLENBRGlDLG1DQUFObEcsSUFBTSx5REFBTkEsSUFBTTtBQUVqQyxhQUFPd0csT0FBTyxDQUFDNUMsS0FBUixDQUFjLElBQWQsRUFBb0I1RCxJQUFwQixDQUFQO0FBQ0QsS0FIRDtBQUlEO0FBQ0Y7O0FBRUQ2RixJQUFJLEdBQUcsZ0JBQXdCLEtBQWR4SixPQUFjLHVFQUFKLEVBQUk7QUFDN0JrSyxVQUFRLENBQUMsUUFBRCxFQUFXbEssT0FBWCxDQUFSO0FBQ0EsU0FBT3VKLE1BQU0sQ0FBQ3ZKLE9BQUQsQ0FBYjtBQUNELENBSEQ7O0FBS0EwSixTQUFTLEdBQUcscUJBQXdCLEtBQWQxSixPQUFjLHVFQUFKLEVBQUk7QUFDbENrSyxVQUFRLENBQUMsU0FBRCxFQUFZbEssT0FBWixDQUFSO0FBQ0EsU0FBT3lKLFdBQVcsQ0FBQ3pKLE9BQUQsQ0FBbEI7QUFDRCxDQUhEOztBQUtBLElBQU1vSyxnQkFBZ0IsR0FBRztBQUN2QixtQkFEdUI7QUFFdkIsZUFGdUI7QUFHdkIsbUJBSHVCO0FBSXZCLGNBSnVCO0FBS3ZCLFVBTHVCO0FBTXZCLGNBTnVCLENBQXpCOzs7QUFTQSxTQUFTQyxTQUFULENBQW9CQyxFQUFwQixFQUF3QkMsS0FBeEIsRUFBK0I7QUFDN0IsTUFBTVQsVUFBVSxHQUFHUSxFQUFFLENBQUNFLEdBQUgsQ0FBT0YsRUFBRSxDQUFDRyxNQUFWLENBQW5CO0FBQ0FGLE9BQUssQ0FBQ3RMLE9BQU4sQ0FBYyxVQUFBeUwsSUFBSSxFQUFJO0FBQ3BCLFFBQUkvTixNQUFNLENBQUNtTixVQUFELEVBQWFZLElBQWIsQ0FBVixFQUE4QjtBQUM1QkosUUFBRSxDQUFDSSxJQUFELENBQUYsR0FBV1osVUFBVSxDQUFDWSxJQUFELENBQXJCO0FBQ0Q7QUFDRixHQUpEO0FBS0Q7O0FBRUQsU0FBU0MsT0FBVCxDQUFrQmpNLElBQWxCLEVBQXdCa00sVUFBeEIsRUFBb0M7QUFDbEMsTUFBSSxDQUFDQSxVQUFMLEVBQWlCO0FBQ2YsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsTUFBSXBDLGFBQUl4SSxPQUFKLElBQWUvQixLQUFLLENBQUNDLE9BQU4sQ0FBY3NLLGFBQUl4SSxPQUFKLENBQVl0QixJQUFaLENBQWQsQ0FBbkIsRUFBcUQ7QUFDbkQsV0FBTyxJQUFQO0FBQ0Q7O0FBRURrTSxZQUFVLEdBQUdBLFVBQVUsQ0FBQ0MsT0FBWCxJQUFzQkQsVUFBbkM7O0FBRUEsTUFBSXhPLElBQUksQ0FBQ3dPLFVBQUQsQ0FBUixFQUFzQjtBQUNwQixRQUFJeE8sSUFBSSxDQUFDd08sVUFBVSxDQUFDRSxhQUFYLENBQXlCcE0sSUFBekIsQ0FBRCxDQUFSLEVBQTBDO0FBQ3hDLGFBQU8sSUFBUDtBQUNEO0FBQ0QsUUFBSWtNLFVBQVUsQ0FBQ0csS0FBWDtBQUNGSCxjQUFVLENBQUNHLEtBQVgsQ0FBaUIvSyxPQURmO0FBRUYvQixTQUFLLENBQUNDLE9BQU4sQ0FBYzBNLFVBQVUsQ0FBQ0csS0FBWCxDQUFpQi9LLE9BQWpCLENBQXlCdEIsSUFBekIsQ0FBZCxDQUZGLEVBRWlEO0FBQy9DLGFBQU8sSUFBUDtBQUNEO0FBQ0QsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBSXRDLElBQUksQ0FBQ3dPLFVBQVUsQ0FBQ2xNLElBQUQsQ0FBWCxDQUFSLEVBQTRCO0FBQzFCLFdBQU8sSUFBUDtBQUNEO0FBQ0QsTUFBTXNNLE1BQU0sR0FBR0osVUFBVSxDQUFDSSxNQUExQjtBQUNBLE1BQUkvTSxLQUFLLENBQUNDLE9BQU4sQ0FBYzhNLE1BQWQsQ0FBSixFQUEyQjtBQUN6QixXQUFPLENBQUMsQ0FBQ0EsTUFBTSxDQUFDQyxJQUFQLENBQVksVUFBQUMsS0FBSyxVQUFJUCxPQUFPLENBQUNqTSxJQUFELEVBQU93TSxLQUFQLENBQVgsRUFBakIsQ0FBVDtBQUNEO0FBQ0Y7O0FBRUQsU0FBU0MsU0FBVCxDQUFvQkMsU0FBcEIsRUFBK0JoTixLQUEvQixFQUFzQ3dNLFVBQXRDLEVBQWtEO0FBQ2hEeE0sT0FBSyxDQUFDYSxPQUFOLENBQWMsVUFBQVAsSUFBSSxFQUFJO0FBQ3BCLFFBQUlpTSxPQUFPLENBQUNqTSxJQUFELEVBQU9rTSxVQUFQLENBQVgsRUFBK0I7QUFDN0JRLGVBQVMsQ0FBQzFNLElBQUQsQ0FBVCxHQUFrQixVQUFVaUYsSUFBVixFQUFnQjtBQUNoQyxlQUFPLEtBQUswSCxHQUFMLElBQVksS0FBS0EsR0FBTCxDQUFTQyxXQUFULENBQXFCNU0sSUFBckIsRUFBMkJpRixJQUEzQixDQUFuQjtBQUNELE9BRkQ7QUFHRDtBQUNGLEdBTkQ7QUFPRDs7QUFFRCxTQUFTNEgsZ0JBQVQsQ0FBMkIvQyxHQUEzQixFQUFnQ29DLFVBQWhDLEVBQTRDO0FBQzFDQSxZQUFVLEdBQUdBLFVBQVUsQ0FBQ0MsT0FBWCxJQUFzQkQsVUFBbkM7QUFDQSxNQUFJWSxZQUFKO0FBQ0EsTUFBSXBQLElBQUksQ0FBQ3dPLFVBQUQsQ0FBUixFQUFzQjtBQUNwQlksZ0JBQVksR0FBR1osVUFBZjtBQUNBQSxjQUFVLEdBQUdZLFlBQVksQ0FBQ1YsYUFBMUI7QUFDRCxHQUhELE1BR087QUFDTFUsZ0JBQVksR0FBR2hELEdBQUcsQ0FBQ2lELE1BQUosQ0FBV2IsVUFBWCxDQUFmO0FBQ0Q7QUFDRCxTQUFPLENBQUNZLFlBQUQsRUFBZVosVUFBZixDQUFQO0FBQ0Q7O0FBRUQsU0FBU2MsU0FBVCxDQUFvQnBCLEVBQXBCLEVBQXdCcUIsUUFBeEIsRUFBa0M7QUFDaEMsTUFBSTFOLEtBQUssQ0FBQ0MsT0FBTixDQUFjeU4sUUFBZCxLQUEyQkEsUUFBUSxDQUFDck4sTUFBeEMsRUFBZ0Q7QUFDOUMsUUFBTXNOLE1BQU0sR0FBRzVQLE1BQU0sQ0FBQ2dCLE1BQVAsQ0FBYyxJQUFkLENBQWY7QUFDQTJPLFlBQVEsQ0FBQzFNLE9BQVQsQ0FBaUIsVUFBQTRNLFFBQVEsRUFBSTtBQUMzQkQsWUFBTSxDQUFDQyxRQUFELENBQU4sR0FBbUIsSUFBbkI7QUFDRCxLQUZEO0FBR0F2QixNQUFFLENBQUN3QixZQUFILEdBQWtCeEIsRUFBRSxDQUFDc0IsTUFBSCxHQUFZQSxNQUE5QjtBQUNEO0FBQ0Y7O0FBRUQsU0FBU0csVUFBVCxDQUFxQkMsTUFBckIsRUFBNkJsQyxVQUE3QixFQUF5QztBQUN2Q2tDLFFBQU0sR0FBRyxDQUFDQSxNQUFNLElBQUksRUFBWCxFQUFlQyxLQUFmLENBQXFCLEdBQXJCLENBQVQ7QUFDQSxNQUFNL0gsR0FBRyxHQUFHOEgsTUFBTSxDQUFDMU4sTUFBbkI7O0FBRUEsTUFBSTRGLEdBQUcsS0FBSyxDQUFaLEVBQWU7QUFDYjRGLGNBQVUsQ0FBQ29DLE9BQVgsR0FBcUJGLE1BQU0sQ0FBQyxDQUFELENBQTNCO0FBQ0QsR0FGRCxNQUVPLElBQUk5SCxHQUFHLEtBQUssQ0FBWixFQUFlO0FBQ3BCNEYsY0FBVSxDQUFDb0MsT0FBWCxHQUFxQkYsTUFBTSxDQUFDLENBQUQsQ0FBM0I7QUFDQWxDLGNBQVUsQ0FBQ3FDLFFBQVgsR0FBc0JILE1BQU0sQ0FBQyxDQUFELENBQTVCO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTSSxRQUFULENBQW1CeEIsVUFBbkIsRUFBK0J5QixPQUEvQixFQUF3QztBQUN0QyxNQUFJOU0sSUFBSSxHQUFHcUwsVUFBVSxDQUFDckwsSUFBWCxJQUFtQixFQUE5QjtBQUNBLE1BQU0rTSxPQUFPLEdBQUcxQixVQUFVLENBQUMwQixPQUFYLElBQXNCLEVBQXRDOztBQUVBLE1BQUksT0FBTy9NLElBQVAsS0FBZ0IsVUFBcEIsRUFBZ0M7QUFDOUIsUUFBSTtBQUNGQSxVQUFJLEdBQUdBLElBQUksQ0FBQzdDLElBQUwsQ0FBVTJQLE9BQVYsQ0FBUCxDQURFLENBQ3lCO0FBQzVCLEtBRkQsQ0FFRSxPQUFPaEQsQ0FBUCxFQUFVO0FBQ1YsVUFBSWtELCtFQUFBLENBQVlDLGFBQWhCLEVBQStCO0FBQzdCM0gsZUFBTyxDQUFDb0MsSUFBUixDQUFhLHdFQUFiLEVBQXVGMUgsSUFBdkY7QUFDRDtBQUNGO0FBQ0YsR0FSRCxNQVFPO0FBQ0wsUUFBSTtBQUNGO0FBQ0FBLFVBQUksR0FBRzRKLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNzRCxTQUFMLENBQWVsTixJQUFmLENBQVgsQ0FBUDtBQUNELEtBSEQsQ0FHRSxPQUFPOEosQ0FBUCxFQUFVLENBQUU7QUFDZjs7QUFFRCxNQUFJLENBQUM3TSxhQUFhLENBQUMrQyxJQUFELENBQWxCLEVBQTBCO0FBQ3hCQSxRQUFJLEdBQUcsRUFBUDtBQUNEOztBQUVEdkQsUUFBTSxDQUFDZ0QsSUFBUCxDQUFZc04sT0FBWixFQUFxQnJOLE9BQXJCLENBQTZCLFVBQUEwRixVQUFVLEVBQUk7QUFDekMsUUFBSTBILE9BQU8sQ0FBQ0ssbUJBQVIsQ0FBNEJuTyxPQUE1QixDQUFvQ29HLFVBQXBDLE1BQW9ELENBQUMsQ0FBckQsSUFBMEQsQ0FBQ2hJLE1BQU0sQ0FBQzRDLElBQUQsRUFBT29GLFVBQVAsQ0FBckUsRUFBeUY7QUFDdkZwRixVQUFJLENBQUNvRixVQUFELENBQUosR0FBbUIySCxPQUFPLENBQUMzSCxVQUFELENBQTFCO0FBQ0Q7QUFDRixHQUpEOztBQU1BLFNBQU9wRixJQUFQO0FBQ0Q7O0FBRUQsSUFBTW9OLFVBQVUsR0FBRyxDQUFDQyxNQUFELEVBQVN6SixNQUFULEVBQWlCMEosT0FBakIsRUFBMEI3USxNQUExQixFQUFrQ2lDLEtBQWxDLEVBQXlDLElBQXpDLENBQW5COztBQUVBLFNBQVM2TyxjQUFULENBQXlCN00sSUFBekIsRUFBK0I7QUFDN0IsU0FBTyxTQUFTOE0sUUFBVCxDQUFtQkMsTUFBbkIsRUFBMkJDLE1BQTNCLEVBQW1DO0FBQ3hDLFFBQUksS0FBSzVCLEdBQVQsRUFBYztBQUNaLFdBQUtBLEdBQUwsQ0FBU3BMLElBQVQsSUFBaUIrTSxNQUFqQixDQURZLENBQ2E7QUFDMUI7QUFDRixHQUpEO0FBS0Q7O0FBRUQsU0FBU0UsYUFBVCxDQUF3QnRDLFVBQXhCLEVBQW9DdUMsWUFBcEMsRUFBa0Q7QUFDaEQsTUFBTUMsWUFBWSxHQUFHeEMsVUFBVSxDQUFDLFdBQUQsQ0FBL0I7QUFDQSxNQUFNeUMsVUFBVSxHQUFHekMsVUFBVSxDQUFDLFNBQUQsQ0FBN0I7QUFDQSxNQUFNMEMsU0FBUyxHQUFHMUMsVUFBVSxDQUFDLFFBQUQsQ0FBNUI7O0FBRUEsTUFBSTJDLFFBQVEsR0FBRzNDLFVBQVUsQ0FBQyxPQUFELENBQXpCOztBQUVBLE1BQUksQ0FBQzJDLFFBQUwsRUFBZTtBQUNiM0MsY0FBVSxDQUFDLE9BQUQsQ0FBVixHQUFzQjJDLFFBQVEsR0FBRyxFQUFqQztBQUNEOztBQUVELE1BQU1DLFNBQVMsR0FBRyxFQUFsQjtBQUNBLE1BQUl2UCxLQUFLLENBQUNDLE9BQU4sQ0FBY2tQLFlBQWQsQ0FBSixFQUFpQztBQUMvQkEsZ0JBQVksQ0FBQ25PLE9BQWIsQ0FBcUIsVUFBQXdPLFFBQVEsRUFBSTtBQUMvQkQsZUFBUyxDQUFDaFAsSUFBVixDQUFlaVAsUUFBUSxDQUFDcFEsT0FBVCxDQUFpQixRQUFqQixFQUE4QixNQUE5QixlQUFmO0FBQ0EsVUFBSW9RLFFBQVEsS0FBSyxrQkFBakIsRUFBcUM7QUFDbkMsWUFBSXhQLEtBQUssQ0FBQ0MsT0FBTixDQUFjcVAsUUFBZCxDQUFKLEVBQTZCO0FBQzNCQSxrQkFBUSxDQUFDL08sSUFBVCxDQUFjLE1BQWQ7QUFDQStPLGtCQUFRLENBQUMvTyxJQUFULENBQWMsT0FBZDtBQUNELFNBSEQsTUFHTztBQUNMK08sa0JBQVEsQ0FBQyxNQUFELENBQVIsR0FBbUI7QUFDakI5SCxnQkFBSSxFQUFFbUgsTUFEVztBQUVqQi9CLG1CQUFPLEVBQUUsRUFGUSxFQUFuQjs7QUFJQTBDLGtCQUFRLENBQUMsT0FBRCxDQUFSLEdBQW9CO0FBQ2xCOUgsZ0JBQUksRUFBRSxDQUFDbUgsTUFBRCxFQUFTekosTUFBVCxFQUFpQjBKLE9BQWpCLEVBQTBCNU8sS0FBMUIsRUFBaUNqQyxNQUFqQyxFQUF5QzBSLElBQXpDLENBRFk7QUFFbEI3QyxtQkFBTyxFQUFFLEVBRlMsRUFBcEI7O0FBSUQ7QUFDRjtBQUNGLEtBakJEO0FBa0JEO0FBQ0QsTUFBSXJPLGFBQWEsQ0FBQzZRLFVBQUQsQ0FBYixJQUE2QkEsVUFBVSxDQUFDTSxLQUE1QyxFQUFtRDtBQUNqREgsYUFBUyxDQUFDaFAsSUFBVjtBQUNFMk8sZ0JBQVksQ0FBQztBQUNYUyxnQkFBVSxFQUFFQyxjQUFjLENBQUNSLFVBQVUsQ0FBQ00sS0FBWixFQUFtQixJQUFuQixDQURmLEVBQUQsQ0FEZDs7O0FBS0Q7QUFDRCxNQUFJMVAsS0FBSyxDQUFDQyxPQUFOLENBQWNvUCxTQUFkLENBQUosRUFBOEI7QUFDNUJBLGFBQVMsQ0FBQ3JPLE9BQVYsQ0FBa0IsVUFBQTZPLFFBQVEsRUFBSTtBQUM1QixVQUFJdFIsYUFBYSxDQUFDc1IsUUFBRCxDQUFiLElBQTJCQSxRQUFRLENBQUNILEtBQXhDLEVBQStDO0FBQzdDSCxpQkFBUyxDQUFDaFAsSUFBVjtBQUNFMk8sb0JBQVksQ0FBQztBQUNYUyxvQkFBVSxFQUFFQyxjQUFjLENBQUNDLFFBQVEsQ0FBQ0gsS0FBVixFQUFpQixJQUFqQixDQURmLEVBQUQsQ0FEZDs7O0FBS0Q7QUFDRixLQVJEO0FBU0Q7QUFDRCxTQUFPSCxTQUFQO0FBQ0Q7O0FBRUQsU0FBU08sYUFBVCxDQUF3Qm5SLEdBQXhCLEVBQTZCNkksSUFBN0IsRUFBbUN1SSxZQUFuQyxFQUFpREMsSUFBakQsRUFBdUQ7QUFDckQ7QUFDQSxNQUFJaFEsS0FBSyxDQUFDQyxPQUFOLENBQWN1SCxJQUFkLEtBQXVCQSxJQUFJLENBQUNuSCxNQUFMLEtBQWdCLENBQTNDLEVBQThDO0FBQzVDLFdBQU9tSCxJQUFJLENBQUMsQ0FBRCxDQUFYO0FBQ0Q7QUFDRDtBQUNFO0FBQ0V1SSxnQkFBWSxLQUFLLEtBQWpCO0FBQ0EvUCxTQUFLLENBQUNDLE9BQU4sQ0FBY3VILElBQWQsQ0FEQTtBQUVBQSxRQUFJLENBQUNuSCxNQUFMLEtBQWdCLENBRmhCO0FBR0FtSCxRQUFJLENBQUNsSCxPQUFMLENBQWFxTyxNQUFiLE1BQXlCLENBQUMsQ0FIMUI7QUFJQW5ILFFBQUksQ0FBQ2xILE9BQUwsQ0FBYXNPLE9BQWIsTUFBMEIsQ0FBQyxDQUw3QjtBQU1FLEtBQUU7QUFDRixVQUFJb0IsSUFBSixFQUFVO0FBQ1JwSixlQUFPLENBQUNvQyxJQUFSO0FBQ1dySyxXQURYLHFFQUN5RXFSLElBRHpFOztBQUdEO0FBQ0QsYUFBT3BCLE9BQVA7QUFDRDtBQUNGO0FBQ0QsU0FBT3BILElBQVA7QUFDRDs7QUFFRCxTQUFTb0ksY0FBVCxDQUF5QkYsS0FBekIsRUFBK0QsS0FBL0JPLFVBQStCLHVFQUFsQixLQUFrQixLQUFYRCxJQUFXLHVFQUFKLEVBQUk7QUFDN0QsTUFBTUwsVUFBVSxHQUFHLEVBQW5CO0FBQ0EsTUFBSSxDQUFDTSxVQUFMLEVBQWlCO0FBQ2ZOLGNBQVUsQ0FBQ08sS0FBWCxHQUFtQjtBQUNqQjFJLFVBQUksRUFBRW1ILE1BRFc7QUFFakJ6SyxXQUFLLEVBQUUsRUFGVSxFQUFuQjs7QUFJQXlMLGNBQVUsQ0FBQ2pDLFFBQVgsR0FBc0IsRUFBRTtBQUN0QmxHLFVBQUksRUFBRSxJQURjO0FBRXBCdEQsV0FBSyxFQUFFLEVBRmE7QUFHcEI0SyxjQUFRLEVBQUUsa0JBQVVDLE1BQVYsRUFBa0JDLE1BQWxCLEVBQTBCO0FBQ2xDLFlBQU1yQixNQUFNLEdBQUc1UCxNQUFNLENBQUNnQixNQUFQLENBQWMsSUFBZCxDQUFmO0FBQ0FnUSxjQUFNLENBQUMvTixPQUFQLENBQWUsVUFBQTRNLFFBQVEsRUFBSTtBQUN6QkQsZ0JBQU0sQ0FBQ0MsUUFBRCxDQUFOLEdBQW1CLElBQW5CO0FBQ0QsU0FGRDtBQUdBLGFBQUt1QyxPQUFMLENBQWE7QUFDWHhDLGdCQUFNLEVBQU5BLE1BRFcsRUFBYjs7QUFHRCxPQVhtQixFQUF0Qjs7QUFhRDtBQUNELE1BQUkzTixLQUFLLENBQUNDLE9BQU4sQ0FBY3lQLEtBQWQsQ0FBSixFQUEwQixDQUFFO0FBQzFCQSxTQUFLLENBQUMxTyxPQUFOLENBQWMsVUFBQXJDLEdBQUcsRUFBSTtBQUNuQmdSLGdCQUFVLENBQUNoUixHQUFELENBQVYsR0FBa0I7QUFDaEI2SSxZQUFJLEVBQUUsSUFEVTtBQUVoQnNILGdCQUFRLEVBQUVELGNBQWMsQ0FBQ2xRLEdBQUQsQ0FGUixFQUFsQjs7QUFJRCxLQUxEO0FBTUQsR0FQRCxNQU9PLElBQUlKLGFBQWEsQ0FBQ21SLEtBQUQsQ0FBakIsRUFBMEIsQ0FBRTtBQUNqQzNSLFVBQU0sQ0FBQ2dELElBQVAsQ0FBWTJPLEtBQVosRUFBbUIxTyxPQUFuQixDQUEyQixVQUFBckMsR0FBRyxFQUFJO0FBQ2hDLFVBQU15UixJQUFJLEdBQUdWLEtBQUssQ0FBQy9RLEdBQUQsQ0FBbEI7QUFDQSxVQUFJSixhQUFhLENBQUM2UixJQUFELENBQWpCLEVBQXlCLENBQUU7QUFDekIsWUFBSWxNLEtBQUssR0FBR2tNLElBQUksQ0FBQyxTQUFELENBQWhCO0FBQ0EsWUFBSWpTLElBQUksQ0FBQytGLEtBQUQsQ0FBUixFQUFpQjtBQUNmQSxlQUFLLEdBQUdBLEtBQUssRUFBYjtBQUNEOztBQUVEa00sWUFBSSxDQUFDNUksSUFBTCxHQUFZc0ksYUFBYSxDQUFDblIsR0FBRCxFQUFNeVIsSUFBSSxDQUFDNUksSUFBWCxFQUFpQnRELEtBQWpCLEVBQXdCOEwsSUFBeEIsQ0FBekI7O0FBRUFMLGtCQUFVLENBQUNoUixHQUFELENBQVYsR0FBa0I7QUFDaEI2SSxjQUFJLEVBQUVrSCxVQUFVLENBQUNwTyxPQUFYLENBQW1COFAsSUFBSSxDQUFDNUksSUFBeEIsTUFBa0MsQ0FBQyxDQUFuQyxHQUF1QzRJLElBQUksQ0FBQzVJLElBQTVDLEdBQW1ELElBRHpDO0FBRWhCdEQsZUFBSyxFQUFMQSxLQUZnQjtBQUdoQjRLLGtCQUFRLEVBQUVELGNBQWMsQ0FBQ2xRLEdBQUQsQ0FIUixFQUFsQjs7QUFLRCxPQWJELE1BYU8sQ0FBRTtBQUNQLFlBQU02SSxJQUFJLEdBQUdzSSxhQUFhLENBQUNuUixHQUFELEVBQU15UixJQUFOLEVBQVksSUFBWixFQUFrQkosSUFBbEIsQ0FBMUI7QUFDQUwsa0JBQVUsQ0FBQ2hSLEdBQUQsQ0FBVixHQUFrQjtBQUNoQjZJLGNBQUksRUFBRWtILFVBQVUsQ0FBQ3BPLE9BQVgsQ0FBbUJrSCxJQUFuQixNQUE2QixDQUFDLENBQTlCLEdBQWtDQSxJQUFsQyxHQUF5QyxJQUQvQjtBQUVoQnNILGtCQUFRLEVBQUVELGNBQWMsQ0FBQ2xRLEdBQUQsQ0FGUixFQUFsQjs7QUFJRDtBQUNGLEtBdEJEO0FBdUJEO0FBQ0QsU0FBT2dSLFVBQVA7QUFDRDs7QUFFRCxTQUFTVSxTQUFULENBQW9CckUsS0FBcEIsRUFBMkI7QUFDekI7QUFDQSxNQUFJO0FBQ0ZBLFNBQUssQ0FBQ3NFLEVBQU4sR0FBV3BGLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNzRCxTQUFMLENBQWV4QyxLQUFmLENBQVgsQ0FBWDtBQUNELEdBRkQsQ0FFRSxPQUFPWixDQUFQLEVBQVUsQ0FBRTs7QUFFZFksT0FBSyxDQUFDdUUsZUFBTixHQUF3QjNSLElBQXhCO0FBQ0FvTixPQUFLLENBQUN3RSxjQUFOLEdBQXVCNVIsSUFBdkI7O0FBRUFvTixPQUFLLENBQUN5RSxNQUFOLEdBQWV6RSxLQUFLLENBQUN5RSxNQUFOLElBQWdCLEVBQS9COztBQUVBLE1BQUksQ0FBQy9SLE1BQU0sQ0FBQ3NOLEtBQUQsRUFBUSxRQUFSLENBQVgsRUFBOEI7QUFDNUJBLFNBQUssQ0FBQzBFLE1BQU4sR0FBZSxFQUFmO0FBQ0Q7O0FBRUQsR0FBRTtBQUNBO0FBQ0VuUyxpQkFBYSxDQUFDeU4sS0FBSyxDQUFDMEUsTUFBUCxDQUFiO0FBQ0FoUyxVQUFNLENBQUNzTixLQUFLLENBQUMwRSxNQUFQLEVBQWUsU0FBZixDQUROO0FBRUEsS0FBQ2hTLE1BQU0sQ0FBQ3NOLEtBQUssQ0FBQzBFLE1BQVAsRUFBZSxPQUFmLENBSFQ7QUFJRTtBQUNBMUUsV0FBSyxDQUFDMEUsTUFBTixDQUFheE0sS0FBYixHQUFxQjhILEtBQUssQ0FBQzBFLE1BQU4sQ0FBYUMsT0FBbEM7QUFDRDtBQUNGOztBQUVELE1BQUlwUyxhQUFhLENBQUN5TixLQUFLLENBQUMwRSxNQUFQLENBQWpCLEVBQWlDO0FBQy9CMUUsU0FBSyxDQUFDeUUsTUFBTixHQUFlMVMsTUFBTSxDQUFDZ0csTUFBUCxDQUFjLEVBQWQsRUFBa0JpSSxLQUFLLENBQUN5RSxNQUF4QixFQUFnQ3pFLEtBQUssQ0FBQzBFLE1BQXRDLENBQWY7QUFDRDs7QUFFRCxTQUFPMUUsS0FBUDtBQUNEOztBQUVELFNBQVM0RSxhQUFULENBQXdCdkUsRUFBeEIsRUFBNEJ3RSxjQUE1QixFQUE0QztBQUMxQyxNQUFJekMsT0FBTyxHQUFHL0IsRUFBZDtBQUNBd0UsZ0JBQWMsQ0FBQzdQLE9BQWYsQ0FBdUIsVUFBQThQLGFBQWEsRUFBSTtBQUN0QyxRQUFNQyxRQUFRLEdBQUdELGFBQWEsQ0FBQyxDQUFELENBQTlCO0FBQ0EsUUFBTTVNLEtBQUssR0FBRzRNLGFBQWEsQ0FBQyxDQUFELENBQTNCO0FBQ0EsUUFBSUMsUUFBUSxJQUFJLE9BQU83TSxLQUFQLEtBQWlCLFdBQWpDLEVBQThDLENBQUU7QUFDOUMsVUFBTThNLFFBQVEsR0FBR0YsYUFBYSxDQUFDLENBQUQsQ0FBOUI7QUFDQSxVQUFNRyxTQUFTLEdBQUdILGFBQWEsQ0FBQyxDQUFELENBQS9COztBQUVBLFVBQU1JLElBQUksR0FBR0gsUUFBUSxHQUFHMUUsRUFBRSxDQUFDOEUsV0FBSCxDQUFlSixRQUFmLEVBQXlCM0MsT0FBekIsQ0FBSCxHQUF1Q0EsT0FBNUQ7O0FBRUEsVUFBSWxKLE1BQU0sQ0FBQ2tNLFNBQVAsQ0FBaUJGLElBQWpCLENBQUosRUFBNEI7QUFDMUI5QyxlQUFPLEdBQUdsSyxLQUFWO0FBQ0QsT0FGRCxNQUVPLElBQUksQ0FBQzhNLFFBQUwsRUFBZTtBQUNwQjVDLGVBQU8sR0FBRzhDLElBQUksQ0FBQ2hOLEtBQUQsQ0FBZDtBQUNELE9BRk0sTUFFQTtBQUNMLFlBQUlsRSxLQUFLLENBQUNDLE9BQU4sQ0FBY2lSLElBQWQsQ0FBSixFQUF5QjtBQUN2QjlDLGlCQUFPLEdBQUc4QyxJQUFJLENBQUNsRSxJQUFMLENBQVUsVUFBQXFFLFFBQVEsRUFBSTtBQUM5QixtQkFBT2hGLEVBQUUsQ0FBQzhFLFdBQUgsQ0FBZUgsUUFBZixFQUF5QkssUUFBekIsTUFBdUNuTixLQUE5QztBQUNELFdBRlMsQ0FBVjtBQUdELFNBSkQsTUFJTyxJQUFJM0YsYUFBYSxDQUFDMlMsSUFBRCxDQUFqQixFQUF5QjtBQUM5QjlDLGlCQUFPLEdBQUdyUSxNQUFNLENBQUNnRCxJQUFQLENBQVltUSxJQUFaLEVBQWtCbEUsSUFBbEIsQ0FBdUIsVUFBQXNFLE9BQU8sRUFBSTtBQUMxQyxtQkFBT2pGLEVBQUUsQ0FBQzhFLFdBQUgsQ0FBZUgsUUFBZixFQUF5QkUsSUFBSSxDQUFDSSxPQUFELENBQTdCLE1BQTRDcE4sS0FBbkQ7QUFDRCxXQUZTLENBQVY7QUFHRCxTQUpNLE1BSUE7QUFDTDBDLGlCQUFPLENBQUNDLEtBQVIsQ0FBYyxpQkFBZCxFQUFpQ3FLLElBQWpDO0FBQ0Q7QUFDRjs7QUFFRCxVQUFJRCxTQUFKLEVBQWU7QUFDYjdDLGVBQU8sR0FBRy9CLEVBQUUsQ0FBQzhFLFdBQUgsQ0FBZUYsU0FBZixFQUEwQjdDLE9BQTFCLENBQVY7QUFDRDtBQUNGO0FBQ0YsR0EvQkQ7QUFnQ0EsU0FBT0EsT0FBUDtBQUNEOztBQUVELFNBQVNtRCxpQkFBVCxDQUE0QmxGLEVBQTVCLEVBQWdDbUYsS0FBaEMsRUFBdUN4RixLQUF2QyxFQUE4QztBQUM1QyxNQUFNeUYsUUFBUSxHQUFHLEVBQWpCOztBQUVBLE1BQUl6UixLQUFLLENBQUNDLE9BQU4sQ0FBY3VSLEtBQWQsS0FBd0JBLEtBQUssQ0FBQ25SLE1BQWxDLEVBQTBDO0FBQ3hDOzs7Ozs7Ozs7OztBQVdBbVIsU0FBSyxDQUFDeFEsT0FBTixDQUFjLFVBQUMrUCxRQUFELEVBQVdyUSxLQUFYLEVBQXFCO0FBQ2pDLFVBQUksT0FBT3FRLFFBQVAsS0FBb0IsUUFBeEIsRUFBa0M7QUFDaEMsWUFBSSxDQUFDQSxRQUFMLEVBQWUsQ0FBRTtBQUNmVSxrQkFBUSxDQUFDLE1BQU0vUSxLQUFQLENBQVIsR0FBd0IyTCxFQUF4QjtBQUNELFNBRkQsTUFFTztBQUNMLGNBQUkwRSxRQUFRLEtBQUssUUFBakIsRUFBMkIsQ0FBRTtBQUMzQlUsb0JBQVEsQ0FBQyxNQUFNL1EsS0FBUCxDQUFSLEdBQXdCc0wsS0FBeEI7QUFDRCxXQUZELE1BRU8sSUFBSStFLFFBQVEsQ0FBQ3pRLE9BQVQsQ0FBaUIsU0FBakIsTUFBZ0MsQ0FBcEMsRUFBdUMsQ0FBRTtBQUM5Q21SLG9CQUFRLENBQUMsTUFBTS9RLEtBQVAsQ0FBUixHQUF3QjJMLEVBQUUsQ0FBQzhFLFdBQUgsQ0FBZUosUUFBUSxDQUFDM1IsT0FBVCxDQUFpQixTQUFqQixFQUE0QixFQUE1QixDQUFmLEVBQWdENE0sS0FBaEQsQ0FBeEI7QUFDRCxXQUZNLE1BRUE7QUFDTHlGLG9CQUFRLENBQUMsTUFBTS9RLEtBQVAsQ0FBUixHQUF3QjJMLEVBQUUsQ0FBQzhFLFdBQUgsQ0FBZUosUUFBZixDQUF4QjtBQUNEO0FBQ0Y7QUFDRixPQVpELE1BWU87QUFDTFUsZ0JBQVEsQ0FBQyxNQUFNL1EsS0FBUCxDQUFSLEdBQXdCa1EsYUFBYSxDQUFDdkUsRUFBRCxFQUFLMEUsUUFBTCxDQUFyQztBQUNEO0FBQ0YsS0FoQkQ7QUFpQkQ7O0FBRUQsU0FBT1UsUUFBUDtBQUNEOztBQUVELFNBQVNDLGFBQVQsQ0FBd0JDLEdBQXhCLEVBQTZCO0FBQzNCLE1BQU1uVCxHQUFHLEdBQUcsRUFBWjtBQUNBLE9BQUssSUFBSTRCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd1UixHQUFHLENBQUN0UixNQUF4QixFQUFnQ0QsQ0FBQyxFQUFqQyxFQUFxQztBQUNuQyxRQUFNd1IsT0FBTyxHQUFHRCxHQUFHLENBQUN2UixDQUFELENBQW5CO0FBQ0E1QixPQUFHLENBQUNvVCxPQUFPLENBQUMsQ0FBRCxDQUFSLENBQUgsR0FBa0JBLE9BQU8sQ0FBQyxDQUFELENBQXpCO0FBQ0Q7QUFDRCxTQUFPcFQsR0FBUDtBQUNEOztBQUVELFNBQVNxVCxnQkFBVCxDQUEyQnhGLEVBQTNCLEVBQStCTCxLQUEvQixFQUFtRixLQUE3Q3RHLElBQTZDLHVFQUF0QyxFQUFzQyxLQUFsQzhMLEtBQWtDLHVFQUExQixFQUEwQixLQUF0Qk0sUUFBc0IsdURBQVpwTCxVQUFZO0FBQ2pGLE1BQUlxTCxlQUFlLEdBQUcsS0FBdEIsQ0FEaUYsQ0FDcEQ7QUFDN0IsTUFBSUQsUUFBSixFQUFjLENBQUU7QUFDZEMsbUJBQWUsR0FBRy9GLEtBQUssQ0FBQ2dHLGFBQU47QUFDaEJoRyxTQUFLLENBQUNnRyxhQUFOLENBQW9CQyxPQURKO0FBRWhCakcsU0FBSyxDQUFDZ0csYUFBTixDQUFvQkMsT0FBcEIsQ0FBNEJDLE9BQTVCLEtBQXdDLElBRjFDO0FBR0EsUUFBSSxDQUFDeE0sSUFBSSxDQUFDckYsTUFBVixFQUFrQixDQUFFO0FBQ2xCLFVBQUkwUixlQUFKLEVBQXFCO0FBQ25CLGVBQU8sQ0FBQy9GLEtBQUQsQ0FBUDtBQUNEO0FBQ0QsYUFBT0EsS0FBSyxDQUFDMEUsTUFBTixDQUFheUIsUUFBYixJQUF5Qm5HLEtBQUssQ0FBQzBFLE1BQXRDO0FBQ0Q7QUFDRjs7QUFFRCxNQUFNZSxRQUFRLEdBQUdGLGlCQUFpQixDQUFDbEYsRUFBRCxFQUFLbUYsS0FBTCxFQUFZeEYsS0FBWixDQUFsQzs7QUFFQSxNQUFNb0csR0FBRyxHQUFHLEVBQVo7QUFDQTFNLE1BQUksQ0FBQzFFLE9BQUwsQ0FBYSxVQUFBcVIsR0FBRyxFQUFJO0FBQ2xCLFFBQUlBLEdBQUcsS0FBSyxRQUFaLEVBQXNCO0FBQ3BCLFVBQUkzTCxVQUFVLEtBQUssYUFBZixJQUFnQyxDQUFDb0wsUUFBckMsRUFBK0MsQ0FBRTtBQUMvQ00sV0FBRyxDQUFDN1IsSUFBSixDQUFTeUwsS0FBSyxDQUFDeUUsTUFBTixDQUFhdk0sS0FBdEI7QUFDRCxPQUZELE1BRU87QUFDTCxZQUFJNE4sUUFBUSxJQUFJLENBQUNDLGVBQWpCLEVBQWtDO0FBQ2hDSyxhQUFHLENBQUM3UixJQUFKLENBQVN5TCxLQUFLLENBQUMwRSxNQUFOLENBQWF5QixRQUFiLENBQXNCLENBQXRCLENBQVQ7QUFDRCxTQUZELE1BRU8sQ0FBRTtBQUNQQyxhQUFHLENBQUM3UixJQUFKLENBQVN5TCxLQUFUO0FBQ0Q7QUFDRjtBQUNGLEtBVkQsTUFVTztBQUNMLFVBQUloTSxLQUFLLENBQUNDLE9BQU4sQ0FBY29TLEdBQWQsS0FBc0JBLEdBQUcsQ0FBQyxDQUFELENBQUgsS0FBVyxHQUFyQyxFQUEwQztBQUN4Q0QsV0FBRyxDQUFDN1IsSUFBSixDQUFTbVIsYUFBYSxDQUFDVyxHQUFELENBQXRCO0FBQ0QsT0FGRCxNQUVPLElBQUksT0FBT0EsR0FBUCxLQUFlLFFBQWYsSUFBMkIzVCxNQUFNLENBQUMrUyxRQUFELEVBQVdZLEdBQVgsQ0FBckMsRUFBc0Q7QUFDM0RELFdBQUcsQ0FBQzdSLElBQUosQ0FBU2tSLFFBQVEsQ0FBQ1ksR0FBRCxDQUFqQjtBQUNELE9BRk0sTUFFQTtBQUNMRCxXQUFHLENBQUM3UixJQUFKLENBQVM4UixHQUFUO0FBQ0Q7QUFDRjtBQUNGLEdBcEJEOztBQXNCQSxTQUFPRCxHQUFQO0FBQ0Q7O0FBRUQsSUFBTUUsSUFBSSxHQUFHLEdBQWI7QUFDQSxJQUFNQyxNQUFNLEdBQUcsR0FBZjs7QUFFQSxTQUFTQyxnQkFBVCxDQUEyQkMsU0FBM0IsRUFBc0NDLE9BQXRDLEVBQStDO0FBQzdDLFNBQVFELFNBQVMsS0FBS0MsT0FBZjs7QUFFSEEsU0FBTyxLQUFLLGNBQVo7O0FBRUVELFdBQVMsS0FBSyxPQUFkO0FBQ0FBLFdBQVMsS0FBSyxLQUhoQixDQUZKOzs7QUFRRDs7QUFFRCxTQUFTRSxXQUFULENBQXNCM0csS0FBdEIsRUFBNkI7QUFDM0JBLE9BQUssR0FBR3FFLFNBQVMsQ0FBQ3JFLEtBQUQsQ0FBakI7O0FBRUE7QUFDQSxNQUFNaUcsT0FBTyxHQUFHLENBQUNqRyxLQUFLLENBQUNnRyxhQUFOLElBQXVCaEcsS0FBSyxDQUFDeUUsTUFBOUIsRUFBc0N3QixPQUF0RDtBQUNBLE1BQUksQ0FBQ0EsT0FBTCxFQUFjO0FBQ1osV0FBT3JMLE9BQU8sQ0FBQ29DLElBQVIsOENBQVA7QUFDRDtBQUNELE1BQU00SixTQUFTLEdBQUdYLE9BQU8sQ0FBQ1csU0FBUixJQUFxQlgsT0FBTyxDQUFDLFlBQUQsQ0FBOUMsQ0FSMkIsQ0FRbUM7QUFDOUQsTUFBSSxDQUFDVyxTQUFMLEVBQWdCO0FBQ2QsV0FBT2hNLE9BQU8sQ0FBQ29DLElBQVIsOENBQVA7QUFDRDs7QUFFRDtBQUNBLE1BQU15SixTQUFTLEdBQUd6RyxLQUFLLENBQUN4RSxJQUF4Qjs7QUFFQSxNQUFNNEssR0FBRyxHQUFHLEVBQVo7O0FBRUFRLFdBQVMsQ0FBQzVSLE9BQVYsQ0FBa0IsVUFBQTZSLFFBQVEsRUFBSTtBQUM1QixRQUFJckwsSUFBSSxHQUFHcUwsUUFBUSxDQUFDLENBQUQsQ0FBbkI7QUFDQSxRQUFNQyxXQUFXLEdBQUdELFFBQVEsQ0FBQyxDQUFELENBQTVCOztBQUVBLFFBQU1mLFFBQVEsR0FBR3RLLElBQUksQ0FBQ3VMLE1BQUwsQ0FBWSxDQUFaLE1BQW1CUixNQUFwQztBQUNBL0ssUUFBSSxHQUFHc0ssUUFBUSxHQUFHdEssSUFBSSxDQUFDakYsS0FBTCxDQUFXLENBQVgsQ0FBSCxHQUFtQmlGLElBQWxDO0FBQ0EsUUFBTXdMLE1BQU0sR0FBR3hMLElBQUksQ0FBQ3VMLE1BQUwsQ0FBWSxDQUFaLE1BQW1CVCxJQUFsQztBQUNBOUssUUFBSSxHQUFHd0wsTUFBTSxHQUFHeEwsSUFBSSxDQUFDakYsS0FBTCxDQUFXLENBQVgsQ0FBSCxHQUFtQmlGLElBQWhDOztBQUVBLFFBQUlzTCxXQUFXLElBQUlOLGdCQUFnQixDQUFDQyxTQUFELEVBQVlqTCxJQUFaLENBQW5DLEVBQXNEO0FBQ3BEc0wsaUJBQVcsQ0FBQzlSLE9BQVosQ0FBb0IsVUFBQWlTLFVBQVUsRUFBSTtBQUNoQyxZQUFNdk0sVUFBVSxHQUFHdU0sVUFBVSxDQUFDLENBQUQsQ0FBN0I7QUFDQSxZQUFJdk0sVUFBSixFQUFnQjtBQUNkLGNBQUl3TSxVQUFVLEdBQUcsS0FBSSxDQUFDOUYsR0FBdEI7QUFDQTtBQUNFOEYsb0JBQVUsQ0FBQ0MsUUFBWCxDQUFvQkMsT0FBcEI7QUFDQUYsb0JBQVUsQ0FBQ0csT0FEWDtBQUVBSCxvQkFBVSxDQUFDRyxPQUFYLENBQW1CQSxPQUhyQjtBQUlFLFdBQUU7QUFDRkgsc0JBQVUsR0FBR0EsVUFBVSxDQUFDRyxPQUFYLENBQW1CQSxPQUFoQztBQUNEO0FBQ0QsY0FBSTNNLFVBQVUsS0FBSyxPQUFuQixFQUE0QjtBQUMxQndNLHNCQUFVLENBQUNySSxLQUFYLENBQWlCdkIsS0FBakIsQ0FBdUI0SixVQUF2QjtBQUNFckIsNEJBQWdCO0FBQ2QsaUJBQUksQ0FBQ3pFLEdBRFM7QUFFZHBCLGlCQUZjO0FBR2RpSCxzQkFBVSxDQUFDLENBQUQsQ0FISTtBQUlkQSxzQkFBVSxDQUFDLENBQUQsQ0FKSTtBQUtkbkIsb0JBTGM7QUFNZHBMLHNCQU5jLENBRGxCOztBQVNBO0FBQ0Q7QUFDRCxjQUFNNE0sT0FBTyxHQUFHSixVQUFVLENBQUN4TSxVQUFELENBQTFCO0FBQ0EsY0FBSSxDQUFDdkksSUFBSSxDQUFDbVYsT0FBRCxDQUFULEVBQW9CO0FBQ2xCLGtCQUFNLElBQUlDLEtBQUosZ0JBQWtCN00sVUFBbEIsd0JBQU47QUFDRDtBQUNELGNBQUlzTSxNQUFKLEVBQVk7QUFDVixnQkFBSU0sT0FBTyxDQUFDRSxJQUFaLEVBQWtCO0FBQ2hCO0FBQ0Q7QUFDREYsbUJBQU8sQ0FBQ0UsSUFBUixHQUFlLElBQWY7QUFDRDtBQUNEcEIsYUFBRyxDQUFDN1IsSUFBSixDQUFTK1MsT0FBTyxDQUFDaEssS0FBUixDQUFjNEosVUFBZCxFQUEwQnJCLGdCQUFnQjtBQUNqRCxlQUFJLENBQUN6RSxHQUQ0QztBQUVqRHBCLGVBRmlEO0FBR2pEaUgsb0JBQVUsQ0FBQyxDQUFELENBSHVDO0FBSWpEQSxvQkFBVSxDQUFDLENBQUQsQ0FKdUM7QUFLakRuQixrQkFMaUQ7QUFNakRwTCxvQkFOaUQsQ0FBMUMsQ0FBVDs7QUFRRDtBQUNGLE9BMUNEO0FBMkNEO0FBQ0YsR0F0REQ7O0FBd0RBO0FBQ0UrTCxXQUFTLEtBQUssT0FBZDtBQUNBTCxLQUFHLENBQUMvUixNQUFKLEtBQWUsQ0FEZjtBQUVBLFNBQU8rUixHQUFHLENBQUMsQ0FBRCxDQUFWLEtBQWtCLFdBSHBCO0FBSUU7QUFDQSxXQUFPQSxHQUFHLENBQUMsQ0FBRCxDQUFWO0FBQ0Q7QUFDRjs7QUFFRCxJQUFNalMsS0FBSyxHQUFHO0FBQ1osUUFEWTtBQUVaLFFBRlk7QUFHWixTQUhZO0FBSVosZ0JBSlksQ0FBZDs7O0FBT0EsU0FBU3NULFlBQVQsQ0FBdUJwSCxFQUF2Qjs7O0FBR0csS0FGREMsS0FFQyxTQUZEQSxLQUVDLENBRERvSCxRQUNDLFNBRERBLFFBQ0M7QUFDRCxNQUFJckgsRUFBRSxDQUFDOEcsUUFBSCxDQUFZUSxLQUFoQixFQUF1QjtBQUNyQnBKLGlCQUFJdk0sU0FBSixDQUFjNFYsTUFBZCxHQUF1QnZILEVBQUUsQ0FBQzhHLFFBQUgsQ0FBWVEsS0FBbkM7QUFDRDs7QUFFRHBKLGVBQUl2TSxTQUFKLENBQWM2VixNQUFkLEdBQXVCLFVBQXZCOztBQUVBdEosZUFBSTBDLEtBQUosQ0FBVTtBQUNSNkcsZ0JBRFEsMEJBQ1E7QUFDZCxVQUFJLENBQUMsS0FBS1gsUUFBTCxDQUFjM0csTUFBbkIsRUFBMkI7QUFDekI7QUFDRDs7QUFFRCxXQUFLQSxNQUFMLEdBQWMsS0FBSzJHLFFBQUwsQ0FBYzNHLE1BQTVCOztBQUVBLFdBQUtELEdBQUw7QUFDRWpMLFlBQUksRUFBRSxFQURSO0FBRUcsV0FBS2tMLE1BRlIsRUFFaUIsS0FBSzJHLFFBQUwsQ0FBY3RILFVBRi9COzs7QUFLQSxXQUFLa0ksTUFBTCxHQUFjLEtBQUtaLFFBQUwsQ0FBY3RILFVBQTVCOztBQUVBLGFBQU8sS0FBS3NILFFBQUwsQ0FBYzNHLE1BQXJCO0FBQ0EsYUFBTyxLQUFLMkcsUUFBTCxDQUFjdEgsVUFBckI7O0FBRUEsVUFBSSxLQUFLVyxNQUFMLEtBQWdCLEtBQXBCLEVBQTJCO0FBQ3pCa0gsZ0JBQVEsQ0FBQyxJQUFELENBQVI7QUFDQXRILGlCQUFTLENBQUMsSUFBRCxFQUFPRSxLQUFQLENBQVQ7QUFDRDtBQUNGLEtBdEJPLEVBQVY7OztBQXlCQSxNQUFNMEgsVUFBVSxHQUFHO0FBQ2pCQyxZQURpQixvQkFDUHZPLElBRE8sRUFDRDtBQUNkLFVBQUksS0FBSzBILEdBQVQsRUFBYyxDQUFFO0FBQ2Q7QUFDRDs7QUFFRCxXQUFLQSxHQUFMLEdBQVdmLEVBQVg7O0FBRUEsV0FBS2UsR0FBTCxDQUFTYixHQUFULEdBQWU7QUFDYjJILFdBQUcsRUFBRSxJQURRLEVBQWY7OztBQUlBLFdBQUs5RyxHQUFMLENBQVMyRyxNQUFULEdBQWtCLElBQWxCO0FBQ0E7QUFDQSxXQUFLM0csR0FBTCxDQUFTK0csVUFBVCxHQUFzQixLQUFLQSxVQUEzQjs7QUFFQSxXQUFLL0csR0FBTCxDQUFTZ0gsVUFBVCxHQUFzQixJQUF0QjtBQUNBLFdBQUtoSCxHQUFMLENBQVNDLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0MzSCxJQUFoQzs7QUFFQSxXQUFLMEgsR0FBTCxDQUFTQyxXQUFULENBQXFCLFVBQXJCLEVBQWlDM0gsSUFBakM7QUFDRCxLQXBCZ0IsRUFBbkI7OztBQXVCQTtBQUNBc08sWUFBVSxDQUFDRyxVQUFYLEdBQXdCOUgsRUFBRSxDQUFDOEcsUUFBSCxDQUFZZ0IsVUFBWixJQUEwQixFQUFsRDtBQUNBO0FBQ0EsTUFBTTlGLE9BQU8sR0FBR2hDLEVBQUUsQ0FBQzhHLFFBQUgsQ0FBWTlFLE9BQTVCO0FBQ0EsTUFBSUEsT0FBSixFQUFhO0FBQ1h0USxVQUFNLENBQUNnRCxJQUFQLENBQVlzTixPQUFaLEVBQXFCck4sT0FBckIsQ0FBNkIsVUFBQWdCLElBQUksRUFBSTtBQUNuQ2dTLGdCQUFVLENBQUNoUyxJQUFELENBQVYsR0FBbUJxTSxPQUFPLENBQUNyTSxJQUFELENBQTFCO0FBQ0QsS0FGRDtBQUdEOztBQUVEa0wsV0FBUyxDQUFDOEcsVUFBRCxFQUFhN1QsS0FBYixDQUFUOztBQUVBLFNBQU82VCxVQUFQO0FBQ0Q7O0FBRUQsU0FBU0ssYUFBVCxDQUF3QmhJLEVBQXhCLEVBQTRCaUksTUFBNUIsRUFBb0M7QUFDbEMsTUFBTUMsU0FBUyxHQUFHbEksRUFBRSxDQUFDa0ksU0FBckI7QUFDQTtBQUNBLE1BQUlDLFFBQVEsR0FBR0QsU0FBUyxDQUFDdkgsSUFBVixDQUFlLFVBQUF5SCxPQUFPLFVBQUlBLE9BQU8sQ0FBQ1YsTUFBUixDQUFlOUYsT0FBZixLQUEyQnFHLE1BQS9CLEVBQXRCLENBQWY7QUFDQSxNQUFJRSxRQUFKLEVBQWM7QUFDWixXQUFPQSxRQUFQO0FBQ0Q7QUFDRDtBQUNBLE9BQUssSUFBSXBVLENBQUMsR0FBR21VLFNBQVMsQ0FBQ2xVLE1BQVYsR0FBbUIsQ0FBaEMsRUFBbUNELENBQUMsSUFBSSxDQUF4QyxFQUEyQ0EsQ0FBQyxFQUE1QyxFQUFnRDtBQUM5Q29VLFlBQVEsR0FBR0gsYUFBYSxDQUFDRSxTQUFTLENBQUNuVSxDQUFELENBQVYsRUFBZWtVLE1BQWYsQ0FBeEI7QUFDQSxRQUFJRSxRQUFKLEVBQWM7QUFDWixhQUFPQSxRQUFQO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFNBQVN0RixZQUFULENBQXVCbk4sT0FBdkIsRUFBZ0M7QUFDOUIsU0FBTzJTLFFBQVEsQ0FBQzNTLE9BQUQsQ0FBZjtBQUNEOztBQUVELFNBQVMyUixRQUFULENBQW1CckgsRUFBbkIsRUFBdUI7QUFDckIsTUFBTVIsVUFBVSxHQUFHUSxFQUFFLENBQUMwSCxNQUF0QjtBQUNBaFcsUUFBTSxDQUFDNFcsY0FBUCxDQUFzQnRJLEVBQXRCLEVBQTBCLE9BQTFCLEVBQW1DO0FBQ2pDdUksT0FEaUMsaUJBQzFCO0FBQ0wsVUFBTUMsS0FBSyxHQUFHLEVBQWQ7QUFDQSxVQUFNQyxVQUFVLEdBQUdqSixVQUFVLENBQUNrSixtQkFBWCxDQUErQixVQUEvQixDQUFuQjtBQUNBRCxnQkFBVSxDQUFDOVQsT0FBWCxDQUFtQixVQUFBZ1UsU0FBUyxFQUFJO0FBQzlCLFlBQU1DLEdBQUcsR0FBR0QsU0FBUyxDQUFDL0MsT0FBVixDQUFrQmdELEdBQTlCO0FBQ0FKLGFBQUssQ0FBQ0ksR0FBRCxDQUFMLEdBQWFELFNBQVMsQ0FBQzVILEdBQVYsSUFBaUI0SCxTQUE5QjtBQUNELE9BSEQ7QUFJQSxVQUFNRSxhQUFhLEdBQUdySixVQUFVLENBQUNrSixtQkFBWCxDQUErQixpQkFBL0IsQ0FBdEI7QUFDQUcsbUJBQWEsQ0FBQ2xVLE9BQWQsQ0FBc0IsVUFBQWdVLFNBQVMsRUFBSTtBQUNqQyxZQUFNQyxHQUFHLEdBQUdELFNBQVMsQ0FBQy9DLE9BQVYsQ0FBa0JnRCxHQUE5QjtBQUNBLFlBQUksQ0FBQ0osS0FBSyxDQUFDSSxHQUFELENBQVYsRUFBaUI7QUFDZkosZUFBSyxDQUFDSSxHQUFELENBQUwsR0FBYSxFQUFiO0FBQ0Q7QUFDREosYUFBSyxDQUFDSSxHQUFELENBQUwsQ0FBVzFVLElBQVgsQ0FBZ0J5VSxTQUFTLENBQUM1SCxHQUFWLElBQWlCNEgsU0FBakM7QUFDRCxPQU5EO0FBT0EsYUFBT0gsS0FBUDtBQUNELEtBakJnQyxFQUFuQzs7QUFtQkQ7O0FBRUQsU0FBU00sVUFBVCxDQUFxQm5KLEtBQXJCLEVBQTRCOzs7O0FBSXRCQSxPQUFLLENBQUMwRSxNQUFOLElBQWdCMUUsS0FBSyxDQUFDOUgsS0FKQSxDQUV4Qm9RLE1BRndCLFNBRXhCQSxNQUZ3QixDQUd4QjNILFVBSHdCLFNBR3hCQSxVQUh3QixFQUlPOztBQUVqQyxNQUFJNkgsUUFBSjs7QUFFQSxNQUFJRixNQUFKLEVBQVk7QUFDVkUsWUFBUSxHQUFHSCxhQUFhLENBQUMsS0FBS2pILEdBQU4sRUFBV2tILE1BQVgsQ0FBeEI7QUFDRDs7QUFFRCxNQUFJLENBQUNFLFFBQUwsRUFBZTtBQUNiQSxZQUFRLEdBQUcsS0FBS3BILEdBQWhCO0FBQ0Q7O0FBRURULFlBQVUsQ0FBQ3lJLE1BQVgsR0FBb0JaLFFBQXBCO0FBQ0Q7O0FBRUQsSUFBTWxJLEtBQUssR0FBRyxDQUFDLFFBQUQsRUFBVyxlQUFYLENBQWQ7O0FBRUEsU0FBUytJLE1BQVQsR0FBbUI7QUFDakIsU0FBTyxDQUFDLEtBQUtDLE9BQWI7QUFDRDs7QUFFRCxTQUFTQyxZQUFULENBQXVCN0UsTUFBdkIsRUFBK0I7QUFDN0IsT0FBSzhFLFFBQUwsQ0FBYyxLQUFkLEVBQXFCOUUsTUFBckI7QUFDRDs7QUFFRCxTQUFTK0UsUUFBVCxDQUFtQnBKLEVBQW5CLEVBQXVCO0FBQ3JCO0FBQ0EsTUFBTTJILFVBQVUsR0FBR1AsWUFBWSxDQUFDcEgsRUFBRCxFQUFLO0FBQ2xDQyxTQUFLLEVBQUxBLEtBRGtDO0FBRWxDb0gsWUFBUSxFQUFSQSxRQUZrQyxFQUFMLENBQS9COztBQUlBTSxZQUFVLENBQUMwQixNQUFYLEdBQW9CLFNBQVNBLE1BQVQsQ0FBaUJoUSxJQUFqQixFQUF1QjtBQUN6QyxRQUFJLENBQUMsS0FBSzBILEdBQVYsRUFBZTtBQUNiLFdBQUs2RyxRQUFMLENBQWN2TyxJQUFkO0FBQ0Q7QUFDRCxTQUFLMEgsR0FBTCxDQUFTQyxXQUFULENBQXFCLFFBQXJCLEVBQStCM0gsSUFBL0I7QUFDRCxHQUxEO0FBTUEsU0FBT3NPLFVBQVA7QUFDRDs7QUFFRCxTQUFTMkIsU0FBVCxDQUFvQnRKLEVBQXBCLEVBQXdCO0FBQ3RCdUosS0FBRyxDQUFDSCxRQUFRLENBQUNwSixFQUFELENBQVQsQ0FBSDtBQUNBLFNBQU9BLEVBQVA7QUFDRDs7QUFFRCxTQUFTd0osa0JBQVQsQ0FBNkJDLG1CQUE3Qjs7O0FBR1EsaUZBQUosRUFBSSxDQUZOVCxNQUVNLFNBRk5BLE1BRU0sQ0FETkUsWUFDTSxTQUROQSxZQUNNO0FBQzJCakksa0JBQWdCLENBQUMvQyxZQUFELEVBQU11TCxtQkFBTixDQUQzQywyREFDRHZJLFlBREMseUJBQ2FaLFVBRGI7O0FBR04sTUFBTTVLLE9BQU8sR0FBRztBQUNkZ1UsaUJBQWEsRUFBRSxJQUREO0FBRWRDLGtCQUFjLEVBQUUsSUFGRixFQUFoQjs7O0FBS0EsTUFBTUMsZ0JBQWdCLEdBQUc7QUFDdkJsVSxXQUFPLEVBQVBBLE9BRHVCO0FBRXZCVCxRQUFJLEVBQUU2TSxRQUFRLENBQUN4QixVQUFELEVBQWFwQyxhQUFJdk0sU0FBakIsQ0FGUztBQUd2QnVSLGFBQVMsRUFBRU4sYUFBYSxDQUFDdEMsVUFBRCxFQUFhdUMsWUFBYixDQUhEO0FBSXZCUyxjQUFVLEVBQUVDLGNBQWMsQ0FBQ2pELFVBQVUsQ0FBQytDLEtBQVosRUFBbUIsS0FBbkIsRUFBMEIvQyxVQUFVLENBQUN1SixNQUFyQyxDQUpIO0FBS3ZCQyxhQUFTLEVBQUU7QUFDVEMsY0FEUyxzQkFDRztBQUNWLFlBQU16RyxVQUFVLEdBQUcsS0FBS0EsVUFBeEI7O0FBRUEsWUFBTTVOLE9BQU8sR0FBRztBQUNkeUssZ0JBQU0sRUFBRTZJLE1BQU0sQ0FBQzVXLElBQVAsQ0FBWSxJQUFaLElBQW9CLE1BQXBCLEdBQTZCLFdBRHZCO0FBRWRvTixvQkFBVSxFQUFFLElBRkU7QUFHZHdLLG1CQUFTLEVBQUUxRyxVQUhHLEVBQWhCOzs7QUFNQTdCLGtCQUFVLENBQUM2QixVQUFVLENBQUNPLEtBQVosRUFBbUIsSUFBbkIsQ0FBVjs7QUFFQTtBQUNBcUYsb0JBQVksQ0FBQzlXLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0I7QUFDdEI2VixnQkFBTSxFQUFFLEtBQUtwRyxRQURTO0FBRXRCdkIsb0JBQVUsRUFBRTVLLE9BRlUsRUFBeEI7OztBQUtBO0FBQ0EsYUFBS3FMLEdBQUwsR0FBVyxJQUFJRyxZQUFKLENBQWlCeEwsT0FBakIsQ0FBWDs7QUFFQTtBQUNBMEwsaUJBQVMsQ0FBQyxLQUFLTCxHQUFOLEVBQVd1QyxVQUFVLENBQUNqQyxRQUF0QixDQUFUOztBQUVBO0FBQ0EsYUFBS04sR0FBTCxDQUFTa0osTUFBVDtBQUNELE9BMUJRO0FBMkJUQyxXQTNCUyxtQkEyQkE7QUFDUDtBQUNBO0FBQ0EsWUFBSSxLQUFLbkosR0FBVCxFQUFjO0FBQ1osZUFBS0EsR0FBTCxDQUFTZ0gsVUFBVCxHQUFzQixJQUF0QjtBQUNBLGVBQUtoSCxHQUFMLENBQVNDLFdBQVQsQ0FBcUIsU0FBckI7QUFDQSxlQUFLRCxHQUFMLENBQVNDLFdBQVQsQ0FBcUIsU0FBckI7QUFDRDtBQUNGLE9BbkNRO0FBb0NUbUosY0FwQ1Msc0JBb0NHO0FBQ1YsYUFBS3BKLEdBQUwsQ0FBU3FKLFFBQVQ7QUFDRCxPQXRDUSxFQUxZOztBQTZDdkJDLGlCQUFhLEVBQUU7QUFDYkMsVUFEYSxnQkFDUGpSLElBRE8sRUFDRDtBQUNWLGFBQUswSCxHQUFMLElBQVksS0FBS0EsR0FBTCxDQUFTQyxXQUFULENBQXFCLFlBQXJCLEVBQW1DM0gsSUFBbkMsQ0FBWjtBQUNELE9BSFk7QUFJYmtSLFVBSmEsa0JBSUw7QUFDTixhQUFLeEosR0FBTCxJQUFZLEtBQUtBLEdBQUwsQ0FBU0MsV0FBVCxDQUFxQixZQUFyQixDQUFaO0FBQ0QsT0FOWTtBQU9id0osWUFQYSxrQkFPTEMsSUFQSyxFQU9DO0FBQ1osYUFBSzFKLEdBQUwsSUFBWSxLQUFLQSxHQUFMLENBQVNDLFdBQVQsQ0FBcUIsY0FBckIsRUFBcUN5SixJQUFyQyxDQUFaO0FBQ0QsT0FUWSxFQTdDUTs7QUF3RHZCekksV0FBTyxFQUFFO0FBQ1AwSSxTQUFHLEVBQUU1QixVQURFO0FBRVA2QixTQUFHLEVBQUVyRSxXQUZFLEVBeERjLEVBQXpCOzs7O0FBOERBLE1BQUkzUyxLQUFLLENBQUNDLE9BQU4sQ0FBYzBNLFVBQVUsQ0FBQ3NLLGNBQXpCLENBQUosRUFBOEM7QUFDNUN0SyxjQUFVLENBQUNzSyxjQUFYLENBQTBCalcsT0FBMUIsQ0FBa0MsVUFBQWtXLFVBQVUsRUFBSTtBQUM5Q2pCLHNCQUFnQixDQUFDNUgsT0FBakIsQ0FBeUI2SSxVQUF6QixJQUF1QyxVQUFVeFIsSUFBVixFQUFnQjtBQUNyRCxlQUFPLEtBQUswSCxHQUFMLENBQVM4SixVQUFULEVBQXFCeFIsSUFBckIsQ0FBUDtBQUNELE9BRkQ7QUFHRCxLQUpEO0FBS0Q7O0FBRUQsTUFBSTJQLE1BQUosRUFBWTtBQUNWLFdBQU9ZLGdCQUFQO0FBQ0Q7QUFDRCxTQUFPLENBQUNBLGdCQUFELEVBQW1CMUksWUFBbkIsQ0FBUDtBQUNEOztBQUVELElBQU00SixZQUFZLEdBQUd6UyxJQUFJLENBQUMwUyxPQUFMLENBQWEsZUFBYixDQUFyQjs7QUFFQSxTQUFTQyxjQUFULENBQXlCMUssVUFBekIsRUFBcUM7QUFDbkMsTUFBTXNKLGdCQUFnQixHQUFHSixrQkFBa0IsQ0FBQ2xKLFVBQUQsRUFBYTtBQUN0RDBJLFVBQU0sRUFBTkEsTUFEc0Q7QUFFdERFLGdCQUFZLEVBQVpBLFlBRnNELEVBQWIsQ0FBM0M7OztBQUtBO0FBQ0E7QUFDQTtBQUNBLE1BQU0rQixXQUFXLEdBQUdyQixnQkFBZ0IsQ0FBQ0UsU0FBakIsQ0FBMkJDLFFBQS9DO0FBQ0FILGtCQUFnQixDQUFDRSxTQUFqQixDQUEyQkMsUUFBM0IsR0FBc0MsU0FBU0EsUUFBVCxHQUFxQjtBQUN6RGtCLGVBQVcsQ0FBQzdZLElBQVosQ0FBaUIsSUFBakI7QUFDQSxRQUFJNFcsTUFBTSxDQUFDNVcsSUFBUCxDQUFZLElBQVosQ0FBSixFQUF1QixDQUFFO0FBQ3ZCO0FBQ0EsV0FBSzhZLFlBQUwsQ0FBa0JuSyxHQUFsQixHQUF3QixLQUFLQSxHQUE3QjtBQUNBLFVBQUkxTyxNQUFNLENBQUMsS0FBSzZZLFlBQU4sRUFBb0IsUUFBcEIsQ0FBVixFQUF5QztBQUN2QyxhQUFLbkssR0FBTCxDQUFTYixHQUFULENBQWFpTCxLQUFiLEdBQXFCLEtBQUtELFlBQUwsQ0FBa0JFLE1BQXZDO0FBQ0EsYUFBS3JLLEdBQUwsQ0FBU0MsV0FBVCxDQUFxQixRQUFyQixFQUErQixLQUFLa0ssWUFBTCxDQUFrQkUsTUFBakQ7QUFDQSxhQUFLckssR0FBTCxDQUFTQyxXQUFULENBQXFCLFFBQXJCO0FBQ0EsZUFBTyxLQUFLa0ssWUFBTCxDQUFrQkUsTUFBekI7QUFDRDtBQUNGLEtBVEQsTUFTTztBQUNMO0FBQ0EsVUFBSSxLQUFLckssR0FBVCxFQUFjO0FBQ1osYUFBS0EsR0FBTCxDQUFTZ0gsVUFBVCxHQUFzQixJQUF0QjtBQUNBLGFBQUtoSCxHQUFMLENBQVNDLFdBQVQsQ0FBcUIsU0FBckI7QUFDRDtBQUNGO0FBQ0YsR0FsQkQ7O0FBb0JBLE1BQUk4SixZQUFKLEVBQWtCO0FBQ2hCLFdBQU9sQixnQkFBZ0IsQ0FBQ0UsU0FBakIsQ0FBMkJJLEtBQWxDO0FBQ0FOLG9CQUFnQixDQUFDNUgsT0FBakIsQ0FBeUJxSixPQUF6QixHQUFtQyxZQUFZO0FBQzdDLFVBQUksS0FBS3RLLEdBQVQsRUFBYztBQUNaLGFBQUtBLEdBQUwsQ0FBU2dILFVBQVQsR0FBc0IsSUFBdEI7QUFDQSxhQUFLaEgsR0FBTCxDQUFTQyxXQUFULENBQXFCLFNBQXJCO0FBQ0EsYUFBS0QsR0FBTCxDQUFTQyxXQUFULENBQXFCLFNBQXJCO0FBQ0Q7QUFDRixLQU5EO0FBT0Q7O0FBRUQ0SSxrQkFBZ0IsQ0FBQzBCLFFBQWpCLEdBQTRCO0FBQzFCLFdBQU8xQixnQkFBZ0IsQ0FBQzVILE9BQWpCLENBQXlCLEtBQXpCLENBRG1CLEVBQTVCOztBQUdBLFNBQU80SCxnQkFBZ0IsQ0FBQzVILE9BQWpCLENBQXlCLEtBQXpCLENBQVA7O0FBRUEsU0FBTzRILGdCQUFQO0FBQ0Q7O0FBRUQsSUFBTTJCLE9BQU8sR0FBRztBQUNkLFFBRGM7QUFFZCxRQUZjO0FBR2QsVUFIYyxDQUFoQjs7O0FBTUFBLE9BQU8sQ0FBQ3JYLElBQVIsT0FBQXFYLE9BQU8sRUFBU3pMLGdCQUFULENBQVA7O0FBRUEsU0FBUzBMLGFBQVQsQ0FBd0JDLGNBQXhCOzs7QUFHRyxLQUZEekMsTUFFQyxTQUZEQSxNQUVDLENBRERFLFlBQ0MsU0FEREEsWUFDQztBQUNELE1BQU13QyxXQUFXLEdBQUdWLGNBQWMsQ0FBQ1MsY0FBRCxDQUFsQzs7QUFFQTVLLFdBQVMsQ0FBQzZLLFdBQVcsQ0FBQzFKLE9BQWIsRUFBc0J1SixPQUF0QixFQUErQkUsY0FBL0IsQ0FBVDs7QUFFQUMsYUFBVyxDQUFDMUosT0FBWixDQUFvQjJKLE1BQXBCLEdBQTZCLFVBQVV0UyxJQUFWLEVBQWdCO0FBQzNDLFNBQUswSCxHQUFMLENBQVNiLEdBQVQsQ0FBYWlMLEtBQWIsR0FBcUI5UixJQUFyQixDQUQyQyxDQUNoQjtBQUMzQixTQUFLMEgsR0FBTCxDQUFTQyxXQUFULENBQXFCLFFBQXJCLEVBQStCM0gsSUFBL0I7QUFDRCxHQUhEOztBQUtBLFNBQU9xUyxXQUFQO0FBQ0Q7O0FBRUQsU0FBU3ZCLFFBQVQsQ0FBbUJwSixHQUFuQixFQUF3QjtBQUN0QkEsS0FBRyxDQUFDbUgsU0FBSixDQUFjdlQsT0FBZCxDQUFzQixVQUFBeVQsT0FBTyxFQUFJO0FBQy9CQSxXQUFPLENBQUNWLE1BQVIsQ0FBZXlDLFFBQWY7QUFDRCxHQUZEO0FBR0FwSixLQUFHLENBQUMyRyxNQUFKLENBQVd5QyxRQUFYO0FBQ0Q7O0FBRUQsU0FBU3lCLFlBQVQsQ0FBdUI3SyxHQUF2QixFQUE0QjtBQUMxQkEsS0FBRyxDQUFDcUosUUFBSjtBQUNBckosS0FBRyxDQUFDbUgsU0FBSixDQUFjdlQsT0FBZCxDQUFzQixVQUFBeVQsT0FBTyxFQUFJO0FBQy9CK0IsWUFBUSxDQUFDL0IsT0FBRCxDQUFSO0FBQ0QsR0FGRDtBQUdEOztBQUVELFNBQVN5RCxTQUFULENBQW9CSixjQUFwQixFQUFvQztBQUNsQyxNQUFNQyxXQUFXLEdBQUdGLGFBQWEsQ0FBQ0MsY0FBRCxFQUFpQjtBQUNoRHpDLFVBQU0sRUFBTkEsTUFEZ0Q7QUFFaERFLGdCQUFZLEVBQVpBLFlBRmdELEVBQWpCLENBQWpDOzs7QUFLQTtBQUNBd0MsYUFBVyxDQUFDMUosT0FBWixDQUFvQnFILE1BQXBCLEdBQTZCLFNBQVNBLE1BQVQsR0FBbUI7QUFDOUMsUUFBSSxLQUFLdEksR0FBTCxJQUFZLEtBQUtBLEdBQUwsQ0FBU2IsR0FBVCxDQUFhaUwsS0FBN0IsRUFBb0M7QUFDbEMsV0FBS3BLLEdBQUwsQ0FBU0MsV0FBVCxDQUFxQixRQUFyQjtBQUNEO0FBQ0YsR0FKRDs7QUFNQTBLLGFBQVcsQ0FBQzFKLE9BQVosQ0FBb0IySixNQUFwQixHQUE2QixTQUFTQSxNQUFULENBQWlCdFMsSUFBakIsRUFBdUI7QUFDbEQ7QUFDQSxRQUFJLEtBQUswSCxHQUFULEVBQWM7QUFDWixXQUFLQSxHQUFMLENBQVNiLEdBQVQsQ0FBYWlMLEtBQWIsR0FBcUI5UixJQUFyQjtBQUNBLFdBQUswSCxHQUFMLENBQVNDLFdBQVQsQ0FBcUIsUUFBckIsRUFBK0IzSCxJQUEvQjtBQUNBLFdBQUswSCxHQUFMLENBQVNDLFdBQVQsQ0FBcUIsUUFBckI7QUFDRCxLQUpELE1BSU87QUFDTCxXQUFLa0ssWUFBTCxDQUFrQkUsTUFBbEIsR0FBMkIvUixJQUEzQjtBQUNEO0FBQ0YsR0FURDs7QUFXQXFTLGFBQVcsQ0FBQzFKLE9BQVosQ0FBb0I4SixRQUFwQixHQUErQixTQUFTQSxRQUFULEdBQXFCO0FBQ2xELFNBQUsvSyxHQUFMLENBQVNDLFdBQVQsQ0FBcUIsVUFBckI7QUFDQTRLLGdCQUFZLENBQUMsS0FBSzdLLEdBQU4sQ0FBWjtBQUNELEdBSEQ7O0FBS0EsU0FBTzJLLFdBQVA7QUFDRDs7QUFFRCxTQUFTSyxVQUFULENBQXFCTixjQUFyQixFQUFxQztBQUNuQztBQUNFLFdBQU9yTSxTQUFTLENBQUN5TSxTQUFTLENBQUNKLGNBQUQsQ0FBVixDQUFoQjtBQUNEO0FBQ0Y7O0FBRUQsU0FBU08sZUFBVCxDQUEwQjFMLFVBQTFCLEVBQXNDO0FBQ3BDO0FBQ0UsV0FBT2xCLFNBQVMsQ0FBQzRMLGNBQWMsQ0FBQzFLLFVBQUQsQ0FBZixDQUFoQjtBQUNEO0FBQ0Y7O0FBRURyRyxLQUFLLENBQUN0RixPQUFOLENBQWMsVUFBQTBJLE9BQU8sRUFBSTtBQUN2QnJDLFdBQVMsQ0FBQ3FDLE9BQUQsQ0FBVCxHQUFxQixLQUFyQjtBQUNELENBRkQ7O0FBSUFuRCxRQUFRLENBQUN2RixPQUFULENBQWlCLFVBQUFzWCxVQUFVLEVBQUk7QUFDN0IsTUFBTUMsT0FBTyxHQUFHbFIsU0FBUyxDQUFDaVIsVUFBRCxDQUFULElBQXlCalIsU0FBUyxDQUFDaVIsVUFBRCxDQUFULENBQXNCdFcsSUFBL0MsR0FBc0RxRixTQUFTLENBQUNpUixVQUFELENBQVQsQ0FBc0J0VyxJQUE1RTtBQUNac1csWUFESjtBQUVBLE1BQUksQ0FBQzVULElBQUksQ0FBQzBTLE9BQUwsQ0FBYW1CLE9BQWIsQ0FBTCxFQUE0QjtBQUMxQmxSLGFBQVMsQ0FBQ2lSLFVBQUQsQ0FBVCxHQUF3QixLQUF4QjtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxJQUFJRSxHQUFHLEdBQUcsRUFBVjs7QUFFQSxJQUFJLE9BQU9DLEtBQVAsS0FBaUIsV0FBakIsSUFBZ0MsZUFBZSxVQUFuRCxFQUErRDtBQUM3REQsS0FBRyxHQUFHLElBQUlDLEtBQUosQ0FBVSxFQUFWLEVBQWM7QUFDbEI3RCxPQURrQixlQUNibkUsTUFEYSxFQUNMek8sSUFESyxFQUNDO0FBQ2pCLFVBQUl5TyxNQUFNLENBQUN6TyxJQUFELENBQVYsRUFBa0I7QUFDaEIsZUFBT3lPLE1BQU0sQ0FBQ3pPLElBQUQsQ0FBYjtBQUNEO0FBQ0QsVUFBSXVELE9BQU8sQ0FBQ3ZELElBQUQsQ0FBWCxFQUFtQjtBQUNqQixlQUFPdUQsT0FBTyxDQUFDdkQsSUFBRCxDQUFkO0FBQ0Q7QUFDRCxVQUFJVSxHQUFHLENBQUNWLElBQUQsQ0FBUCxFQUFlO0FBQ2IsZUFBT3lCLFNBQVMsQ0FBQ3pCLElBQUQsRUFBT1UsR0FBRyxDQUFDVixJQUFELENBQVYsQ0FBaEI7QUFDRDtBQUNEO0FBQ0UsWUFBSW1JLFFBQVEsQ0FBQ25JLElBQUQsQ0FBWixFQUFvQjtBQUNsQixpQkFBT3lCLFNBQVMsQ0FBQ3pCLElBQUQsRUFBT21JLFFBQVEsQ0FBQ25JLElBQUQsQ0FBZixDQUFoQjtBQUNEO0FBQ0QsWUFBSXVILFFBQVEsQ0FBQ3ZILElBQUQsQ0FBWixFQUFvQjtBQUNsQixpQkFBT3lCLFNBQVMsQ0FBQ3pCLElBQUQsRUFBT3VILFFBQVEsQ0FBQ3ZILElBQUQsQ0FBZixDQUFoQjtBQUNEO0FBQ0Y7QUFDRCxVQUFJOEksUUFBUSxDQUFDOUksSUFBRCxDQUFaLEVBQW9CO0FBQ2xCLGVBQU84SSxRQUFRLENBQUM5SSxJQUFELENBQWY7QUFDRDtBQUNELFVBQUksQ0FBQ3RELE1BQU0sQ0FBQ2dHLElBQUQsRUFBTzFDLElBQVAsQ0FBUCxJQUF1QixDQUFDdEQsTUFBTSxDQUFDMkksU0FBRCxFQUFZckYsSUFBWixDQUFsQyxFQUFxRDtBQUNuRDtBQUNEO0FBQ0QsYUFBT3lCLFNBQVMsQ0FBQ3pCLElBQUQsRUFBT2tILE9BQU8sQ0FBQ2xILElBQUQsRUFBTzBDLElBQUksQ0FBQzFDLElBQUQsQ0FBWCxDQUFkLENBQWhCO0FBQ0QsS0ExQmlCO0FBMkJsQjBXLE9BM0JrQixlQTJCYmpJLE1BM0JhLEVBMkJMek8sSUEzQkssRUEyQkNrQyxLQTNCRCxFQTJCUTtBQUN4QnVNLFlBQU0sQ0FBQ3pPLElBQUQsQ0FBTixHQUFla0MsS0FBZjtBQUNBLGFBQU8sSUFBUDtBQUNELEtBOUJpQixFQUFkLENBQU47O0FBZ0NELENBakNELE1BaUNPO0FBQ0xuRyxRQUFNLENBQUNnRCxJQUFQLENBQVl3RSxPQUFaLEVBQXFCdkUsT0FBckIsQ0FBNkIsVUFBQWdCLElBQUksRUFBSTtBQUNuQ3dXLE9BQUcsQ0FBQ3hXLElBQUQsQ0FBSCxHQUFZdUQsT0FBTyxDQUFDdkQsSUFBRCxDQUFuQjtBQUNELEdBRkQ7O0FBSUE7QUFDRWpFLFVBQU0sQ0FBQ2dELElBQVAsQ0FBWXdJLFFBQVosRUFBc0J2SSxPQUF0QixDQUE4QixVQUFBZ0IsSUFBSSxFQUFJO0FBQ3BDd1csU0FBRyxDQUFDeFcsSUFBRCxDQUFILEdBQVl5QixTQUFTLENBQUN6QixJQUFELEVBQU91SCxRQUFRLENBQUN2SCxJQUFELENBQWYsQ0FBckI7QUFDRCxLQUZEO0FBR0FqRSxVQUFNLENBQUNnRCxJQUFQLENBQVlvSixRQUFaLEVBQXNCbkosT0FBdEIsQ0FBOEIsVUFBQWdCLElBQUksRUFBSTtBQUNwQ3dXLFNBQUcsQ0FBQ3hXLElBQUQsQ0FBSCxHQUFZeUIsU0FBUyxDQUFDekIsSUFBRCxFQUFPdUgsUUFBUSxDQUFDdkgsSUFBRCxDQUFmLENBQXJCO0FBQ0QsS0FGRDtBQUdEOztBQUVEakUsUUFBTSxDQUFDZ0QsSUFBUCxDQUFZK0osUUFBWixFQUFzQjlKLE9BQXRCLENBQThCLFVBQUFnQixJQUFJLEVBQUk7QUFDcEN3VyxPQUFHLENBQUN4VyxJQUFELENBQUgsR0FBWThJLFFBQVEsQ0FBQzlJLElBQUQsQ0FBcEI7QUFDRCxHQUZEOztBQUlBakUsUUFBTSxDQUFDZ0QsSUFBUCxDQUFZMkIsR0FBWixFQUFpQjFCLE9BQWpCLENBQXlCLFVBQUFnQixJQUFJLEVBQUk7QUFDL0J3VyxPQUFHLENBQUN4VyxJQUFELENBQUgsR0FBWXlCLFNBQVMsQ0FBQ3pCLElBQUQsRUFBT1UsR0FBRyxDQUFDVixJQUFELENBQVYsQ0FBckI7QUFDRCxHQUZEOztBQUlBakUsUUFBTSxDQUFDZ0QsSUFBUCxDQUFZMkQsSUFBWixFQUFrQjFELE9BQWxCLENBQTBCLFVBQUFnQixJQUFJLEVBQUk7QUFDaEMsUUFBSXRELE1BQU0sQ0FBQ2dHLElBQUQsRUFBTzFDLElBQVAsQ0FBTixJQUFzQnRELE1BQU0sQ0FBQzJJLFNBQUQsRUFBWXJGLElBQVosQ0FBaEMsRUFBbUQ7QUFDakR3VyxTQUFHLENBQUN4VyxJQUFELENBQUgsR0FBWXlCLFNBQVMsQ0FBQ3pCLElBQUQsRUFBT2tILE9BQU8sQ0FBQ2xILElBQUQsRUFBTzBDLElBQUksQ0FBQzFDLElBQUQsQ0FBWCxDQUFkLENBQXJCO0FBQ0Q7QUFDRixHQUpEO0FBS0Q7O0FBRUQwQyxJQUFJLENBQUNpUixTQUFMLEdBQWlCQSxTQUFqQjtBQUNBalIsSUFBSSxDQUFDMFQsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQTFULElBQUksQ0FBQzJULGVBQUwsR0FBdUJBLGVBQXZCOztBQUVBLElBQUlNLEtBQUssR0FBR0gsR0FBWixDOztBQUVlRyxLOzs7Ozs7Ozs7OztBQ3pzRGY7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0NBQWtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixpQkFBaUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLCtCQUErQjtBQUNyRCxzQkFBc0IsaUJBQWlCO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGlDQUFpQyxFQUFFO0FBQ3JGLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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QUFDQSwrQkFBK0Isb0JBQW9CLEVBQUU7QUFDckQ7QUFDQSxrQ0FBa0MsT0FBTztBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEIsU0FBUyxxQkFBcUI7O0FBRXhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMkJBQTJCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQSxNQUFNLEtBQXFDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFFUTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLEtBQXFDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMkJBQTJCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFNBQVM7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLHFDQUFxQyxFQUFFO0FBQ3BGOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBb0MseUNBQXlDLEVBQUU7QUFDL0U7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsa0JBQWtCO0FBQzNDO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHNEQUFzRCxFQUFFO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU0sSUFBcUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixrQkFBa0I7QUFDbEM7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLElBQUksSUFBcUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxpQ0FBaUM7QUFDbkUsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGlDQUFpQztBQUNuRSxjQUFjLDZCQUE2QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIseUJBQXlCO0FBQzFDLEdBQUc7QUFDSDtBQUNBO0FBQ0EsaUJBQWlCLCtCQUErQjtBQUNoRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsSUFBSSxJQUFxQztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsdUJBQXVCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixtQkFBbUI7QUFDeEM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxLQUFxQztBQUMzQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLElBQXFDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHFCQUFxQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEM7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxJQUFxQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPLE1BQU0sRUFFTjtBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsVUFBVSxJQUFxQztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsT0FBTztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0VBQWtFO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLG1CQUFtQjtBQUN6Qzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixPQUFPO0FBQ3RDO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxrQ0FBa0MsT0FBTztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLFVBQVUsS0FBcUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QyxlQUFlO0FBQzNELEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLEtBQXFDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLEtBQXFDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsS0FBSyxVQUFVLEtBQXFDO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gscUNBQXFDLGdFQUFnRTtBQUNyRztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsNEJBQTRCLCtCQUErQjtBQUMzRCw0QkFBNEIsK0JBQStCO0FBQzNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBcUM7QUFDM0Msa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQXFDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssdUZBQXVGO0FBQzVGO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMENBQTBDO0FBQzFDLGlCQUFpQix5QkFBeUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUcsK0JBQStCO0FBQ2xDLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEtBQXFDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBcUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxvQkFBb0Isb0JBQW9CO0FBQ3hDLHNCQUFzQiw0QkFBNEI7QUFDbEQ7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsT0FBTztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxtQkFBbUI7QUFDbkIseUJBQXlCO0FBQ3pCO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLDZDQUE2QztBQUM5RTtBQUNBO0FBQ0EsNkNBQTZDLDRDQUE0Qzs7QUFFekY7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTSxJQUFxQztBQUMzQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRyxNQUFNLEVBR047QUFDSDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsS0FBcUM7QUFDL0M7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxLQUFxQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUssMkNBQTJDLDhCQUE4QixFQUFFOztBQUVoRjtBQUNBLHdDQUF3QyxPQUFPO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsTUFBTSxLQUFxQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLEtBQXFDO0FBQ3JEO0FBQ0Esb0JBQW9CLFNBQUk7QUFDeEI7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLE9BQU87QUFDOUM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFNBQVM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVEsSUFBcUM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsT0FBTztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUFxQztBQUMzQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQjs7QUFFMUIsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTSxJQUFxQztBQUMzQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHlCQUF5QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQix5QkFBeUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsT0FBTztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBcUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiwwQkFBMEI7QUFDcEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLG9CQUFvQixFQUFFOztBQUVwRDtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxLQUFxQztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGtCQUFrQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVSxLQUFxQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQUlBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsS0FBcUM7QUFDekQ7QUFDQSxNQUFNLFNBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsTUFBTSxLQUFxQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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RDtBQUNBLGtEQUFrRDtBQUNsRCwwRDs7QUFFQTtBQUNBLFFBQVEsS0FBcUM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGVBQWU7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU0sS0FBcUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0VBQXNFO0FBQ3RFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEsS0FBcUM7QUFDN0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLFlBQVksS0FBcUM7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBLDBDQUEwQywyQkFBMkIsRUFBRTtBQUN2RSxLQUFLO0FBQ0w7QUFDQSwwQ0FBMEMsNEJBQTRCLEVBQUU7QUFDeEUsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsT0FBTztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxxREFBcUQsRUFBRSxTQUFTO0FBQ3RIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsT0FBTztBQUN4QztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGtDQUFrQyxPQUFPO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVlLGtFQUFHLEVB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LEVBQUMsU0FBUSxnQkFBVCxFOzs7Ozs7Ozs7Ozs7Ozs7O0FDQWY7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb21tb24vdmVuZG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnO1xuXG5jb25zdCBfdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuY29uc3QgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBpc0ZuIChmbikge1xuICByZXR1cm4gdHlwZW9mIGZuID09PSAnZnVuY3Rpb24nXG59XG5cbmZ1bmN0aW9uIGlzU3RyIChzdHIpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnXG59XG5cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QgKG9iaikge1xuICByZXR1cm4gX3RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbn1cblxuZnVuY3Rpb24gaGFzT3duIChvYmosIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSlcbn1cblxuZnVuY3Rpb24gbm9vcCAoKSB7fVxuXG4vKipcbiAqIENyZWF0ZSBhIGNhY2hlZCB2ZXJzaW9uIG9mIGEgcHVyZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY2FjaGVkIChmbikge1xuICBjb25zdCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHJldHVybiBmdW5jdGlvbiBjYWNoZWRGbiAoc3RyKSB7XG4gICAgY29uc3QgaGl0ID0gY2FjaGVbc3RyXTtcbiAgICByZXR1cm4gaGl0IHx8IChjYWNoZVtzdHJdID0gZm4oc3RyKSlcbiAgfVxufVxuXG4vKipcbiAqIENhbWVsaXplIGEgaHlwaGVuLWRlbGltaXRlZCBzdHJpbmcuXG4gKi9cbmNvbnN0IGNhbWVsaXplUkUgPSAvLShcXHcpL2c7XG5jb25zdCBjYW1lbGl6ZSA9IGNhY2hlZCgoc3RyKSA9PiB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjYW1lbGl6ZVJFLCAoXywgYykgPT4gYyA/IGMudG9VcHBlckNhc2UoKSA6ICcnKVxufSk7XG5cbmNvbnN0IEhPT0tTID0gW1xuICAnaW52b2tlJyxcbiAgJ3N1Y2Nlc3MnLFxuICAnZmFpbCcsXG4gICdjb21wbGV0ZScsXG4gICdyZXR1cm5WYWx1ZSdcbl07XG5cbmNvbnN0IGdsb2JhbEludGVyY2VwdG9ycyA9IHt9O1xuY29uc3Qgc2NvcGVkSW50ZXJjZXB0b3JzID0ge307XG5cbmZ1bmN0aW9uIG1lcmdlSG9vayAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICBjb25zdCByZXMgPSBjaGlsZFZhbFxuICAgID8gcGFyZW50VmFsXG4gICAgICA/IHBhcmVudFZhbC5jb25jYXQoY2hpbGRWYWwpXG4gICAgICA6IEFycmF5LmlzQXJyYXkoY2hpbGRWYWwpXG4gICAgICAgID8gY2hpbGRWYWwgOiBbY2hpbGRWYWxdXG4gICAgOiBwYXJlbnRWYWw7XG4gIHJldHVybiByZXNcbiAgICA/IGRlZHVwZUhvb2tzKHJlcylcbiAgICA6IHJlc1xufVxuXG5mdW5jdGlvbiBkZWR1cGVIb29rcyAoaG9va3MpIHtcbiAgY29uc3QgcmVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaG9va3MubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocmVzLmluZGV4T2YoaG9va3NbaV0pID09PSAtMSkge1xuICAgICAgcmVzLnB1c2goaG9va3NbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIHJlbW92ZUhvb2sgKGhvb2tzLCBob29rKSB7XG4gIGNvbnN0IGluZGV4ID0gaG9va3MuaW5kZXhPZihob29rKTtcbiAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgIGhvb2tzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWVyZ2VJbnRlcmNlcHRvckhvb2sgKGludGVyY2VwdG9yLCBvcHRpb24pIHtcbiAgT2JqZWN0LmtleXMob3B0aW9uKS5mb3JFYWNoKGhvb2sgPT4ge1xuICAgIGlmIChIT09LUy5pbmRleE9mKGhvb2spICE9PSAtMSAmJiBpc0ZuKG9wdGlvbltob29rXSkpIHtcbiAgICAgIGludGVyY2VwdG9yW2hvb2tdID0gbWVyZ2VIb29rKGludGVyY2VwdG9yW2hvb2tdLCBvcHRpb25baG9va10pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUludGVyY2VwdG9ySG9vayAoaW50ZXJjZXB0b3IsIG9wdGlvbikge1xuICBpZiAoIWludGVyY2VwdG9yIHx8ICFvcHRpb24pIHtcbiAgICByZXR1cm5cbiAgfVxuICBPYmplY3Qua2V5cyhvcHRpb24pLmZvckVhY2goaG9vayA9PiB7XG4gICAgaWYgKEhPT0tTLmluZGV4T2YoaG9vaykgIT09IC0xICYmIGlzRm4ob3B0aW9uW2hvb2tdKSkge1xuICAgICAgcmVtb3ZlSG9vayhpbnRlcmNlcHRvcltob29rXSwgb3B0aW9uW2hvb2tdKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRJbnRlcmNlcHRvciAobWV0aG9kLCBvcHRpb24pIHtcbiAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdzdHJpbmcnICYmIGlzUGxhaW5PYmplY3Qob3B0aW9uKSkge1xuICAgIG1lcmdlSW50ZXJjZXB0b3JIb29rKHNjb3BlZEludGVyY2VwdG9yc1ttZXRob2RdIHx8IChzY29wZWRJbnRlcmNlcHRvcnNbbWV0aG9kXSA9IHt9KSwgb3B0aW9uKTtcbiAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KG1ldGhvZCkpIHtcbiAgICBtZXJnZUludGVyY2VwdG9ySG9vayhnbG9iYWxJbnRlcmNlcHRvcnMsIG1ldGhvZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlSW50ZXJjZXB0b3IgKG1ldGhvZCwgb3B0aW9uKSB7XG4gIGlmICh0eXBlb2YgbWV0aG9kID09PSAnc3RyaW5nJykge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KG9wdGlvbikpIHtcbiAgICAgIHJlbW92ZUludGVyY2VwdG9ySG9vayhzY29wZWRJbnRlcmNlcHRvcnNbbWV0aG9kXSwgb3B0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHNjb3BlZEludGVyY2VwdG9yc1ttZXRob2RdO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KG1ldGhvZCkpIHtcbiAgICByZW1vdmVJbnRlcmNlcHRvckhvb2soZ2xvYmFsSW50ZXJjZXB0b3JzLCBtZXRob2QpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdyYXBwZXJIb29rIChob29rKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBob29rKGRhdGEpIHx8IGRhdGFcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1Byb21pc2UgKG9iaikge1xuICByZXR1cm4gISFvYmogJiYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnIHx8IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpICYmIHR5cGVvZiBvYmoudGhlbiA9PT0gJ2Z1bmN0aW9uJ1xufVxuXG5mdW5jdGlvbiBxdWV1ZSAoaG9va3MsIGRhdGEpIHtcbiAgbGV0IHByb21pc2UgPSBmYWxzZTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGhvb2sgPSBob29rc1tpXTtcbiAgICBpZiAocHJvbWlzZSkge1xuICAgICAgcHJvbWlzZSA9IFByb21pc2UudGhlbih3cmFwcGVySG9vayhob29rKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlcyA9IGhvb2soZGF0YSk7XG4gICAgICBpZiAoaXNQcm9taXNlKHJlcykpIHtcbiAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShyZXMpO1xuICAgICAgfVxuICAgICAgaWYgKHJlcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0aGVuICgpIHt9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByb21pc2UgfHwge1xuICAgIHRoZW4gKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZGF0YSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gd3JhcHBlck9wdGlvbnMgKGludGVyY2VwdG9yLCBvcHRpb25zID0ge30pIHtcbiAgWydzdWNjZXNzJywgJ2ZhaWwnLCAnY29tcGxldGUnXS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGludGVyY2VwdG9yW25hbWVdKSkge1xuICAgICAgY29uc3Qgb2xkQ2FsbGJhY2sgPSBvcHRpb25zW25hbWVdO1xuICAgICAgb3B0aW9uc1tuYW1lXSA9IGZ1bmN0aW9uIGNhbGxiYWNrSW50ZXJjZXB0b3IgKHJlcykge1xuICAgICAgICBxdWV1ZShpbnRlcmNlcHRvcltuYW1lXSwgcmVzKS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1taXhlZC1vcGVyYXRvcnMgKi9cbiAgICAgICAgICByZXR1cm4gaXNGbihvbGRDYWxsYmFjaykgJiYgb2xkQ2FsbGJhY2socmVzKSB8fCByZXNcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvcHRpb25zXG59XG5cbmZ1bmN0aW9uIHdyYXBwZXJSZXR1cm5WYWx1ZSAobWV0aG9kLCByZXR1cm5WYWx1ZSkge1xuICBjb25zdCByZXR1cm5WYWx1ZUhvb2tzID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KGdsb2JhbEludGVyY2VwdG9ycy5yZXR1cm5WYWx1ZSkpIHtcbiAgICByZXR1cm5WYWx1ZUhvb2tzLnB1c2goLi4uZ2xvYmFsSW50ZXJjZXB0b3JzLnJldHVyblZhbHVlKTtcbiAgfVxuICBjb25zdCBpbnRlcmNlcHRvciA9IHNjb3BlZEludGVyY2VwdG9yc1ttZXRob2RdO1xuICBpZiAoaW50ZXJjZXB0b3IgJiYgQXJyYXkuaXNBcnJheShpbnRlcmNlcHRvci5yZXR1cm5WYWx1ZSkpIHtcbiAgICByZXR1cm5WYWx1ZUhvb2tzLnB1c2goLi4uaW50ZXJjZXB0b3IucmV0dXJuVmFsdWUpO1xuICB9XG4gIHJldHVyblZhbHVlSG9va3MuZm9yRWFjaChob29rID0+IHtcbiAgICByZXR1cm5WYWx1ZSA9IGhvb2socmV0dXJuVmFsdWUpIHx8IHJldHVyblZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHJldHVyblZhbHVlXG59XG5cbmZ1bmN0aW9uIGdldEFwaUludGVyY2VwdG9ySG9va3MgKG1ldGhvZCkge1xuICBjb25zdCBpbnRlcmNlcHRvciA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIE9iamVjdC5rZXlzKGdsb2JhbEludGVyY2VwdG9ycykuZm9yRWFjaChob29rID0+IHtcbiAgICBpZiAoaG9vayAhPT0gJ3JldHVyblZhbHVlJykge1xuICAgICAgaW50ZXJjZXB0b3JbaG9va10gPSBnbG9iYWxJbnRlcmNlcHRvcnNbaG9va10uc2xpY2UoKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBzY29wZWRJbnRlcmNlcHRvciA9IHNjb3BlZEludGVyY2VwdG9yc1ttZXRob2RdO1xuICBpZiAoc2NvcGVkSW50ZXJjZXB0b3IpIHtcbiAgICBPYmplY3Qua2V5cyhzY29wZWRJbnRlcmNlcHRvcikuZm9yRWFjaChob29rID0+IHtcbiAgICAgIGlmIChob29rICE9PSAncmV0dXJuVmFsdWUnKSB7XG4gICAgICAgIGludGVyY2VwdG9yW2hvb2tdID0gKGludGVyY2VwdG9yW2hvb2tdIHx8IFtdKS5jb25jYXQoc2NvcGVkSW50ZXJjZXB0b3JbaG9va10pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBpbnRlcmNlcHRvclxufVxuXG5mdW5jdGlvbiBpbnZva2VBcGkgKG1ldGhvZCwgYXBpLCBvcHRpb25zLCAuLi5wYXJhbXMpIHtcbiAgY29uc3QgaW50ZXJjZXB0b3IgPSBnZXRBcGlJbnRlcmNlcHRvckhvb2tzKG1ldGhvZCk7XG4gIGlmIChpbnRlcmNlcHRvciAmJiBPYmplY3Qua2V5cyhpbnRlcmNlcHRvcikubGVuZ3RoKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaW50ZXJjZXB0b3IuaW52b2tlKSkge1xuICAgICAgY29uc3QgcmVzID0gcXVldWUoaW50ZXJjZXB0b3IuaW52b2tlLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiByZXMudGhlbigob3B0aW9ucykgPT4ge1xuICAgICAgICByZXR1cm4gYXBpKHdyYXBwZXJPcHRpb25zKGludGVyY2VwdG9yLCBvcHRpb25zKSwgLi4ucGFyYW1zKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFwaSh3cmFwcGVyT3B0aW9ucyhpbnRlcmNlcHRvciwgb3B0aW9ucyksIC4uLnBhcmFtcylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFwaShvcHRpb25zLCAuLi5wYXJhbXMpXG59XG5cbmNvbnN0IHByb21pc2VJbnRlcmNlcHRvciA9IHtcbiAgcmV0dXJuVmFsdWUgKHJlcykge1xuICAgIGlmICghaXNQcm9taXNlKHJlcykpIHtcbiAgICAgIHJldHVybiByZXNcbiAgICB9XG4gICAgcmV0dXJuIHJlcy50aGVuKHJlcyA9PiB7XG4gICAgICByZXR1cm4gcmVzWzFdXG4gICAgfSkuY2F0Y2gocmVzID0+IHtcbiAgICAgIHJldHVybiByZXNbMF1cbiAgICB9KVxuICB9XG59O1xuXG5jb25zdCBTWU5DX0FQSV9SRSA9XG4gIC9eXFwkfHJlc3RvcmVHbG9iYWx8Z2V0Q3VycmVudFN1Yk5WdWV8Z2V0TWVudUJ1dHRvbkJvdW5kaW5nQ2xpZW50UmVjdHxecmVwb3J0fGludGVyY2VwdG9yc3xJbnRlcmNlcHRvciR8Z2V0U3ViTlZ1ZUJ5SWR8cmVxdWlyZU5hdGl2ZVBsdWdpbnx1cHgycHh8aGlkZUtleWJvYXJkfGNhbklVc2V8XmNyZWF0ZXxTeW5jJHxNYW5hZ2VyJHxiYXNlNjRUb0FycmF5QnVmZmVyfGFycmF5QnVmZmVyVG9CYXNlNjQvO1xuXG5jb25zdCBDT05URVhUX0FQSV9SRSA9IC9eY3JlYXRlfE1hbmFnZXIkLztcblxuY29uc3QgQ0FMTEJBQ0tfQVBJX1JFID0gL15vbi87XG5cbmZ1bmN0aW9uIGlzQ29udGV4dEFwaSAobmFtZSkge1xuICByZXR1cm4gQ09OVEVYVF9BUElfUkUudGVzdChuYW1lKVxufVxuZnVuY3Rpb24gaXNTeW5jQXBpIChuYW1lKSB7XG4gIHJldHVybiBTWU5DX0FQSV9SRS50ZXN0KG5hbWUpXG59XG5cbmZ1bmN0aW9uIGlzQ2FsbGJhY2tBcGkgKG5hbWUpIHtcbiAgcmV0dXJuIENBTExCQUNLX0FQSV9SRS50ZXN0KG5hbWUpICYmIG5hbWUgIT09ICdvblB1c2gnXG59XG5cbmZ1bmN0aW9uIGhhbmRsZVByb21pc2UgKHByb21pc2UpIHtcbiAgcmV0dXJuIHByb21pc2UudGhlbihkYXRhID0+IHtcbiAgICByZXR1cm4gW251bGwsIGRhdGFdXG4gIH0pXG4gICAgLmNhdGNoKGVyciA9PiBbZXJyXSlcbn1cblxuZnVuY3Rpb24gc2hvdWxkUHJvbWlzZSAobmFtZSkge1xuICBpZiAoXG4gICAgaXNDb250ZXh0QXBpKG5hbWUpIHx8XG4gICAgaXNTeW5jQXBpKG5hbWUpIHx8XG4gICAgaXNDYWxsYmFja0FwaShuYW1lKVxuICApIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBwcm9taXNpZnkgKG5hbWUsIGFwaSkge1xuICBpZiAoIXNob3VsZFByb21pc2UobmFtZSkpIHtcbiAgICByZXR1cm4gYXBpXG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIHByb21pc2VBcGkgKG9wdGlvbnMgPSB7fSwgLi4ucGFyYW1zKSB7XG4gICAgaWYgKGlzRm4ob3B0aW9ucy5zdWNjZXNzKSB8fCBpc0ZuKG9wdGlvbnMuZmFpbCkgfHwgaXNGbihvcHRpb25zLmNvbXBsZXRlKSkge1xuICAgICAgcmV0dXJuIHdyYXBwZXJSZXR1cm5WYWx1ZShuYW1lLCBpbnZva2VBcGkobmFtZSwgYXBpLCBvcHRpb25zLCAuLi5wYXJhbXMpKVxuICAgIH1cbiAgICByZXR1cm4gd3JhcHBlclJldHVyblZhbHVlKG5hbWUsIGhhbmRsZVByb21pc2UobmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaW52b2tlQXBpKG5hbWUsIGFwaSwgT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xuICAgICAgICBzdWNjZXNzOiByZXNvbHZlLFxuICAgICAgICBmYWlsOiByZWplY3RcbiAgICAgIH0pLCAuLi5wYXJhbXMpO1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tZXh0ZW5kLW5hdGl2ZSAqL1xuICAgICAgaWYgKCFQcm9taXNlLnByb3RvdHlwZS5maW5hbGx5KSB7XG4gICAgICAgIFByb21pc2UucHJvdG90eXBlLmZpbmFsbHkgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjb25zdCBwcm9taXNlID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICByZXR1cm4gdGhpcy50aGVuKFxuICAgICAgICAgICAgdmFsdWUgPT4gcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oKCkgPT4gdmFsdWUpLFxuICAgICAgICAgICAgcmVhc29uID0+IHByb21pc2UucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhyb3cgcmVhc29uXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KSkpXG4gIH1cbn1cblxuY29uc3QgRVBTID0gMWUtNDtcbmNvbnN0IEJBU0VfREVWSUNFX1dJRFRIID0gNzUwO1xubGV0IGlzSU9TID0gZmFsc2U7XG5sZXQgZGV2aWNlV2lkdGggPSAwO1xubGV0IGRldmljZURQUiA9IDA7XG5cbmZ1bmN0aW9uIGNoZWNrRGV2aWNlV2lkdGggKCkge1xuICBjb25zdCB7XG4gICAgcGxhdGZvcm0sXG4gICAgcGl4ZWxSYXRpbyxcbiAgICB3aW5kb3dXaWR0aFxuICB9ID0gc3dhbi5nZXRTeXN0ZW1JbmZvU3luYygpOyAvLyB1bmk9PnN3YW4gcnVudGltZSDnvJbor5Hnm67moIfmmK8gdW5pIOWvueixoe+8jOWGhemDqOS4jeWFgeiuuOebtOaOpeS9v+eUqCB1bmlcblxuICBkZXZpY2VXaWR0aCA9IHdpbmRvd1dpZHRoO1xuICBkZXZpY2VEUFIgPSBwaXhlbFJhdGlvO1xuICBpc0lPUyA9IHBsYXRmb3JtID09PSAnaW9zJztcbn1cblxuZnVuY3Rpb24gdXB4MnB4IChudW1iZXIsIG5ld0RldmljZVdpZHRoKSB7XG4gIGlmIChkZXZpY2VXaWR0aCA9PT0gMCkge1xuICAgIGNoZWNrRGV2aWNlV2lkdGgoKTtcbiAgfVxuXG4gIG51bWJlciA9IE51bWJlcihudW1iZXIpO1xuICBpZiAobnVtYmVyID09PSAwKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBsZXQgcmVzdWx0ID0gKG51bWJlciAvIEJBU0VfREVWSUNFX1dJRFRIKSAqIChuZXdEZXZpY2VXaWR0aCB8fCBkZXZpY2VXaWR0aCk7XG4gIGlmIChyZXN1bHQgPCAwKSB7XG4gICAgcmVzdWx0ID0gLXJlc3VsdDtcbiAgfVxuICByZXN1bHQgPSBNYXRoLmZsb29yKHJlc3VsdCArIEVQUyk7XG4gIGlmIChyZXN1bHQgPT09IDApIHtcbiAgICBpZiAoZGV2aWNlRFBSID09PSAxIHx8ICFpc0lPUykge1xuICAgICAgcmV0dXJuIDFcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDAuNVxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVtYmVyIDwgMCA/IC1yZXN1bHQgOiByZXN1bHRcbn1cblxuY29uc3QgaW50ZXJjZXB0b3JzID0ge1xuICBwcm9taXNlSW50ZXJjZXB0b3Jcbn07XG5cblxuXG52YXIgYmFzZUFwaSA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgdXB4MnB4OiB1cHgycHgsXG4gIGludGVyY2VwdG9yczogaW50ZXJjZXB0b3JzLFxuICBhZGRJbnRlcmNlcHRvcjogYWRkSW50ZXJjZXB0b3IsXG4gIHJlbW92ZUludGVyY2VwdG9yOiByZW1vdmVJbnRlcmNlcHRvclxufSk7XG5cbnZhciBwcmV2aWV3SW1hZ2UgPSB7XG4gIGFyZ3MgKGZyb21BcmdzKSB7XG4gICAgbGV0IGN1cnJlbnRJbmRleCA9IHBhcnNlSW50KGZyb21BcmdzLmN1cnJlbnQpO1xuICAgIGlmIChpc05hTihjdXJyZW50SW5kZXgpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgdXJscyA9IGZyb21BcmdzLnVybHM7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHVybHMpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgbGVuID0gdXJscy5sZW5ndGg7XG4gICAgaWYgKCFsZW4pIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoY3VycmVudEluZGV4IDwgMCkge1xuICAgICAgY3VycmVudEluZGV4ID0gMDtcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRJbmRleCA+PSBsZW4pIHtcbiAgICAgIGN1cnJlbnRJbmRleCA9IGxlbiAtIDE7XG4gICAgfVxuICAgIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICBmcm9tQXJncy5jdXJyZW50ID0gdXJsc1tjdXJyZW50SW5kZXhdO1xuICAgICAgZnJvbUFyZ3MudXJscyA9IHVybHMuZmlsdGVyKFxuICAgICAgICAoaXRlbSwgaW5kZXgpID0+IGluZGV4IDwgY3VycmVudEluZGV4ID8gaXRlbSAhPT0gdXJsc1tjdXJyZW50SW5kZXhdIDogdHJ1ZVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJvbUFyZ3MuY3VycmVudCA9IHVybHNbMF07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpbmRpY2F0b3I6IGZhbHNlLFxuICAgICAgbG9vcDogZmFsc2VcbiAgICB9XG4gIH1cbn07XG5cbi8vIOS4jeaUr+aMgeeahCBBUEkg5YiX6KGoXG5jb25zdCB0b2RvcyA9IFtcbiAgJ2hpZGVLZXlib2FyZCcsXG4gICdvbkd5cm9zY29wZUNoYW5nZScsXG4gICdzdGFydEd5cm9zY29wZScsXG4gICdzdG9wR3lyb3Njb3BlJyxcbiAgJ29wZW5CbHVldG9vdGhBZGFwdGVyJyxcbiAgJ3N0YXJ0Qmx1ZXRvb3RoRGV2aWNlc0Rpc2NvdmVyeScsXG4gICdvbkJsdWV0b290aERldmljZUZvdW5kJyxcbiAgJ3N0b3BCbHVldG9vdGhEZXZpY2VzRGlzY292ZXJ5JyxcbiAgJ29uQmx1ZXRvb3RoQWRhcHRlclN0YXRlQ2hhbmdlJyxcbiAgJ2dldENvbm5lY3RlZEJsdWV0b290aERldmljZXMnLFxuICAnZ2V0Qmx1ZXRvb3RoRGV2aWNlcycsXG4gICdnZXRCbHVldG9vdGhBZGFwdGVyU3RhdGUnLFxuICAnY2xvc2VCbHVldG9vdGhBZGFwdGVyJyxcbiAgJ3dyaXRlQkxFQ2hhcmFjdGVyaXN0aWNWYWx1ZScsXG4gICdyZWFkQkxFQ2hhcmFjdGVyaXN0aWNWYWx1ZScsXG4gICdvbkJMRUNvbm5lY3Rpb25TdGF0ZUNoYW5nZScsXG4gICdvbkJMRUNoYXJhY3RlcmlzdGljVmFsdWVDaGFuZ2UnLFxuICAnbm90aWZ5QkxFQ2hhcmFjdGVyaXN0aWNWYWx1ZUNoYW5nZScsXG4gICdnZXRCTEVEZXZpY2VTZXJ2aWNlcycsXG4gICdnZXRCTEVEZXZpY2VDaGFyYWN0ZXJpc3RpY3MnLFxuICAnY3JlYXRlQkxFQ29ubmVjdGlvbicsXG4gICdjbG9zZUJMRUNvbm5lY3Rpb24nLFxuICAnb25CZWFjb25TZXJ2aWNlQ2hhbmdlJyxcbiAgJ29uQmVhY29uVXBkYXRlJyxcbiAgJ2dldEJlYWNvbnMnLFxuICAnc3RhcnRCZWFjb25EaXNjb3ZlcnknLFxuICAnc3RvcEJlYWNvbkRpc2NvdmVyeScsXG4gICdoaWRlU2hhcmVNZW51JyxcbiAgJ29uV2luZG93UmVzaXplJyxcbiAgJ29mZldpbmRvd1Jlc2l6ZScsXG4gICd2aWJyYXRlJ1xuXTtcblxuLy8g5a2Y5Zyo5YW85a655oCn55qEIEFQSSDliJfooahcbmNvbnN0IGNhbklVc2VzID0gW107XG5cbmZ1bmN0aW9uIGNyZWF0ZVRvZG9NZXRob2QgKGNvbnRleHROYW1lLCBtZXRob2ROYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbiB1bnN1cHBvcnRlZCAoKSB7XG4gICAgY29uc29sZS5lcnJvcihg55m+5bqm5bCP56iL5bqPICR7Y29udGV4dE5hbWV95pqC5LiN5pSv5oyBJHttZXRob2ROYW1lfWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9oYW5kbGVFbnZJbmZvIChyZXN1bHQpIHtcbiAgcmVzdWx0Lm1pbmlQcm9ncmFtID0ge1xuICAgIGFwcElkOiByZXN1bHQuYXBwS2V5XG4gIH07XG4gIHJlc3VsdC5wbHVnaW4gPSB7XG4gICAgdmVyc2lvbjogcmVzdWx0LnNka1ZlcnNpb25cbiAgfTtcbn1cblxuLy8g6ZyA6KaB5YGa6L2s5o2i55qEIEFQSSDliJfooahcbmNvbnN0IHByb3RvY29scyA9IHtcbiAgcmVxdWVzdDoge1xuICAgIGFyZ3MgKGZyb21BcmdzKSB7XG4gICAgICAvLyBUT0RPXG4gICAgICAvLyBkYXRhIOS4jeaUr+aMgSBBcnJheUJ1ZmZlclxuICAgICAgLy8gbWV0aG9kIOS4jeaUr+aMgSBUUkFDRSwgQ09OTkVDVFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWV0aG9kOiAnbWV0aG9kJyxcbiAgICAgICAgZGF0YVR5cGUgKHR5cGUpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogJ2RhdGFUeXBlJyxcbiAgICAgICAgICAgIHZhbHVlOiB0eXBlID09PSAnanNvbicgPyB0eXBlIDogJ3N0cmluZydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGNvbm5lY3RTb2NrZXQ6IHtcbiAgICBhcmdzOiB7XG4gICAgICBtZXRob2Q6IGZhbHNlXG4gICAgfVxuICB9LFxuICBwcmV2aWV3SW1hZ2UsXG4gIGdldFJlY29yZGVyTWFuYWdlcjoge1xuICAgIHJldHVyblZhbHVlIChmcm9tUmV0KSB7XG4gICAgICBmcm9tUmV0Lm9uRnJhbWVSZWNvcmRlZCA9IGNyZWF0ZVRvZG9NZXRob2QoJ1JlY29yZGVyTWFuYWdlcicsICdvbkZyYW1lUmVjb3JkZWQnKTtcbiAgICB9XG4gIH0sXG4gIGdldEJhY2tncm91bmRBdWRpb01hbmFnZXI6IHtcbiAgICByZXR1cm5WYWx1ZSAoZnJvbVJldCkge1xuICAgICAgZnJvbVJldC5vblByZXYgPSBjcmVhdGVUb2RvTWV0aG9kKCdCYWNrZ3JvdW5kQXVkaW9NYW5hZ2VyJywgJ29uUHJldicpO1xuICAgICAgZnJvbVJldC5vbk5leHQgPSBjcmVhdGVUb2RvTWV0aG9kKCdCYWNrZ3JvdW5kQXVkaW9NYW5hZ2VyJywgJ29uTmV4dCcpO1xuICAgIH1cbiAgfSxcbiAgc2NhbkNvZGU6IHtcbiAgICBhcmdzOiB7XG4gICAgICBvbmx5RnJvbUNhbWVyYTogZmFsc2UsXG4gICAgICBzY2FuVHlwZTogZmFsc2VcbiAgICB9XG4gIH0sXG4gIG5hdmlnYXRlVG9NaW5pUHJvZ3JhbToge1xuICAgIG5hbWU6ICduYXZpZ2F0ZVRvU21hcnRQcm9ncmFtJyxcbiAgICBhcmdzOiB7XG4gICAgICBhcHBJZDogJ2FwcEtleScsXG4gICAgICBlbnZWZXJzaW9uOiBmYWxzZVxuICAgIH1cbiAgfSxcbiAgbmF2aWdhdGVCYWNrTWluaVByb2dyYW06IHtcbiAgICBuYW1lOiAnbmF2aWdhdGVCYWNrU21hcnRQcm9ncmFtJ1xuICB9LFxuICBzaG93U2hhcmVNZW51OiB7XG4gICAgbmFtZTogJ29wZW5TaGFyZSdcbiAgfSxcbiAgZ2V0QWNjb3VudEluZm9TeW5jOiB7XG4gICAgbmFtZTogJ2dldEVudkluZm9TeW5jJyxcbiAgICByZXR1cm5WYWx1ZTogX2hhbmRsZUVudkluZm9cbiAgfVxufTtcblxuY29uc3QgQ0FMTEJBQ0tTID0gWydzdWNjZXNzJywgJ2ZhaWwnLCAnY2FuY2VsJywgJ2NvbXBsZXRlJ107XG5cbmZ1bmN0aW9uIHByb2Nlc3NDYWxsYmFjayAobWV0aG9kTmFtZSwgbWV0aG9kLCByZXR1cm5WYWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKHJlcykge1xuICAgIHJldHVybiBtZXRob2QocHJvY2Vzc1JldHVyblZhbHVlKG1ldGhvZE5hbWUsIHJlcywgcmV0dXJuVmFsdWUpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NBcmdzIChtZXRob2ROYW1lLCBmcm9tQXJncywgYXJnc09wdGlvbiA9IHt9LCByZXR1cm5WYWx1ZSA9IHt9LCBrZWVwRnJvbUFyZ3MgPSBmYWxzZSkge1xuICBpZiAoaXNQbGFpbk9iamVjdChmcm9tQXJncykpIHsgLy8g5LiA6IisIGFwaSDnmoTlj4LmlbDop6PmnpBcbiAgICBjb25zdCB0b0FyZ3MgPSBrZWVwRnJvbUFyZ3MgPT09IHRydWUgPyBmcm9tQXJncyA6IHt9OyAvLyByZXR1cm5WYWx1ZSDkuLogZmFsc2Ug5pe277yM6K+05piO5piv5qC85byP5YyW6L+U5Zue5YC877yM55u05o6l5Zyo6L+U5Zue5YC85a+56LGh5LiK5L+u5pS56LWL5YC8XG4gICAgaWYgKGlzRm4oYXJnc09wdGlvbikpIHtcbiAgICAgIGFyZ3NPcHRpb24gPSBhcmdzT3B0aW9uKGZyb21BcmdzLCB0b0FyZ3MpIHx8IHt9O1xuICAgIH1cbiAgICBmb3IgKGxldCBrZXkgaW4gZnJvbUFyZ3MpIHtcbiAgICAgIGlmIChoYXNPd24oYXJnc09wdGlvbiwga2V5KSkge1xuICAgICAgICBsZXQga2V5T3B0aW9uID0gYXJnc09wdGlvbltrZXldO1xuICAgICAgICBpZiAoaXNGbihrZXlPcHRpb24pKSB7XG4gICAgICAgICAga2V5T3B0aW9uID0ga2V5T3B0aW9uKGZyb21BcmdzW2tleV0sIGZyb21BcmdzLCB0b0FyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgha2V5T3B0aW9uKSB7IC8vIOS4jeaUr+aMgeeahOWPguaVsFxuICAgICAgICAgIGNvbnNvbGUud2Fybihg55m+5bqm5bCP56iL5bqPICR7bWV0aG9kTmFtZX3mmoLkuI3mlK/mjIEke2tleX1gKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1N0cihrZXlPcHRpb24pKSB7IC8vIOmHjeWGmeWPguaVsCBrZXlcbiAgICAgICAgICB0b0FyZ3Nba2V5T3B0aW9uXSA9IGZyb21BcmdzW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdChrZXlPcHRpb24pKSB7IC8vIHtuYW1lOm5ld05hbWUsdmFsdWU6dmFsdWV95Y+v6YeN5paw5oyH5a6a5Y+C5pWwIGtleTp2YWx1ZVxuICAgICAgICAgIHRvQXJnc1trZXlPcHRpb24ubmFtZSA/IGtleU9wdGlvbi5uYW1lIDoga2V5XSA9IGtleU9wdGlvbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChDQUxMQkFDS1MuaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgICB0b0FyZ3Nba2V5XSA9IHByb2Nlc3NDYWxsYmFjayhtZXRob2ROYW1lLCBmcm9tQXJnc1trZXldLCByZXR1cm5WYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWtlZXBGcm9tQXJncykge1xuICAgICAgICAgIHRvQXJnc1trZXldID0gZnJvbUFyZ3Nba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9BcmdzXG4gIH0gZWxzZSBpZiAoaXNGbihmcm9tQXJncykpIHtcbiAgICBmcm9tQXJncyA9IHByb2Nlc3NDYWxsYmFjayhtZXRob2ROYW1lLCBmcm9tQXJncywgcmV0dXJuVmFsdWUpO1xuICB9XG4gIHJldHVybiBmcm9tQXJnc1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzUmV0dXJuVmFsdWUgKG1ldGhvZE5hbWUsIHJlcywgcmV0dXJuVmFsdWUsIGtlZXBSZXR1cm5WYWx1ZSA9IGZhbHNlKSB7XG4gIGlmIChpc0ZuKHByb3RvY29scy5yZXR1cm5WYWx1ZSkpIHsgLy8g5aSE55CG6YCa55SoIHJldHVyblZhbHVlXG4gICAgcmVzID0gcHJvdG9jb2xzLnJldHVyblZhbHVlKG1ldGhvZE5hbWUsIHJlcyk7XG4gIH1cbiAgcmV0dXJuIHByb2Nlc3NBcmdzKG1ldGhvZE5hbWUsIHJlcywgcmV0dXJuVmFsdWUsIHt9LCBrZWVwUmV0dXJuVmFsdWUpXG59XG5cbmZ1bmN0aW9uIHdyYXBwZXIgKG1ldGhvZE5hbWUsIG1ldGhvZCkge1xuICBpZiAoaGFzT3duKHByb3RvY29scywgbWV0aG9kTmFtZSkpIHtcbiAgICBjb25zdCBwcm90b2NvbCA9IHByb3RvY29sc1ttZXRob2ROYW1lXTtcbiAgICBpZiAoIXByb3RvY29sKSB7IC8vIOaaguS4jeaUr+aMgeeahCBhcGlcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYOeZvuW6puWwj+eoi+W6jyDmmoLkuI3mlK/mjIEke21ldGhvZE5hbWV9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoYXJnMSwgYXJnMikgeyAvLyDnm67liY0gYXBpIOacgOWkmuS4pOS4quWPguaVsFxuICAgICAgbGV0IG9wdGlvbnMgPSBwcm90b2NvbDtcbiAgICAgIGlmIChpc0ZuKHByb3RvY29sKSkge1xuICAgICAgICBvcHRpb25zID0gcHJvdG9jb2woYXJnMSk7XG4gICAgICB9XG5cbiAgICAgIGFyZzEgPSBwcm9jZXNzQXJncyhtZXRob2ROYW1lLCBhcmcxLCBvcHRpb25zLmFyZ3MsIG9wdGlvbnMucmV0dXJuVmFsdWUpO1xuXG4gICAgICBjb25zdCBhcmdzID0gW2FyZzFdO1xuICAgICAgaWYgKHR5cGVvZiBhcmcyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBhcmdzLnB1c2goYXJnMik7XG4gICAgICB9XG4gICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHN3YW5bb3B0aW9ucy5uYW1lIHx8IG1ldGhvZE5hbWVdLmFwcGx5KHN3YW4sIGFyZ3MpO1xuICAgICAgaWYgKGlzU3luY0FwaShtZXRob2ROYW1lKSkgeyAvLyDlkIzmraUgYXBpXG4gICAgICAgIHJldHVybiBwcm9jZXNzUmV0dXJuVmFsdWUobWV0aG9kTmFtZSwgcmV0dXJuVmFsdWUsIG9wdGlvbnMucmV0dXJuVmFsdWUsIGlzQ29udGV4dEFwaShtZXRob2ROYW1lKSlcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXR1cm5WYWx1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWV0aG9kXG59XG5cbmNvbnN0IHRvZG9BcGlzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuY29uc3QgVE9ET1MgPSBbXG4gICdvblRhYkJhck1pZEJ1dHRvblRhcCcsXG4gICdzdWJzY3JpYmVQdXNoJyxcbiAgJ3Vuc3Vic2NyaWJlUHVzaCcsXG4gICdvblB1c2gnLFxuICAnb2ZmUHVzaCcsXG4gICdzaGFyZSdcbl07XG5cbmZ1bmN0aW9uIGNyZWF0ZVRvZG9BcGkgKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRvZG9BcGkgKHtcbiAgICBmYWlsLFxuICAgIGNvbXBsZXRlXG4gIH0pIHtcbiAgICBjb25zdCByZXMgPSB7XG4gICAgICBlcnJNc2c6IGAke25hbWV9OmZhaWw65pqC5LiN5pSv5oyBICR7bmFtZX0g5pa55rOVYFxuICAgIH07XG4gICAgaXNGbihmYWlsKSAmJiBmYWlsKHJlcyk7XG4gICAgaXNGbihjb21wbGV0ZSkgJiYgY29tcGxldGUocmVzKTtcbiAgfVxufVxuXG5UT0RPUy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gIHRvZG9BcGlzW25hbWVdID0gY3JlYXRlVG9kb0FwaShuYW1lKTtcbn0pO1xuXG52YXIgcHJvdmlkZXJzID0ge1xuICBvYXV0aDogWydiYWlkdSddLFxuICBzaGFyZTogWydiYWlkdSddLFxuICBwYXltZW50OiBbJ2JhaWR1J10sXG4gIHB1c2g6IFsnYmFpZHUnXVxufTtcblxuZnVuY3Rpb24gZ2V0UHJvdmlkZXIgKHtcbiAgc2VydmljZSxcbiAgc3VjY2VzcyxcbiAgZmFpbCxcbiAgY29tcGxldGVcbn0pIHtcbiAgbGV0IHJlcyA9IGZhbHNlO1xuICBpZiAocHJvdmlkZXJzW3NlcnZpY2VdKSB7XG4gICAgcmVzID0ge1xuICAgICAgZXJyTXNnOiAnZ2V0UHJvdmlkZXI6b2snLFxuICAgICAgc2VydmljZSxcbiAgICAgIHByb3ZpZGVyOiBwcm92aWRlcnNbc2VydmljZV1cbiAgICB9O1xuICAgIGlzRm4oc3VjY2VzcykgJiYgc3VjY2VzcyhyZXMpO1xuICB9IGVsc2Uge1xuICAgIHJlcyA9IHtcbiAgICAgIGVyck1zZzogJ2dldFByb3ZpZGVyOmZhaWw65pyN5YqhWycgKyBzZXJ2aWNlICsgJ13kuI3lrZjlnKgnXG4gICAgfTtcbiAgICBpc0ZuKGZhaWwpICYmIGZhaWwocmVzKTtcbiAgfVxuICBpc0ZuKGNvbXBsZXRlKSAmJiBjb21wbGV0ZShyZXMpO1xufVxuXG52YXIgZXh0cmFBcGkgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gIGdldFByb3ZpZGVyOiBnZXRQcm92aWRlclxufSk7XG5cbmNvbnN0IGdldEVtaXR0ZXIgPSAoZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIGdldFVuaUVtaXR0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgIHJldHVybiBnZXRVbmlFbWl0dGVyXG4gIH1cbiAgbGV0IEVtaXR0ZXI7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRVbmlFbWl0dGVyICgpIHtcbiAgICBpZiAoIUVtaXR0ZXIpIHtcbiAgICAgIEVtaXR0ZXIgPSBuZXcgVnVlKCk7XG4gICAgfVxuICAgIHJldHVybiBFbWl0dGVyXG4gIH1cbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5IChjdHgsIG1ldGhvZCwgYXJncykge1xuICByZXR1cm4gY3R4W21ldGhvZF0uYXBwbHkoY3R4LCBhcmdzKVxufVxuXG5mdW5jdGlvbiAkb24gKCkge1xuICByZXR1cm4gYXBwbHkoZ2V0RW1pdHRlcigpLCAnJG9uJywgWy4uLmFyZ3VtZW50c10pXG59XG5mdW5jdGlvbiAkb2ZmICgpIHtcbiAgcmV0dXJuIGFwcGx5KGdldEVtaXR0ZXIoKSwgJyRvZmYnLCBbLi4uYXJndW1lbnRzXSlcbn1cbmZ1bmN0aW9uICRvbmNlICgpIHtcbiAgcmV0dXJuIGFwcGx5KGdldEVtaXR0ZXIoKSwgJyRvbmNlJywgWy4uLmFyZ3VtZW50c10pXG59XG5mdW5jdGlvbiAkZW1pdCAoKSB7XG4gIHJldHVybiBhcHBseShnZXRFbWl0dGVyKCksICckZW1pdCcsIFsuLi5hcmd1bWVudHNdKVxufVxuXG52YXIgZXZlbnRBcGkgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICRvbjogJG9uLFxuICAkb2ZmOiAkb2ZmLFxuICAkb25jZTogJG9uY2UsXG4gICRlbWl0OiAkZW1pdFxufSk7XG5cbmZ1bmN0aW9uIHJlcXVlc3RQYXltZW50IChwYXJhbXMpIHtcbiAgbGV0IHBhcnNlRXJyb3IgPSBmYWxzZTtcbiAgaWYgKHR5cGVvZiBwYXJhbXMub3JkZXJJbmZvID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBwYXJhbXMub3JkZXJJbmZvID0gSlNPTi5wYXJzZShwYXJhbXMub3JkZXJJbmZvKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBwYXJzZUVycm9yID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgaWYgKHBhcnNlRXJyb3IpIHtcbiAgICBwYXJhbXMuZmFpbCAmJiBwYXJhbXMuZmFpbCh7XG4gICAgICBlcnJNc2c6ICdyZXF1ZXN0UGF5bWVudDpmYWlsOiDlj4LmlbAgb3JkZXJJbmZvIOaVsOaNrue7k+aehOS4jeato+ehru+8jOWPguiAg++8mmh0dHBzOi8vdW5pYXBwLmRjbG91ZC5pby9hcGkvcGx1Z2lucy9wYXltZW50P2lkPW9yZGVyaW5mbydcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBzd2FuLnJlcXVlc3RQb2x5bWVyUGF5bWVudChwYXJhbXMpO1xuICB9XG59XG5cbnZhciBhcGkgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gIHJlcXVlc3RQYXltZW50OiByZXF1ZXN0UGF5bWVudFxufSk7XG5cbmNvbnN0IE1QUGFnZSA9IFBhZ2U7XG5jb25zdCBNUENvbXBvbmVudCA9IENvbXBvbmVudDtcblxuY29uc3QgY3VzdG9taXplUkUgPSAvOi9nO1xuXG5jb25zdCBjdXN0b21pemUgPSBjYWNoZWQoKHN0cikgPT4ge1xuICByZXR1cm4gY2FtZWxpemUoc3RyLnJlcGxhY2UoY3VzdG9taXplUkUsICctJykpXG59KTtcblxuZnVuY3Rpb24gaW5pdFRyaWdnZXJFdmVudCAobXBJbnN0YW5jZSkge1xuICBjb25zdCBvbGRUcmlnZ2VyRXZlbnQgPSBtcEluc3RhbmNlLnRyaWdnZXJFdmVudDtcbiAgbXBJbnN0YW5jZS50cmlnZ2VyRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQsIC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gb2xkVHJpZ2dlckV2ZW50LmFwcGx5KG1wSW5zdGFuY2UsIFtjdXN0b21pemUoZXZlbnQpLCAuLi5hcmdzXSlcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdEhvb2sgKG5hbWUsIG9wdGlvbnMpIHtcbiAgY29uc3Qgb2xkSG9vayA9IG9wdGlvbnNbbmFtZV07XG4gIGlmICghb2xkSG9vaykge1xuICAgIG9wdGlvbnNbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0VHJpZ2dlckV2ZW50KHRoaXMpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgb3B0aW9uc1tuYW1lXSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICBpbml0VHJpZ2dlckV2ZW50KHRoaXMpO1xuICAgICAgcmV0dXJuIG9sZEhvb2suYXBwbHkodGhpcywgYXJncylcbiAgICB9O1xuICB9XG59XG5cblBhZ2UgPSBmdW5jdGlvbiAob3B0aW9ucyA9IHt9KSB7XG4gIGluaXRIb29rKCdvbkxvYWQnLCBvcHRpb25zKTtcbiAgcmV0dXJuIE1QUGFnZShvcHRpb25zKVxufTtcblxuQ29tcG9uZW50ID0gZnVuY3Rpb24gKG9wdGlvbnMgPSB7fSkge1xuICBpbml0SG9vaygnY3JlYXRlZCcsIG9wdGlvbnMpO1xuICByZXR1cm4gTVBDb21wb25lbnQob3B0aW9ucylcbn07XG5cbmNvbnN0IFBBR0VfRVZFTlRfSE9PS1MgPSBbXG4gICdvblB1bGxEb3duUmVmcmVzaCcsXG4gICdvblJlYWNoQm90dG9tJyxcbiAgJ29uU2hhcmVBcHBNZXNzYWdlJyxcbiAgJ29uUGFnZVNjcm9sbCcsXG4gICdvblJlc2l6ZScsXG4gICdvblRhYkl0ZW1UYXAnXG5dO1xuXG5mdW5jdGlvbiBpbml0TW9ja3MgKHZtLCBtb2Nrcykge1xuICBjb25zdCBtcEluc3RhbmNlID0gdm0uJG1wW3ZtLm1wVHlwZV07XG4gIG1vY2tzLmZvckVhY2gobW9jayA9PiB7XG4gICAgaWYgKGhhc093bihtcEluc3RhbmNlLCBtb2NrKSkge1xuICAgICAgdm1bbW9ja10gPSBtcEluc3RhbmNlW21vY2tdO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhc0hvb2sgKGhvb2ssIHZ1ZU9wdGlvbnMpIHtcbiAgaWYgKCF2dWVPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGlmIChWdWUub3B0aW9ucyAmJiBBcnJheS5pc0FycmF5KFZ1ZS5vcHRpb25zW2hvb2tdKSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB2dWVPcHRpb25zID0gdnVlT3B0aW9ucy5kZWZhdWx0IHx8IHZ1ZU9wdGlvbnM7XG5cbiAgaWYgKGlzRm4odnVlT3B0aW9ucykpIHtcbiAgICBpZiAoaXNGbih2dWVPcHRpb25zLmV4dGVuZE9wdGlvbnNbaG9va10pKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBpZiAodnVlT3B0aW9ucy5zdXBlciAmJlxuICAgICAgdnVlT3B0aW9ucy5zdXBlci5vcHRpb25zICYmXG4gICAgICBBcnJheS5pc0FycmF5KHZ1ZU9wdGlvbnMuc3VwZXIub3B0aW9uc1tob29rXSkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgaWYgKGlzRm4odnVlT3B0aW9uc1tob29rXSkpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGNvbnN0IG1peGlucyA9IHZ1ZU9wdGlvbnMubWl4aW5zO1xuICBpZiAoQXJyYXkuaXNBcnJheShtaXhpbnMpKSB7XG4gICAgcmV0dXJuICEhbWl4aW5zLmZpbmQobWl4aW4gPT4gaGFzSG9vayhob29rLCBtaXhpbikpXG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdEhvb2tzIChtcE9wdGlvbnMsIGhvb2tzLCB2dWVPcHRpb25zKSB7XG4gIGhvb2tzLmZvckVhY2goaG9vayA9PiB7XG4gICAgaWYgKGhhc0hvb2soaG9vaywgdnVlT3B0aW9ucykpIHtcbiAgICAgIG1wT3B0aW9uc1tob29rXSA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiR2bSAmJiB0aGlzLiR2bS5fX2NhbGxfaG9vayhob29rLCBhcmdzKVxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0VnVlQ29tcG9uZW50IChWdWUsIHZ1ZU9wdGlvbnMpIHtcbiAgdnVlT3B0aW9ucyA9IHZ1ZU9wdGlvbnMuZGVmYXVsdCB8fCB2dWVPcHRpb25zO1xuICBsZXQgVnVlQ29tcG9uZW50O1xuICBpZiAoaXNGbih2dWVPcHRpb25zKSkge1xuICAgIFZ1ZUNvbXBvbmVudCA9IHZ1ZU9wdGlvbnM7XG4gICAgdnVlT3B0aW9ucyA9IFZ1ZUNvbXBvbmVudC5leHRlbmRPcHRpb25zO1xuICB9IGVsc2Uge1xuICAgIFZ1ZUNvbXBvbmVudCA9IFZ1ZS5leHRlbmQodnVlT3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIFtWdWVDb21wb25lbnQsIHZ1ZU9wdGlvbnNdXG59XG5cbmZ1bmN0aW9uIGluaXRTbG90cyAodm0sIHZ1ZVNsb3RzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZ1ZVNsb3RzKSAmJiB2dWVTbG90cy5sZW5ndGgpIHtcbiAgICBjb25zdCAkc2xvdHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHZ1ZVNsb3RzLmZvckVhY2goc2xvdE5hbWUgPT4ge1xuICAgICAgJHNsb3RzW3Nsb3ROYW1lXSA9IHRydWU7XG4gICAgfSk7XG4gICAgdm0uJHNjb3BlZFNsb3RzID0gdm0uJHNsb3RzID0gJHNsb3RzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRWdWVJZHMgKHZ1ZUlkcywgbXBJbnN0YW5jZSkge1xuICB2dWVJZHMgPSAodnVlSWRzIHx8ICcnKS5zcGxpdCgnLCcpO1xuICBjb25zdCBsZW4gPSB2dWVJZHMubGVuZ3RoO1xuXG4gIGlmIChsZW4gPT09IDEpIHtcbiAgICBtcEluc3RhbmNlLl8kdnVlSWQgPSB2dWVJZHNbMF07XG4gIH0gZWxzZSBpZiAobGVuID09PSAyKSB7XG4gICAgbXBJbnN0YW5jZS5fJHZ1ZUlkID0gdnVlSWRzWzBdO1xuICAgIG1wSW5zdGFuY2UuXyR2dWVQaWQgPSB2dWVJZHNbMV07XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdERhdGEgKHZ1ZU9wdGlvbnMsIGNvbnRleHQpIHtcbiAgbGV0IGRhdGEgPSB2dWVPcHRpb25zLmRhdGEgfHwge307XG4gIGNvbnN0IG1ldGhvZHMgPSB2dWVPcHRpb25zLm1ldGhvZHMgfHwge307XG5cbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBkYXRhLmNhbGwoY29udGV4dCk7IC8vIOaUr+aMgSBWdWUucHJvdG90eXBlIOS4iuaMgueahOaVsOaNrlxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5WVUVfQVBQX0RFQlVHKSB7XG4gICAgICAgIGNvbnNvbGUud2Fybign5qC55o2uIFZ1ZSDnmoQgZGF0YSDlh73mlbDliJ3lp4vljJblsI/nqIvluo8gZGF0YSDlpLHotKXvvIzor7flsL3ph4/noa7kv50gZGF0YSDlh73mlbDkuK3kuI3orr/pl64gdm0g5a+56LGh77yM5ZCm5YiZ5Y+v6IO95b2x5ZON6aaW5qyh5pWw5o2u5riy5p+T6YCf5bqm44CCJywgZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICAvLyDlr7kgZGF0YSDmoLzlvI/ljJZcbiAgICAgIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG5cbiAgaWYgKCFpc1BsYWluT2JqZWN0KGRhdGEpKSB7XG4gICAgZGF0YSA9IHt9O1xuICB9XG5cbiAgT2JqZWN0LmtleXMobWV0aG9kcykuZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICBpZiAoY29udGV4dC5fX2xpZmVjeWNsZV9ob29rc19fLmluZGV4T2YobWV0aG9kTmFtZSkgPT09IC0xICYmICFoYXNPd24oZGF0YSwgbWV0aG9kTmFtZSkpIHtcbiAgICAgIGRhdGFbbWV0aG9kTmFtZV0gPSBtZXRob2RzW21ldGhvZE5hbWVdO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGFcbn1cblxuY29uc3QgUFJPUF9UWVBFUyA9IFtTdHJpbmcsIE51bWJlciwgQm9vbGVhbiwgT2JqZWN0LCBBcnJheSwgbnVsbF07XG5cbmZ1bmN0aW9uIGNyZWF0ZU9ic2VydmVyIChuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbiBvYnNlcnZlciAobmV3VmFsLCBvbGRWYWwpIHtcbiAgICBpZiAodGhpcy4kdm0pIHtcbiAgICAgIHRoaXMuJHZtW25hbWVdID0gbmV3VmFsOyAvLyDkuLrkuobop6blj5Hlhbbku5bpnZ4gcmVuZGVyIHdhdGNoZXJcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdEJlaGF2aW9ycyAodnVlT3B0aW9ucywgaW5pdEJlaGF2aW9yKSB7XG4gIGNvbnN0IHZ1ZUJlaGF2aW9ycyA9IHZ1ZU9wdGlvbnNbJ2JlaGF2aW9ycyddO1xuICBjb25zdCB2dWVFeHRlbmRzID0gdnVlT3B0aW9uc1snZXh0ZW5kcyddO1xuICBjb25zdCB2dWVNaXhpbnMgPSB2dWVPcHRpb25zWydtaXhpbnMnXTtcblxuICBsZXQgdnVlUHJvcHMgPSB2dWVPcHRpb25zWydwcm9wcyddO1xuXG4gIGlmICghdnVlUHJvcHMpIHtcbiAgICB2dWVPcHRpb25zWydwcm9wcyddID0gdnVlUHJvcHMgPSBbXTtcbiAgfVxuXG4gIGNvbnN0IGJlaGF2aW9ycyA9IFtdO1xuICBpZiAoQXJyYXkuaXNBcnJheSh2dWVCZWhhdmlvcnMpKSB7XG4gICAgdnVlQmVoYXZpb3JzLmZvckVhY2goYmVoYXZpb3IgPT4ge1xuICAgICAgYmVoYXZpb3JzLnB1c2goYmVoYXZpb3IucmVwbGFjZSgndW5pOi8vJywgYCR7XCJzd2FuXCJ9Oi8vYCkpO1xuICAgICAgaWYgKGJlaGF2aW9yID09PSAndW5pOi8vZm9ybS1maWVsZCcpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodnVlUHJvcHMpKSB7XG4gICAgICAgICAgdnVlUHJvcHMucHVzaCgnbmFtZScpO1xuICAgICAgICAgIHZ1ZVByb3BzLnB1c2goJ3ZhbHVlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdnVlUHJvcHNbJ25hbWUnXSA9IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgICAgfTtcbiAgICAgICAgICB2dWVQcm9wc1sndmFsdWUnXSA9IHtcbiAgICAgICAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlciwgQm9vbGVhbiwgQXJyYXksIE9iamVjdCwgRGF0ZV0sXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAoaXNQbGFpbk9iamVjdCh2dWVFeHRlbmRzKSAmJiB2dWVFeHRlbmRzLnByb3BzKSB7XG4gICAgYmVoYXZpb3JzLnB1c2goXG4gICAgICBpbml0QmVoYXZpb3Ioe1xuICAgICAgICBwcm9wZXJ0aWVzOiBpbml0UHJvcGVydGllcyh2dWVFeHRlbmRzLnByb3BzLCB0cnVlKVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHZ1ZU1peGlucykpIHtcbiAgICB2dWVNaXhpbnMuZm9yRWFjaCh2dWVNaXhpbiA9PiB7XG4gICAgICBpZiAoaXNQbGFpbk9iamVjdCh2dWVNaXhpbikgJiYgdnVlTWl4aW4ucHJvcHMpIHtcbiAgICAgICAgYmVoYXZpb3JzLnB1c2goXG4gICAgICAgICAgaW5pdEJlaGF2aW9yKHtcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IGluaXRQcm9wZXJ0aWVzKHZ1ZU1peGluLnByb3BzLCB0cnVlKVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGJlaGF2aW9yc1xufVxuXG5mdW5jdGlvbiBwYXJzZVByb3BUeXBlIChrZXksIHR5cGUsIGRlZmF1bHRWYWx1ZSwgZmlsZSkge1xuICAvLyBbU3RyaW5nXT0+U3RyaW5nXG4gIGlmIChBcnJheS5pc0FycmF5KHR5cGUpICYmIHR5cGUubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHR5cGVbMF1cbiAgfVxuICB7XG4gICAgaWYgKFxuICAgICAgZGVmYXVsdFZhbHVlID09PSBmYWxzZSAmJlxuICAgICAgQXJyYXkuaXNBcnJheSh0eXBlKSAmJlxuICAgICAgdHlwZS5sZW5ndGggPT09IDIgJiZcbiAgICAgIHR5cGUuaW5kZXhPZihTdHJpbmcpICE9PSAtMSAmJlxuICAgICAgdHlwZS5pbmRleE9mKEJvb2xlYW4pICE9PSAtMVxuICAgICkgeyAvLyBbU3RyaW5nLEJvb2xlYW5dPT5Cb29sZWFuXG4gICAgICBpZiAoZmlsZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYHByb3BzLiR7a2V5fS50eXBlIHNob3VsZCB1c2UgQm9vbGVhbiBpbnN0ZWFkIG9mIFtTdHJpbmcsQm9vbGVhbl0gYXQgJHtmaWxlfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBCb29sZWFuXG4gICAgfVxuICB9XG4gIHJldHVybiB0eXBlXG59XG5cbmZ1bmN0aW9uIGluaXRQcm9wZXJ0aWVzIChwcm9wcywgaXNCZWhhdmlvciA9IGZhbHNlLCBmaWxlID0gJycpIHtcbiAgY29uc3QgcHJvcGVydGllcyA9IHt9O1xuICBpZiAoIWlzQmVoYXZpb3IpIHtcbiAgICBwcm9wZXJ0aWVzLnZ1ZUlkID0ge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgdmFsdWU6ICcnXG4gICAgfTtcbiAgICBwcm9wZXJ0aWVzLnZ1ZVNsb3RzID0geyAvLyDlsI/nqIvluo/kuI3og73nm7TmjqXlrprkuYkgJHNsb3RzIOeahCBwcm9wc++8jOaJgOS7pemAmui/hyB2dWVTbG90cyDovazmjaLliLAgJHNsb3RzXG4gICAgICB0eXBlOiBudWxsLFxuICAgICAgdmFsdWU6IFtdLFxuICAgICAgb2JzZXJ2ZXI6IGZ1bmN0aW9uIChuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICBjb25zdCAkc2xvdHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBuZXdWYWwuZm9yRWFjaChzbG90TmFtZSA9PiB7XG4gICAgICAgICAgJHNsb3RzW3Nsb3ROYW1lXSA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgICRzbG90c1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHByb3BzKSkgeyAvLyBbJ3RpdGxlJ11cbiAgICBwcm9wcy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBwcm9wZXJ0aWVzW2tleV0gPSB7XG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIG9ic2VydmVyOiBjcmVhdGVPYnNlcnZlcihrZXkpXG4gICAgICB9O1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QocHJvcHMpKSB7IC8vIHt0aXRsZTp7dHlwZTpTdHJpbmcsZGVmYXVsdDonJ30sY29udGVudDpTdHJpbmd9XG4gICAgT2JqZWN0LmtleXMocHJvcHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnN0IG9wdHMgPSBwcm9wc1trZXldO1xuICAgICAgaWYgKGlzUGxhaW5PYmplY3Qob3B0cykpIHsgLy8gdGl0bGU6e3R5cGU6U3RyaW5nLGRlZmF1bHQ6Jyd9XG4gICAgICAgIGxldCB2YWx1ZSA9IG9wdHNbJ2RlZmF1bHQnXTtcbiAgICAgICAgaWYgKGlzRm4odmFsdWUpKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0cy50eXBlID0gcGFyc2VQcm9wVHlwZShrZXksIG9wdHMudHlwZSwgdmFsdWUsIGZpbGUpO1xuXG4gICAgICAgIHByb3BlcnRpZXNba2V5XSA9IHtcbiAgICAgICAgICB0eXBlOiBQUk9QX1RZUEVTLmluZGV4T2Yob3B0cy50eXBlKSAhPT0gLTEgPyBvcHRzLnR5cGUgOiBudWxsLFxuICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgIG9ic2VydmVyOiBjcmVhdGVPYnNlcnZlcihrZXkpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgeyAvLyBjb250ZW50OlN0cmluZ1xuICAgICAgICBjb25zdCB0eXBlID0gcGFyc2VQcm9wVHlwZShrZXksIG9wdHMsIG51bGwsIGZpbGUpO1xuICAgICAgICBwcm9wZXJ0aWVzW2tleV0gPSB7XG4gICAgICAgICAgdHlwZTogUFJPUF9UWVBFUy5pbmRleE9mKHR5cGUpICE9PSAtMSA/IHR5cGUgOiBudWxsLFxuICAgICAgICAgIG9ic2VydmVyOiBjcmVhdGVPYnNlcnZlcihrZXkpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHByb3BlcnRpZXNcbn1cblxuZnVuY3Rpb24gd3JhcHBlciQxIChldmVudCkge1xuICAvLyBUT0RPIOWPiOW+l+WFvOWuuSBtcHZ1ZSDnmoQgbXAg5a+56LGhXG4gIHRyeSB7XG4gICAgZXZlbnQubXAgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGV2ZW50KSk7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uID0gbm9vcDtcbiAgZXZlbnQucHJldmVudERlZmF1bHQgPSBub29wO1xuXG4gIGV2ZW50LnRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCB7fTtcblxuICBpZiAoIWhhc093bihldmVudCwgJ2RldGFpbCcpKSB7XG4gICAgZXZlbnQuZGV0YWlsID0ge307XG4gIH1cblxuICB7IC8vIG1wLWJhaWR177yMY2hlY2tlZD0+dmFsdWVcbiAgICBpZiAoXG4gICAgICBpc1BsYWluT2JqZWN0KGV2ZW50LmRldGFpbCkgJiZcbiAgICAgIGhhc093bihldmVudC5kZXRhaWwsICdjaGVja2VkJykgJiZcbiAgICAgICFoYXNPd24oZXZlbnQuZGV0YWlsLCAndmFsdWUnKVxuICAgICkge1xuICAgICAgZXZlbnQuZGV0YWlsLnZhbHVlID0gZXZlbnQuZGV0YWlsLmNoZWNrZWQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QoZXZlbnQuZGV0YWlsKSkge1xuICAgIGV2ZW50LnRhcmdldCA9IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LnRhcmdldCwgZXZlbnQuZGV0YWlsKTtcbiAgfVxuXG4gIHJldHVybiBldmVudFxufVxuXG5mdW5jdGlvbiBnZXRFeHRyYVZhbHVlICh2bSwgZGF0YVBhdGhzQXJyYXkpIHtcbiAgbGV0IGNvbnRleHQgPSB2bTtcbiAgZGF0YVBhdGhzQXJyYXkuZm9yRWFjaChkYXRhUGF0aEFycmF5ID0+IHtcbiAgICBjb25zdCBkYXRhUGF0aCA9IGRhdGFQYXRoQXJyYXlbMF07XG4gICAgY29uc3QgdmFsdWUgPSBkYXRhUGF0aEFycmF5WzJdO1xuICAgIGlmIChkYXRhUGF0aCB8fCB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7IC8vIFsnJywnJyxpbmRleCwnZGlzYWJsZSddXG4gICAgICBjb25zdCBwcm9wUGF0aCA9IGRhdGFQYXRoQXJyYXlbMV07XG4gICAgICBjb25zdCB2YWx1ZVBhdGggPSBkYXRhUGF0aEFycmF5WzNdO1xuXG4gICAgICBjb25zdCB2Rm9yID0gZGF0YVBhdGggPyB2bS5fX2dldF92YWx1ZShkYXRhUGF0aCwgY29udGV4dCkgOiBjb250ZXh0O1xuXG4gICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih2Rm9yKSkge1xuICAgICAgICBjb250ZXh0ID0gdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9wUGF0aCkge1xuICAgICAgICBjb250ZXh0ID0gdkZvclt2YWx1ZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2Rm9yKSkge1xuICAgICAgICAgIGNvbnRleHQgPSB2Rm9yLmZpbmQodkZvckl0ZW0gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHZtLl9fZ2V0X3ZhbHVlKHByb3BQYXRoLCB2Rm9ySXRlbSkgPT09IHZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2Rm9yKSkge1xuICAgICAgICAgIGNvbnRleHQgPSBPYmplY3Qua2V5cyh2Rm9yKS5maW5kKHZGb3JLZXkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHZtLl9fZ2V0X3ZhbHVlKHByb3BQYXRoLCB2Rm9yW3ZGb3JLZXldKSA9PT0gdmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCd2LWZvciDmmoLkuI3mlK/mjIHlvqrnjq/mlbDmja7vvJonLCB2Rm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWVQYXRoKSB7XG4gICAgICAgIGNvbnRleHQgPSB2bS5fX2dldF92YWx1ZSh2YWx1ZVBhdGgsIGNvbnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBjb250ZXh0XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NFdmVudEV4dHJhICh2bSwgZXh0cmEsIGV2ZW50KSB7XG4gIGNvbnN0IGV4dHJhT2JqID0ge307XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoZXh0cmEpICYmIGV4dHJhLmxlbmd0aCkge1xuICAgIC8qKlxuICAgICAqW1xuICAgICAqICAgIFsnZGF0YS5pdGVtcycsICdkYXRhLmlkJywgaXRlbS5kYXRhLmlkXSxcbiAgICAgKiAgICBbJ21ldGFzJywgJ2lkJywgbWV0YS5pZF1cbiAgICAgKl0sXG4gICAgICpbXG4gICAgICogICAgWydkYXRhLml0ZW1zJywgJ2RhdGEuaWQnLCBpdGVtLmRhdGEuaWRdLFxuICAgICAqICAgIFsnbWV0YXMnLCAnaWQnLCBtZXRhLmlkXVxuICAgICAqXSxcbiAgICAgKid0ZXN0J1xuICAgICAqL1xuICAgIGV4dHJhLmZvckVhY2goKGRhdGFQYXRoLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBkYXRhUGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKCFkYXRhUGF0aCkgeyAvLyBtb2RlbCxwcm9wLnN5bmNcbiAgICAgICAgICBleHRyYU9ialsnJCcgKyBpbmRleF0gPSB2bTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZGF0YVBhdGggPT09ICckZXZlbnQnKSB7IC8vICRldmVudFxuICAgICAgICAgICAgZXh0cmFPYmpbJyQnICsgaW5kZXhdID0gZXZlbnQ7XG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhUGF0aC5pbmRleE9mKCckZXZlbnQuJykgPT09IDApIHsgLy8gJGV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAgICAgICAgZXh0cmFPYmpbJyQnICsgaW5kZXhdID0gdm0uX19nZXRfdmFsdWUoZGF0YVBhdGgucmVwbGFjZSgnJGV2ZW50LicsICcnKSwgZXZlbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHRyYU9ialsnJCcgKyBpbmRleF0gPSB2bS5fX2dldF92YWx1ZShkYXRhUGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHRyYU9ialsnJCcgKyBpbmRleF0gPSBnZXRFeHRyYVZhbHVlKHZtLCBkYXRhUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZXh0cmFPYmpcbn1cblxuZnVuY3Rpb24gZ2V0T2JqQnlBcnJheSAoYXJyKSB7XG4gIGNvbnN0IG9iaiA9IHt9O1xuICBmb3IgKGxldCBpID0gMTsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBhcnJbaV07XG4gICAgb2JqW2VsZW1lbnRbMF1dID0gZWxlbWVudFsxXTtcbiAgfVxuICByZXR1cm4gb2JqXG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NFdmVudEFyZ3MgKHZtLCBldmVudCwgYXJncyA9IFtdLCBleHRyYSA9IFtdLCBpc0N1c3RvbSwgbWV0aG9kTmFtZSkge1xuICBsZXQgaXNDdXN0b21NUEV2ZW50ID0gZmFsc2U7IC8vIHd4Y29tcG9uZW50IOe7hOS7tu+8jOS8oOmAkuWOn+WniyBldmVudCDlr7nosaFcbiAgaWYgKGlzQ3VzdG9tKSB7IC8vIOiHquWumuS5ieS6i+S7tlxuICAgIGlzQ3VzdG9tTVBFdmVudCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQgJiZcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldCAmJlxuICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmNvbVR5cGUgPT09ICd3eCc7XG4gICAgaWYgKCFhcmdzLmxlbmd0aCkgeyAvLyDml6Dlj4LmlbDvvIznm7TmjqXkvKDlhaUgZXZlbnQg5oiWIGRldGFpbCDmlbDnu4RcbiAgICAgIGlmIChpc0N1c3RvbU1QRXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIFtldmVudF1cbiAgICAgIH1cbiAgICAgIHJldHVybiBldmVudC5kZXRhaWwuX19hcmdzX18gfHwgZXZlbnQuZGV0YWlsXG4gICAgfVxuICB9XG5cbiAgY29uc3QgZXh0cmFPYmogPSBwcm9jZXNzRXZlbnRFeHRyYSh2bSwgZXh0cmEsIGV2ZW50KTtcblxuICBjb25zdCByZXQgPSBbXTtcbiAgYXJncy5mb3JFYWNoKGFyZyA9PiB7XG4gICAgaWYgKGFyZyA9PT0gJyRldmVudCcpIHtcbiAgICAgIGlmIChtZXRob2ROYW1lID09PSAnX19zZXRfbW9kZWwnICYmICFpc0N1c3RvbSkgeyAvLyBpbnB1dCB2LW1vZGVsIHZhbHVlXG4gICAgICAgIHJldC5wdXNoKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNDdXN0b20gJiYgIWlzQ3VzdG9tTVBFdmVudCkge1xuICAgICAgICAgIHJldC5wdXNoKGV2ZW50LmRldGFpbC5fX2FyZ3NfX1swXSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIHd4Y29tcG9uZW50IOe7hOS7tuaIluWGhee9rue7hOS7tlxuICAgICAgICAgIHJldC5wdXNoKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpICYmIGFyZ1swXSA9PT0gJ28nKSB7XG4gICAgICAgIHJldC5wdXNoKGdldE9iakJ5QXJyYXkoYXJnKSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnICYmIGhhc093bihleHRyYU9iaiwgYXJnKSkge1xuICAgICAgICByZXQucHVzaChleHRyYU9ialthcmddKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldC5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcmV0XG59XG5cbmNvbnN0IE9OQ0UgPSAnfic7XG5jb25zdCBDVVNUT00gPSAnXic7XG5cbmZ1bmN0aW9uIGlzTWF0Y2hFdmVudFR5cGUgKGV2ZW50VHlwZSwgb3B0VHlwZSkge1xuICByZXR1cm4gKGV2ZW50VHlwZSA9PT0gb3B0VHlwZSkgfHxcbiAgICAoXG4gICAgICBvcHRUeXBlID09PSAncmVnaW9uY2hhbmdlJyAmJlxuICAgICAgKFxuICAgICAgICBldmVudFR5cGUgPT09ICdiZWdpbicgfHxcbiAgICAgICAgZXZlbnRUeXBlID09PSAnZW5kJ1xuICAgICAgKVxuICAgIClcbn1cblxuZnVuY3Rpb24gaGFuZGxlRXZlbnQgKGV2ZW50KSB7XG4gIGV2ZW50ID0gd3JhcHBlciQxKGV2ZW50KTtcblxuICAvLyBbWyd0YXAnLFtbJ2hhbmRsZScsWzEsMixhXV0sWydoYW5kbGUxJyxbMSwyLGFdXV1dXVxuICBjb25zdCBkYXRhc2V0ID0gKGV2ZW50LmN1cnJlbnRUYXJnZXQgfHwgZXZlbnQudGFyZ2V0KS5kYXRhc2V0O1xuICBpZiAoIWRhdGFzZXQpIHtcbiAgICByZXR1cm4gY29uc29sZS53YXJuKGDkuovku7bkv6Hmga/kuI3lrZjlnKhgKVxuICB9XG4gIGNvbnN0IGV2ZW50T3B0cyA9IGRhdGFzZXQuZXZlbnRPcHRzIHx8IGRhdGFzZXRbJ2V2ZW50LW9wdHMnXTsgLy8g5pSv5LuY5a6dIHdlYi12aWV3IOe7hOS7tiBkYXRhc2V0IOmdnumpvOWzsFxuICBpZiAoIWV2ZW50T3B0cykge1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oYOS6i+S7tuS/oeaBr+S4jeWtmOWcqGApXG4gIH1cblxuICAvLyBbWydoYW5kbGUnLFsxLDIsYV1dLFsnaGFuZGxlMScsWzEsMixhXV1dXG4gIGNvbnN0IGV2ZW50VHlwZSA9IGV2ZW50LnR5cGU7XG5cbiAgY29uc3QgcmV0ID0gW107XG5cbiAgZXZlbnRPcHRzLmZvckVhY2goZXZlbnRPcHQgPT4ge1xuICAgIGxldCB0eXBlID0gZXZlbnRPcHRbMF07XG4gICAgY29uc3QgZXZlbnRzQXJyYXkgPSBldmVudE9wdFsxXTtcblxuICAgIGNvbnN0IGlzQ3VzdG9tID0gdHlwZS5jaGFyQXQoMCkgPT09IENVU1RPTTtcbiAgICB0eXBlID0gaXNDdXN0b20gPyB0eXBlLnNsaWNlKDEpIDogdHlwZTtcbiAgICBjb25zdCBpc09uY2UgPSB0eXBlLmNoYXJBdCgwKSA9PT0gT05DRTtcbiAgICB0eXBlID0gaXNPbmNlID8gdHlwZS5zbGljZSgxKSA6IHR5cGU7XG5cbiAgICBpZiAoZXZlbnRzQXJyYXkgJiYgaXNNYXRjaEV2ZW50VHlwZShldmVudFR5cGUsIHR5cGUpKSB7XG4gICAgICBldmVudHNBcnJheS5mb3JFYWNoKGV2ZW50QXJyYXkgPT4ge1xuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gZXZlbnRBcnJheVswXTtcbiAgICAgICAgaWYgKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgICBsZXQgaGFuZGxlckN0eCA9IHRoaXMuJHZtO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGhhbmRsZXJDdHguJG9wdGlvbnMuZ2VuZXJpYyAmJlxuICAgICAgICAgICAgaGFuZGxlckN0eC4kcGFyZW50ICYmXG4gICAgICAgICAgICBoYW5kbGVyQ3R4LiRwYXJlbnQuJHBhcmVudFxuICAgICAgICAgICkgeyAvLyBtcC13ZWl4aW4sbXAtdG91dGlhbyDmir3osaHoioLngrnmqKHmi58gc2NvcGVkIHNsb3RzXG4gICAgICAgICAgICBoYW5kbGVyQ3R4ID0gaGFuZGxlckN0eC4kcGFyZW50LiRwYXJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtZXRob2ROYW1lID09PSAnJGVtaXQnKSB7XG4gICAgICAgICAgICBoYW5kbGVyQ3R4LiRlbWl0LmFwcGx5KGhhbmRsZXJDdHgsXG4gICAgICAgICAgICAgIHByb2Nlc3NFdmVudEFyZ3MoXG4gICAgICAgICAgICAgICAgdGhpcy4kdm0sXG4gICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgZXZlbnRBcnJheVsxXSxcbiAgICAgICAgICAgICAgICBldmVudEFycmF5WzJdLFxuICAgICAgICAgICAgICAgIGlzQ3VzdG9tLFxuICAgICAgICAgICAgICAgIG1ldGhvZE5hbWVcbiAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaGFuZGxlciA9IGhhbmRsZXJDdHhbbWV0aG9kTmFtZV07XG4gICAgICAgICAgaWYgKCFpc0ZuKGhhbmRsZXIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCBfdm0uJHttZXRob2ROYW1lfSBpcyBub3QgYSBmdW5jdGlvbmApXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc09uY2UpIHtcbiAgICAgICAgICAgIGlmIChoYW5kbGVyLm9uY2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYW5kbGVyLm9uY2UgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXQucHVzaChoYW5kbGVyLmFwcGx5KGhhbmRsZXJDdHgsIHByb2Nlc3NFdmVudEFyZ3MoXG4gICAgICAgICAgICB0aGlzLiR2bSxcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgZXZlbnRBcnJheVsxXSxcbiAgICAgICAgICAgIGV2ZW50QXJyYXlbMl0sXG4gICAgICAgICAgICBpc0N1c3RvbSxcbiAgICAgICAgICAgIG1ldGhvZE5hbWVcbiAgICAgICAgICApKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKFxuICAgIGV2ZW50VHlwZSA9PT0gJ2lucHV0JyAmJlxuICAgIHJldC5sZW5ndGggPT09IDEgJiZcbiAgICB0eXBlb2YgcmV0WzBdICE9PSAndW5kZWZpbmVkJ1xuICApIHtcbiAgICByZXR1cm4gcmV0WzBdXG4gIH1cbn1cblxuY29uc3QgaG9va3MgPSBbXG4gICdvblNob3cnLFxuICAnb25IaWRlJyxcbiAgJ29uRXJyb3InLFxuICAnb25QYWdlTm90Rm91bmQnXG5dO1xuXG5mdW5jdGlvbiBwYXJzZUJhc2VBcHAgKHZtLCB7XG4gIG1vY2tzLFxuICBpbml0UmVmc1xufSkge1xuICBpZiAodm0uJG9wdGlvbnMuc3RvcmUpIHtcbiAgICBWdWUucHJvdG90eXBlLiRzdG9yZSA9IHZtLiRvcHRpb25zLnN0b3JlO1xuICB9XG5cbiAgVnVlLnByb3RvdHlwZS5tcEhvc3QgPSBcIm1wLWJhaWR1XCI7XG5cbiAgVnVlLm1peGluKHtcbiAgICBiZWZvcmVDcmVhdGUgKCkge1xuICAgICAgaWYgKCF0aGlzLiRvcHRpb25zLm1wVHlwZSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5tcFR5cGUgPSB0aGlzLiRvcHRpb25zLm1wVHlwZTtcblxuICAgICAgdGhpcy4kbXAgPSB7XG4gICAgICAgIGRhdGE6IHt9LFxuICAgICAgICBbdGhpcy5tcFR5cGVdOiB0aGlzLiRvcHRpb25zLm1wSW5zdGFuY2VcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuJHNjb3BlID0gdGhpcy4kb3B0aW9ucy5tcEluc3RhbmNlO1xuXG4gICAgICBkZWxldGUgdGhpcy4kb3B0aW9ucy5tcFR5cGU7XG4gICAgICBkZWxldGUgdGhpcy4kb3B0aW9ucy5tcEluc3RhbmNlO1xuXG4gICAgICBpZiAodGhpcy5tcFR5cGUgIT09ICdhcHAnKSB7XG4gICAgICAgIGluaXRSZWZzKHRoaXMpO1xuICAgICAgICBpbml0TW9ja3ModGhpcywgbW9ja3MpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgYXBwT3B0aW9ucyA9IHtcbiAgICBvbkxhdW5jaCAoYXJncykge1xuICAgICAgaWYgKHRoaXMuJHZtKSB7IC8vIOW3sue7j+WIneWni+WMlui/h+S6hu+8jOS4u+imgeaYr+S4uuS6hueZvuW6pu+8jOeZvuW6piBvblNob3cg5ZyoIG9uTGF1bmNoIOS5i+WJjVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy4kdm0gPSB2bTtcblxuICAgICAgdGhpcy4kdm0uJG1wID0ge1xuICAgICAgICBhcHA6IHRoaXNcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuJHZtLiRzY29wZSA9IHRoaXM7XG4gICAgICAvLyB2bSDkuIrkuZ/mjILovb0gZ2xvYmFsRGF0YVxuICAgICAgdGhpcy4kdm0uZ2xvYmFsRGF0YSA9IHRoaXMuZ2xvYmFsRGF0YTtcblxuICAgICAgdGhpcy4kdm0uX2lzTW91bnRlZCA9IHRydWU7XG4gICAgICB0aGlzLiR2bS5fX2NhbGxfaG9vaygnbW91bnRlZCcsIGFyZ3MpO1xuXG4gICAgICB0aGlzLiR2bS5fX2NhbGxfaG9vaygnb25MYXVuY2gnLCBhcmdzKTtcbiAgICB9XG4gIH07XG5cbiAgLy8g5YW85a655pen54mI5pysIGdsb2JhbERhdGFcbiAgYXBwT3B0aW9ucy5nbG9iYWxEYXRhID0gdm0uJG9wdGlvbnMuZ2xvYmFsRGF0YSB8fCB7fTtcbiAgLy8g5bCGIG1ldGhvZHMg5Lit55qE5pa55rOV5oyC5ZyoIGdldEFwcCgpIOS4rVxuICBjb25zdCBtZXRob2RzID0gdm0uJG9wdGlvbnMubWV0aG9kcztcbiAgaWYgKG1ldGhvZHMpIHtcbiAgICBPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgYXBwT3B0aW9uc1tuYW1lXSA9IG1ldGhvZHNbbmFtZV07XG4gICAgfSk7XG4gIH1cblxuICBpbml0SG9va3MoYXBwT3B0aW9ucywgaG9va3MpO1xuXG4gIHJldHVybiBhcHBPcHRpb25zXG59XG5cbmZ1bmN0aW9uIGZpbmRWbUJ5VnVlSWQgKHZtLCB2dWVQaWQpIHtcbiAgY29uc3QgJGNoaWxkcmVuID0gdm0uJGNoaWxkcmVuO1xuICAvLyDkvJjlhYjmn6Xmib7nm7TlsZ5cbiAgbGV0IHBhcmVudFZtID0gJGNoaWxkcmVuLmZpbmQoY2hpbGRWbSA9PiBjaGlsZFZtLiRzY29wZS5fJHZ1ZUlkID09PSB2dWVQaWQpO1xuICBpZiAocGFyZW50Vm0pIHtcbiAgICByZXR1cm4gcGFyZW50Vm1cbiAgfVxuICAvLyDlj43lkJHpgJLlvZLmn6Xmib5cbiAgZm9yIChsZXQgaSA9ICRjaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHBhcmVudFZtID0gZmluZFZtQnlWdWVJZCgkY2hpbGRyZW5baV0sIHZ1ZVBpZCk7XG4gICAgaWYgKHBhcmVudFZtKSB7XG4gICAgICByZXR1cm4gcGFyZW50Vm1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdEJlaGF2aW9yIChvcHRpb25zKSB7XG4gIHJldHVybiBCZWhhdmlvcihvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBpbml0UmVmcyAodm0pIHtcbiAgY29uc3QgbXBJbnN0YW5jZSA9IHZtLiRzY29wZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZtLCAnJHJlZnMnLCB7XG4gICAgZ2V0ICgpIHtcbiAgICAgIGNvbnN0ICRyZWZzID0ge307XG4gICAgICBjb25zdCBjb21wb25lbnRzID0gbXBJbnN0YW5jZS5zZWxlY3RBbGxDb21wb25lbnRzKCcudnVlLXJlZicpO1xuICAgICAgY29tcG9uZW50cy5mb3JFYWNoKGNvbXBvbmVudCA9PiB7XG4gICAgICAgIGNvbnN0IHJlZiA9IGNvbXBvbmVudC5kYXRhc2V0LnJlZjtcbiAgICAgICAgJHJlZnNbcmVmXSA9IGNvbXBvbmVudC4kdm0gfHwgY29tcG9uZW50O1xuICAgICAgfSk7XG4gICAgICBjb25zdCBmb3JDb21wb25lbnRzID0gbXBJbnN0YW5jZS5zZWxlY3RBbGxDb21wb25lbnRzKCcudnVlLXJlZi1pbi1mb3InKTtcbiAgICAgIGZvckNvbXBvbmVudHMuZm9yRWFjaChjb21wb25lbnQgPT4ge1xuICAgICAgICBjb25zdCByZWYgPSBjb21wb25lbnQuZGF0YXNldC5yZWY7XG4gICAgICAgIGlmICghJHJlZnNbcmVmXSkge1xuICAgICAgICAgICRyZWZzW3JlZl0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAkcmVmc1tyZWZdLnB1c2goY29tcG9uZW50LiR2bSB8fCBjb21wb25lbnQpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gJHJlZnNcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVMaW5rIChldmVudCkge1xuICBjb25zdCB7XG4gICAgdnVlUGlkLFxuICAgIHZ1ZU9wdGlvbnNcbiAgfSA9IGV2ZW50LmRldGFpbCB8fCBldmVudC52YWx1ZTsgLy8gZGV0YWlsIOaYr+W+ruS/oSx2YWx1ZSDmmK/nmb7luqYoZGlwYXRjaClcblxuICBsZXQgcGFyZW50Vm07XG5cbiAgaWYgKHZ1ZVBpZCkge1xuICAgIHBhcmVudFZtID0gZmluZFZtQnlWdWVJZCh0aGlzLiR2bSwgdnVlUGlkKTtcbiAgfVxuXG4gIGlmICghcGFyZW50Vm0pIHtcbiAgICBwYXJlbnRWbSA9IHRoaXMuJHZtO1xuICB9XG5cbiAgdnVlT3B0aW9ucy5wYXJlbnQgPSBwYXJlbnRWbTtcbn1cblxuY29uc3QgbW9ja3MgPSBbJ25vZGVJZCcsICdjb21wb25lbnROYW1lJ107XG5cbmZ1bmN0aW9uIGlzUGFnZSAoKSB7XG4gIHJldHVybiAhdGhpcy5vd25lcklkXG59XG5cbmZ1bmN0aW9uIGluaXRSZWxhdGlvbiAoZGV0YWlsKSB7XG4gIHRoaXMuZGlzcGF0Y2goJ19fbCcsIGRldGFpbCk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQXBwICh2bSkge1xuICAvLyDnmb7luqYgb25TaG93IOern+eEtuS8muWcqCBvbkxhdW5jaCDkuYvliY1cbiAgY29uc3QgYXBwT3B0aW9ucyA9IHBhcnNlQmFzZUFwcCh2bSwge1xuICAgIG1vY2tzLFxuICAgIGluaXRSZWZzXG4gIH0pO1xuICBhcHBPcHRpb25zLm9uU2hvdyA9IGZ1bmN0aW9uIG9uU2hvdyAoYXJncykge1xuICAgIGlmICghdGhpcy4kdm0pIHtcbiAgICAgIHRoaXMub25MYXVuY2goYXJncyk7XG4gICAgfVxuICAgIHRoaXMuJHZtLl9fY2FsbF9ob29rKCdvblNob3cnLCBhcmdzKTtcbiAgfTtcbiAgcmV0dXJuIGFwcE9wdGlvbnNcbn1cblxuZnVuY3Rpb24gY3JlYXRlQXBwICh2bSkge1xuICBBcHAocGFyc2VBcHAodm0pKTtcbiAgcmV0dXJuIHZtXG59XG5cbmZ1bmN0aW9uIHBhcnNlQmFzZUNvbXBvbmVudCAodnVlQ29tcG9uZW50T3B0aW9ucywge1xuICBpc1BhZ2UsXG4gIGluaXRSZWxhdGlvblxufSA9IHt9KSB7XG4gIGxldCBbVnVlQ29tcG9uZW50LCB2dWVPcHRpb25zXSA9IGluaXRWdWVDb21wb25lbnQoVnVlLCB2dWVDb21wb25lbnRPcHRpb25zKTtcblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIG11bHRpcGxlU2xvdHM6IHRydWUsXG4gICAgYWRkR2xvYmFsQ2xhc3M6IHRydWVcbiAgfTtcblxuICBjb25zdCBjb21wb25lbnRPcHRpb25zID0ge1xuICAgIG9wdGlvbnMsXG4gICAgZGF0YTogaW5pdERhdGEodnVlT3B0aW9ucywgVnVlLnByb3RvdHlwZSksXG4gICAgYmVoYXZpb3JzOiBpbml0QmVoYXZpb3JzKHZ1ZU9wdGlvbnMsIGluaXRCZWhhdmlvciksXG4gICAgcHJvcGVydGllczogaW5pdFByb3BlcnRpZXModnVlT3B0aW9ucy5wcm9wcywgZmFsc2UsIHZ1ZU9wdGlvbnMuX19maWxlKSxcbiAgICBsaWZldGltZXM6IHtcbiAgICAgIGF0dGFjaGVkICgpIHtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMucHJvcGVydGllcztcblxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgIG1wVHlwZTogaXNQYWdlLmNhbGwodGhpcykgPyAncGFnZScgOiAnY29tcG9uZW50JyxcbiAgICAgICAgICBtcEluc3RhbmNlOiB0aGlzLFxuICAgICAgICAgIHByb3BzRGF0YTogcHJvcGVydGllc1xuICAgICAgICB9O1xuXG4gICAgICAgIGluaXRWdWVJZHMocHJvcGVydGllcy52dWVJZCwgdGhpcyk7XG5cbiAgICAgICAgLy8g5aSE55CG54i25a2Q5YWz57O7XG4gICAgICAgIGluaXRSZWxhdGlvbi5jYWxsKHRoaXMsIHtcbiAgICAgICAgICB2dWVQaWQ6IHRoaXMuXyR2dWVQaWQsXG4gICAgICAgICAgdnVlT3B0aW9uczogb3B0aW9uc1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDliJ3lp4vljJYgdnVlIOWunuS+i1xuICAgICAgICB0aGlzLiR2bSA9IG5ldyBWdWVDb21wb25lbnQob3B0aW9ucyk7XG5cbiAgICAgICAgLy8g5aSE55CGJHNsb3RzLCRzY29wZWRTbG90c++8iOaaguS4jeaUr+aMgeWKqOaAgeWPmOWMliRzbG90c++8iVxuICAgICAgICBpbml0U2xvdHModGhpcy4kdm0sIHByb3BlcnRpZXMudnVlU2xvdHMpO1xuXG4gICAgICAgIC8vIOinpuWPkemmluasoSBzZXREYXRhXG4gICAgICAgIHRoaXMuJHZtLiRtb3VudCgpO1xuICAgICAgfSxcbiAgICAgIHJlYWR5ICgpIHtcbiAgICAgICAgLy8g5b2T57uE5Lu2IHByb3BzIOm7mOiupOWAvOS4uiB0cnVl77yM5Yid5aeL5YyW5pe25Lyg5YWlIGZhbHNlIOS8muWvvOiHtCBjcmVhdGVkLHJlYWR5IOinpuWPkSwg5L2GIGF0dGFjaGVkIOS4jeinpuWPkVxuICAgICAgICAvLyBodHRwczovL2RldmVsb3BlcnMud2VpeGluLnFxLmNvbS9jb21tdW5pdHkvZGV2ZWxvcC9kb2MvMDAwNjZhZTI4NDRjYzBmOGViODgzZTJhNTU3ODAwXG4gICAgICAgIGlmICh0aGlzLiR2bSkge1xuICAgICAgICAgIHRoaXMuJHZtLl9pc01vdW50ZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuJHZtLl9fY2FsbF9ob29rKCdtb3VudGVkJyk7XG4gICAgICAgICAgdGhpcy4kdm0uX19jYWxsX2hvb2soJ29uUmVhZHknKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRldGFjaGVkICgpIHtcbiAgICAgICAgdGhpcy4kdm0uJGRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhZ2VMaWZldGltZXM6IHtcbiAgICAgIHNob3cgKGFyZ3MpIHtcbiAgICAgICAgdGhpcy4kdm0gJiYgdGhpcy4kdm0uX19jYWxsX2hvb2soJ29uUGFnZVNob3cnLCBhcmdzKTtcbiAgICAgIH0sXG4gICAgICBoaWRlICgpIHtcbiAgICAgICAgdGhpcy4kdm0gJiYgdGhpcy4kdm0uX19jYWxsX2hvb2soJ29uUGFnZUhpZGUnKTtcbiAgICAgIH0sXG4gICAgICByZXNpemUgKHNpemUpIHtcbiAgICAgICAgdGhpcy4kdm0gJiYgdGhpcy4kdm0uX19jYWxsX2hvb2soJ29uUGFnZVJlc2l6ZScsIHNpemUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgX19sOiBoYW5kbGVMaW5rLFxuICAgICAgX19lOiBoYW5kbGVFdmVudFxuICAgIH1cbiAgfTtcblxuICBpZiAoQXJyYXkuaXNBcnJheSh2dWVPcHRpb25zLnd4c0NhbGxNZXRob2RzKSkge1xuICAgIHZ1ZU9wdGlvbnMud3hzQ2FsbE1ldGhvZHMuZm9yRWFjaChjYWxsTWV0aG9kID0+IHtcbiAgICAgIGNvbXBvbmVudE9wdGlvbnMubWV0aG9kc1tjYWxsTWV0aG9kXSA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiR2bVtjYWxsTWV0aG9kXShhcmdzKVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChpc1BhZ2UpIHtcbiAgICByZXR1cm4gY29tcG9uZW50T3B0aW9uc1xuICB9XG4gIHJldHVybiBbY29tcG9uZW50T3B0aW9ucywgVnVlQ29tcG9uZW50XVxufVxuXG5jb25zdCBuZXdMaWZlY3ljbGUgPSBzd2FuLmNhbklVc2UoJ2xpZmVjeWNsZS0yLTAnKTtcblxuZnVuY3Rpb24gcGFyc2VDb21wb25lbnQgKHZ1ZU9wdGlvbnMpIHtcbiAgY29uc3QgY29tcG9uZW50T3B0aW9ucyA9IHBhcnNlQmFzZUNvbXBvbmVudCh2dWVPcHRpb25zLCB7XG4gICAgaXNQYWdlLFxuICAgIGluaXRSZWxhdGlvblxuICB9KTtcblxuICAvLyDlhbPkuo7nmb7luqblsI/nqIvluo/nlJ/lkb3lkajmnJ/nmoTor7TmmI4o57uE5Lu25L2c5Li66aG16Z2i5pe2KTpcbiAgLy8gbGlmZXRpbWVzOmF0dGFjaGVkIC0tPiBtZXRob2RzOm9uU2hvdyAtLT4gbWV0aG9kczpvbkxvYWQgLS0+IG1ldGhvZHM6b25SZWFkeVxuICAvLyDov5nph4zlnKjlvLrliLblsIZvblNob3fmjKrliLBvbkxvYWTkuYvlkI7op6blj5Es5Y+m5aSW5LiA5aSE5L+u5pS55ZyocGFnZS1wYXJzZXIuanNcbiAgY29uc3Qgb2xkQXR0YWNoZWQgPSBjb21wb25lbnRPcHRpb25zLmxpZmV0aW1lcy5hdHRhY2hlZDtcbiAgY29tcG9uZW50T3B0aW9ucy5saWZldGltZXMuYXR0YWNoZWQgPSBmdW5jdGlvbiBhdHRhY2hlZCAoKSB7XG4gICAgb2xkQXR0YWNoZWQuY2FsbCh0aGlzKTtcbiAgICBpZiAoaXNQYWdlLmNhbGwodGhpcykpIHsgLy8g55m+5bqmIG9uTG9hZCDlnKggYXR0YWNoZWQg5LmL5YmN6Kem5Y+RXG4gICAgICAvLyDnmb7luqYg5b2T57uE5Lu25L2c5Li66aG16Z2i5pe2IHBhZ2VpbnN0YW5jY2Ug5LiN5piv5Y6f5p2l57uE5Lu255qEIGluc3RhbmNlXG4gICAgICB0aGlzLnBhZ2VpbnN0YW5jZS4kdm0gPSB0aGlzLiR2bTtcbiAgICAgIGlmIChoYXNPd24odGhpcy5wYWdlaW5zdGFuY2UsICdfJGFyZ3MnKSkge1xuICAgICAgICB0aGlzLiR2bS4kbXAucXVlcnkgPSB0aGlzLnBhZ2VpbnN0YW5jZS5fJGFyZ3M7XG4gICAgICAgIHRoaXMuJHZtLl9fY2FsbF9ob29rKCdvbkxvYWQnLCB0aGlzLnBhZ2VpbnN0YW5jZS5fJGFyZ3MpO1xuICAgICAgICB0aGlzLiR2bS5fX2NhbGxfaG9vaygnb25TaG93Jyk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnBhZ2VpbnN0YW5jZS5fJGFyZ3M7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOeZvuW6puWwj+eoi+W6j+e7hOS7tuS4jeinpuWPkW1ldGhvZHPlhoXnmoRvblJlYWR5XG4gICAgICBpZiAodGhpcy4kdm0pIHtcbiAgICAgICAgdGhpcy4kdm0uX2lzTW91bnRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJHZtLl9fY2FsbF9ob29rKCdtb3VudGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGlmIChuZXdMaWZlY3ljbGUpIHtcbiAgICBkZWxldGUgY29tcG9uZW50T3B0aW9ucy5saWZldGltZXMucmVhZHk7XG4gICAgY29tcG9uZW50T3B0aW9ucy5tZXRob2RzLm9uUmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy4kdm0pIHtcbiAgICAgICAgdGhpcy4kdm0uX2lzTW91bnRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJHZtLl9fY2FsbF9ob29rKCdtb3VudGVkJyk7XG4gICAgICAgIHRoaXMuJHZtLl9fY2FsbF9ob29rKCdvblJlYWR5Jyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudE9wdGlvbnMubWVzc2FnZXMgPSB7XG4gICAgJ19fbCc6IGNvbXBvbmVudE9wdGlvbnMubWV0aG9kc1snX19sJ11cbiAgfTtcbiAgZGVsZXRlIGNvbXBvbmVudE9wdGlvbnMubWV0aG9kc1snX19sJ107XG5cbiAgcmV0dXJuIGNvbXBvbmVudE9wdGlvbnNcbn1cblxuY29uc3QgaG9va3MkMSA9IFtcbiAgJ29uU2hvdycsXG4gICdvbkhpZGUnLFxuICAnb25VbmxvYWQnXG5dO1xuXG5ob29rcyQxLnB1c2goLi4uUEFHRV9FVkVOVF9IT09LUyk7XG5cbmZ1bmN0aW9uIHBhcnNlQmFzZVBhZ2UgKHZ1ZVBhZ2VPcHRpb25zLCB7XG4gIGlzUGFnZSxcbiAgaW5pdFJlbGF0aW9uXG59KSB7XG4gIGNvbnN0IHBhZ2VPcHRpb25zID0gcGFyc2VDb21wb25lbnQodnVlUGFnZU9wdGlvbnMpO1xuXG4gIGluaXRIb29rcyhwYWdlT3B0aW9ucy5tZXRob2RzLCBob29rcyQxLCB2dWVQYWdlT3B0aW9ucyk7XG5cbiAgcGFnZU9wdGlvbnMubWV0aG9kcy5vbkxvYWQgPSBmdW5jdGlvbiAoYXJncykge1xuICAgIHRoaXMuJHZtLiRtcC5xdWVyeSA9IGFyZ3M7IC8vIOWFvOWuuSBtcHZ1ZVxuICAgIHRoaXMuJHZtLl9fY2FsbF9ob29rKCdvbkxvYWQnLCBhcmdzKTtcbiAgfTtcblxuICByZXR1cm4gcGFnZU9wdGlvbnNcbn1cblxuZnVuY3Rpb24gZGV0YWNoZWQgKCR2bSkge1xuICAkdm0uJGNoaWxkcmVuLmZvckVhY2goY2hpbGRWbSA9PiB7XG4gICAgY2hpbGRWbS4kc2NvcGUuZGV0YWNoZWQoKTtcbiAgfSk7XG4gICR2bS4kc2NvcGUuZGV0YWNoZWQoKTtcbn1cblxuZnVuY3Rpb24gb25QYWdlVW5sb2FkICgkdm0pIHtcbiAgJHZtLiRkZXN0cm95KCk7XG4gICR2bS4kY2hpbGRyZW4uZm9yRWFjaChjaGlsZFZtID0+IHtcbiAgICBkZXRhY2hlZChjaGlsZFZtKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlUGFnZSAodnVlUGFnZU9wdGlvbnMpIHtcbiAgY29uc3QgcGFnZU9wdGlvbnMgPSBwYXJzZUJhc2VQYWdlKHZ1ZVBhZ2VPcHRpb25zLCB7XG4gICAgaXNQYWdlLFxuICAgIGluaXRSZWxhdGlvblxuICB9KTtcblxuICAvLyDnuqDmraPnmb7luqblsI/nqIvluo/nlJ/lkb3lkajmnJ9tZXRob2RzOm9uU2hvd+WcqG1ldGhvZHM6b25Mb2Fk5LmL5YmN6Kem5Y+R55qE6Zeu6aKYXG4gIHBhZ2VPcHRpb25zLm1ldGhvZHMub25TaG93ID0gZnVuY3Rpb24gb25TaG93ICgpIHtcbiAgICBpZiAodGhpcy4kdm0gJiYgdGhpcy4kdm0uJG1wLnF1ZXJ5KSB7XG4gICAgICB0aGlzLiR2bS5fX2NhbGxfaG9vaygnb25TaG93Jyk7XG4gICAgfVxuICB9O1xuXG4gIHBhZ2VPcHRpb25zLm1ldGhvZHMub25Mb2FkID0gZnVuY3Rpb24gb25Mb2FkIChhcmdzKSB7XG4gICAgLy8g55m+5bqmIG9uTG9hZCDlnKggYXR0YWNoZWQg5LmL5YmN6Kem5Y+R77yM5YWI5a2Y5YKoIGFyZ3MsIOWcqCBhdHRhY2hlZCDph4zovrnop6blj5Egb25Mb2FkXG4gICAgaWYgKHRoaXMuJHZtKSB7XG4gICAgICB0aGlzLiR2bS4kbXAucXVlcnkgPSBhcmdzO1xuICAgICAgdGhpcy4kdm0uX19jYWxsX2hvb2soJ29uTG9hZCcsIGFyZ3MpO1xuICAgICAgdGhpcy4kdm0uX19jYWxsX2hvb2soJ29uU2hvdycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhZ2VpbnN0YW5jZS5fJGFyZ3MgPSBhcmdzO1xuICAgIH1cbiAgfTtcblxuICBwYWdlT3B0aW9ucy5tZXRob2RzLm9uVW5sb2FkID0gZnVuY3Rpb24gb25VbmxvYWQgKCkge1xuICAgIHRoaXMuJHZtLl9fY2FsbF9ob29rKCdvblVubG9hZCcpO1xuICAgIG9uUGFnZVVubG9hZCh0aGlzLiR2bSk7XG4gIH07XG5cbiAgcmV0dXJuIHBhZ2VPcHRpb25zXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhZ2UgKHZ1ZVBhZ2VPcHRpb25zKSB7XG4gIHtcbiAgICByZXR1cm4gQ29tcG9uZW50KHBhcnNlUGFnZSh2dWVQYWdlT3B0aW9ucykpXG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50ICh2dWVPcHRpb25zKSB7XG4gIHtcbiAgICByZXR1cm4gQ29tcG9uZW50KHBhcnNlQ29tcG9uZW50KHZ1ZU9wdGlvbnMpKVxuICB9XG59XG5cbnRvZG9zLmZvckVhY2godG9kb0FwaSA9PiB7XG4gIHByb3RvY29sc1t0b2RvQXBpXSA9IGZhbHNlO1xufSk7XG5cbmNhbklVc2VzLmZvckVhY2goY2FuSVVzZUFwaSA9PiB7XG4gIGNvbnN0IGFwaU5hbWUgPSBwcm90b2NvbHNbY2FuSVVzZUFwaV0gJiYgcHJvdG9jb2xzW2NhbklVc2VBcGldLm5hbWUgPyBwcm90b2NvbHNbY2FuSVVzZUFwaV0ubmFtZVxuICAgIDogY2FuSVVzZUFwaTtcbiAgaWYgKCFzd2FuLmNhbklVc2UoYXBpTmFtZSkpIHtcbiAgICBwcm90b2NvbHNbY2FuSVVzZUFwaV0gPSBmYWxzZTtcbiAgfVxufSk7XG5cbmxldCB1bmkgPSB7fTtcblxuaWYgKHR5cGVvZiBQcm94eSAhPT0gJ3VuZGVmaW5lZCcgJiYgXCJtcC1iYWlkdVwiICE9PSAnYXBwLXBsdXMnKSB7XG4gIHVuaSA9IG5ldyBQcm94eSh7fSwge1xuICAgIGdldCAodGFyZ2V0LCBuYW1lKSB7XG4gICAgICBpZiAodGFyZ2V0W25hbWVdKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRbbmFtZV1cbiAgICAgIH1cbiAgICAgIGlmIChiYXNlQXBpW25hbWVdKSB7XG4gICAgICAgIHJldHVybiBiYXNlQXBpW25hbWVdXG4gICAgICB9XG4gICAgICBpZiAoYXBpW25hbWVdKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnkobmFtZSwgYXBpW25hbWVdKVxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZiAoZXh0cmFBcGlbbmFtZV0pIHtcbiAgICAgICAgICByZXR1cm4gcHJvbWlzaWZ5KG5hbWUsIGV4dHJhQXBpW25hbWVdKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0b2RvQXBpc1tuYW1lXSkge1xuICAgICAgICAgIHJldHVybiBwcm9taXNpZnkobmFtZSwgdG9kb0FwaXNbbmFtZV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChldmVudEFwaVtuYW1lXSkge1xuICAgICAgICByZXR1cm4gZXZlbnRBcGlbbmFtZV1cbiAgICAgIH1cbiAgICAgIGlmICghaGFzT3duKHN3YW4sIG5hbWUpICYmICFoYXNPd24ocHJvdG9jb2xzLCBuYW1lKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9taXNpZnkobmFtZSwgd3JhcHBlcihuYW1lLCBzd2FuW25hbWVdKSlcbiAgICB9LFxuICAgIHNldCAodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuICAgICAgdGFyZ2V0W25hbWVdID0gdmFsdWU7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfSk7XG59IGVsc2Uge1xuICBPYmplY3Qua2V5cyhiYXNlQXBpKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIHVuaVtuYW1lXSA9IGJhc2VBcGlbbmFtZV07XG4gIH0pO1xuXG4gIHtcbiAgICBPYmplY3Qua2V5cyh0b2RvQXBpcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIHVuaVtuYW1lXSA9IHByb21pc2lmeShuYW1lLCB0b2RvQXBpc1tuYW1lXSk7XG4gICAgfSk7XG4gICAgT2JqZWN0LmtleXMoZXh0cmFBcGkpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICB1bmlbbmFtZV0gPSBwcm9taXNpZnkobmFtZSwgdG9kb0FwaXNbbmFtZV0pO1xuICAgIH0pO1xuICB9XG5cbiAgT2JqZWN0LmtleXMoZXZlbnRBcGkpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgdW5pW25hbWVdID0gZXZlbnRBcGlbbmFtZV07XG4gIH0pO1xuXG4gIE9iamVjdC5rZXlzKGFwaSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICB1bmlbbmFtZV0gPSBwcm9taXNpZnkobmFtZSwgYXBpW25hbWVdKTtcbiAgfSk7XG5cbiAgT2JqZWN0LmtleXMoc3dhbikuZm9yRWFjaChuYW1lID0+IHtcbiAgICBpZiAoaGFzT3duKHN3YW4sIG5hbWUpIHx8IGhhc093bihwcm90b2NvbHMsIG5hbWUpKSB7XG4gICAgICB1bmlbbmFtZV0gPSBwcm9taXNpZnkobmFtZSwgd3JhcHBlcihuYW1lLCBzd2FuW25hbWVdKSk7XG4gICAgfVxuICB9KTtcbn1cblxuc3dhbi5jcmVhdGVBcHAgPSBjcmVhdGVBcHA7XG5zd2FuLmNyZWF0ZVBhZ2UgPSBjcmVhdGVQYWdlO1xuc3dhbi5jcmVhdGVDb21wb25lbnQgPSBjcmVhdGVDb21wb25lbnQ7XG5cbnZhciB1bmkkMSA9IHVuaTtcblxuZXhwb3J0IGRlZmF1bHQgdW5pJDE7XG5leHBvcnQgeyBjcmVhdGVBcHAsIGNyZWF0ZUNvbXBvbmVudCwgY3JlYXRlUGFnZSB9O1xuIiwiLyohXG4gKiBWdWUuanMgdjIuNi4xMFxuICogKGMpIDIwMTQtMjAxOSBFdmFuIFlvdVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG4vKiAgKi9cblxudmFyIGVtcHR5T2JqZWN0ID0gT2JqZWN0LmZyZWV6ZSh7fSk7XG5cbi8vIFRoZXNlIGhlbHBlcnMgcHJvZHVjZSBiZXR0ZXIgVk0gY29kZSBpbiBKUyBlbmdpbmVzIGR1ZSB0byB0aGVpclxuLy8gZXhwbGljaXRuZXNzIGFuZCBmdW5jdGlvbiBpbmxpbmluZy5cbmZ1bmN0aW9uIGlzVW5kZWYgKHYpIHtcbiAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSBudWxsXG59XG5cbmZ1bmN0aW9uIGlzRGVmICh2KSB7XG4gIHJldHVybiB2ICE9PSB1bmRlZmluZWQgJiYgdiAhPT0gbnVsbFxufVxuXG5mdW5jdGlvbiBpc1RydWUgKHYpIHtcbiAgcmV0dXJuIHYgPT09IHRydWVcbn1cblxuZnVuY3Rpb24gaXNGYWxzZSAodikge1xuICByZXR1cm4gdiA9PT0gZmFsc2Vcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB2YWx1ZSBpcyBwcmltaXRpdmUuXG4gKi9cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlICh2YWx1ZSkge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHxcbiAgICB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8XG4gICAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXG4gICAgdHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJyB8fFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nXG4gIClcbn1cblxuLyoqXG4gKiBRdWljayBvYmplY3QgY2hlY2sgLSB0aGlzIGlzIHByaW1hcmlseSB1c2VkIHRvIHRlbGxcbiAqIE9iamVjdHMgZnJvbSBwcmltaXRpdmUgdmFsdWVzIHdoZW4gd2Uga25vdyB0aGUgdmFsdWVcbiAqIGlzIGEgSlNPTi1jb21wbGlhbnQgdHlwZS5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QgKG9iaikge1xuICByZXR1cm4gb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnXG59XG5cbi8qKlxuICogR2V0IHRoZSByYXcgdHlwZSBzdHJpbmcgb2YgYSB2YWx1ZSwgZS5nLiwgW29iamVjdCBPYmplY3RdLlxuICovXG52YXIgX3RvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuZnVuY3Rpb24gdG9SYXdUeXBlICh2YWx1ZSkge1xuICByZXR1cm4gX3RvU3RyaW5nLmNhbGwodmFsdWUpLnNsaWNlKDgsIC0xKVxufVxuXG4vKipcbiAqIFN0cmljdCBvYmplY3QgdHlwZSBjaGVjay4gT25seSByZXR1cm5zIHRydWVcbiAqIGZvciBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdHMuXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QgKG9iaikge1xuICByZXR1cm4gX3RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbn1cblxuZnVuY3Rpb24gaXNSZWdFeHAgKHYpIHtcbiAgcmV0dXJuIF90b1N0cmluZy5jYWxsKHYpID09PSAnW29iamVjdCBSZWdFeHBdJ1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHZhbCBpcyBhIHZhbGlkIGFycmF5IGluZGV4LlxuICovXG5mdW5jdGlvbiBpc1ZhbGlkQXJyYXlJbmRleCAodmFsKSB7XG4gIHZhciBuID0gcGFyc2VGbG9hdChTdHJpbmcodmFsKSk7XG4gIHJldHVybiBuID49IDAgJiYgTWF0aC5mbG9vcihuKSA9PT0gbiAmJiBpc0Zpbml0ZSh2YWwpXG59XG5cbmZ1bmN0aW9uIGlzUHJvbWlzZSAodmFsKSB7XG4gIHJldHVybiAoXG4gICAgaXNEZWYodmFsKSAmJlxuICAgIHR5cGVvZiB2YWwudGhlbiA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIHR5cGVvZiB2YWwuY2F0Y2ggPT09ICdmdW5jdGlvbidcbiAgKVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSB2YWx1ZSB0byBhIHN0cmluZyB0aGF0IGlzIGFjdHVhbGx5IHJlbmRlcmVkLlxuICovXG5mdW5jdGlvbiB0b1N0cmluZyAodmFsKSB7XG4gIHJldHVybiB2YWwgPT0gbnVsbFxuICAgID8gJydcbiAgICA6IEFycmF5LmlzQXJyYXkodmFsKSB8fCAoaXNQbGFpbk9iamVjdCh2YWwpICYmIHZhbC50b1N0cmluZyA9PT0gX3RvU3RyaW5nKVxuICAgICAgPyBKU09OLnN0cmluZ2lmeSh2YWwsIG51bGwsIDIpXG4gICAgICA6IFN0cmluZyh2YWwpXG59XG5cbi8qKlxuICogQ29udmVydCBhbiBpbnB1dCB2YWx1ZSB0byBhIG51bWJlciBmb3IgcGVyc2lzdGVuY2UuXG4gKiBJZiB0aGUgY29udmVyc2lvbiBmYWlscywgcmV0dXJuIG9yaWdpbmFsIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIgKHZhbCkge1xuICB2YXIgbiA9IHBhcnNlRmxvYXQodmFsKTtcbiAgcmV0dXJuIGlzTmFOKG4pID8gdmFsIDogblxufVxuXG4vKipcbiAqIE1ha2UgYSBtYXAgYW5kIHJldHVybiBhIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIGtleVxuICogaXMgaW4gdGhhdCBtYXAuXG4gKi9cbmZ1bmN0aW9uIG1ha2VNYXAgKFxuICBzdHIsXG4gIGV4cGVjdHNMb3dlckNhc2Vcbikge1xuICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGxpc3QgPSBzdHIuc3BsaXQoJywnKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbWFwW2xpc3RbaV1dID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZXhwZWN0c0xvd2VyQ2FzZVxuICAgID8gZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbWFwW3ZhbC50b0xvd2VyQ2FzZSgpXTsgfVxuICAgIDogZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbWFwW3ZhbF07IH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHRhZyBpcyBhIGJ1aWx0LWluIHRhZy5cbiAqL1xudmFyIGlzQnVpbHRJblRhZyA9IG1ha2VNYXAoJ3Nsb3QsY29tcG9uZW50JywgdHJ1ZSk7XG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gYXR0cmlidXRlIGlzIGEgcmVzZXJ2ZWQgYXR0cmlidXRlLlxuICovXG52YXIgaXNSZXNlcnZlZEF0dHJpYnV0ZSA9IG1ha2VNYXAoJ2tleSxyZWYsc2xvdCxzbG90LXNjb3BlLGlzJyk7XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhbiBhcnJheS5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlIChhcnIsIGl0ZW0pIHtcbiAgaWYgKGFyci5sZW5ndGgpIHtcbiAgICB2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgcmV0dXJuIGFyci5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBvYmplY3QgaGFzIHRoZSBwcm9wZXJ0eS5cbiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGhhc093biAob2JqLCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgY2FjaGVkIHZlcnNpb24gb2YgYSBwdXJlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYWNoZWQgKGZuKSB7XG4gIHZhciBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHJldHVybiAoZnVuY3Rpb24gY2FjaGVkRm4gKHN0cikge1xuICAgIHZhciBoaXQgPSBjYWNoZVtzdHJdO1xuICAgIHJldHVybiBoaXQgfHwgKGNhY2hlW3N0cl0gPSBmbihzdHIpKVxuICB9KVxufVxuXG4vKipcbiAqIENhbWVsaXplIGEgaHlwaGVuLWRlbGltaXRlZCBzdHJpbmcuXG4gKi9cbnZhciBjYW1lbGl6ZVJFID0gLy0oXFx3KS9nO1xudmFyIGNhbWVsaXplID0gY2FjaGVkKGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGNhbWVsaXplUkUsIGZ1bmN0aW9uIChfLCBjKSB7IHJldHVybiBjID8gYy50b1VwcGVyQ2FzZSgpIDogJyc7IH0pXG59KTtcblxuLyoqXG4gKiBDYXBpdGFsaXplIGEgc3RyaW5nLlxuICovXG52YXIgY2FwaXRhbGl6ZSA9IGNhY2hlZChmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSlcbn0pO1xuXG4vKipcbiAqIEh5cGhlbmF0ZSBhIGNhbWVsQ2FzZSBzdHJpbmcuXG4gKi9cbnZhciBoeXBoZW5hdGVSRSA9IC9cXEIoW0EtWl0pL2c7XG52YXIgaHlwaGVuYXRlID0gY2FjaGVkKGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGh5cGhlbmF0ZVJFLCAnLSQxJykudG9Mb3dlckNhc2UoKVxufSk7XG5cbi8qKlxuICogU2ltcGxlIGJpbmQgcG9seWZpbGwgZm9yIGVudmlyb25tZW50cyB0aGF0IGRvIG5vdCBzdXBwb3J0IGl0LFxuICogZS5nLiwgUGhhbnRvbUpTIDEueC4gVGVjaG5pY2FsbHksIHdlIGRvbid0IG5lZWQgdGhpcyBhbnltb3JlXG4gKiBzaW5jZSBuYXRpdmUgYmluZCBpcyBub3cgcGVyZm9ybWFudCBlbm91Z2ggaW4gbW9zdCBicm93c2Vycy5cbiAqIEJ1dCByZW1vdmluZyBpdCB3b3VsZCBtZWFuIGJyZWFraW5nIGNvZGUgdGhhdCB3YXMgYWJsZSB0byBydW4gaW5cbiAqIFBoYW50b21KUyAxLngsIHNvIHRoaXMgbXVzdCBiZSBrZXB0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LlxuICovXG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5mdW5jdGlvbiBwb2x5ZmlsbEJpbmQgKGZuLCBjdHgpIHtcbiAgZnVuY3Rpb24gYm91bmRGbiAoYSkge1xuICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICByZXR1cm4gbFxuICAgICAgPyBsID4gMVxuICAgICAgICA/IGZuLmFwcGx5KGN0eCwgYXJndW1lbnRzKVxuICAgICAgICA6IGZuLmNhbGwoY3R4LCBhKVxuICAgICAgOiBmbi5jYWxsKGN0eClcbiAgfVxuXG4gIGJvdW5kRm4uX2xlbmd0aCA9IGZuLmxlbmd0aDtcbiAgcmV0dXJuIGJvdW5kRm5cbn1cblxuZnVuY3Rpb24gbmF0aXZlQmluZCAoZm4sIGN0eCkge1xuICByZXR1cm4gZm4uYmluZChjdHgpXG59XG5cbnZhciBiaW5kID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcbiAgPyBuYXRpdmVCaW5kXG4gIDogcG9seWZpbGxCaW5kO1xuXG4vKipcbiAqIENvbnZlcnQgYW4gQXJyYXktbGlrZSBvYmplY3QgdG8gYSByZWFsIEFycmF5LlxuICovXG5mdW5jdGlvbiB0b0FycmF5IChsaXN0LCBzdGFydCkge1xuICBzdGFydCA9IHN0YXJ0IHx8IDA7XG4gIHZhciBpID0gbGlzdC5sZW5ndGggLSBzdGFydDtcbiAgdmFyIHJldCA9IG5ldyBBcnJheShpKTtcbiAgd2hpbGUgKGktLSkge1xuICAgIHJldFtpXSA9IGxpc3RbaSArIHN0YXJ0XTtcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogTWl4IHByb3BlcnRpZXMgaW50byB0YXJnZXQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBleHRlbmQgKHRvLCBfZnJvbSkge1xuICBmb3IgKHZhciBrZXkgaW4gX2Zyb20pIHtcbiAgICB0b1trZXldID0gX2Zyb21ba2V5XTtcbiAgfVxuICByZXR1cm4gdG9cbn1cblxuLyoqXG4gKiBNZXJnZSBhbiBBcnJheSBvZiBPYmplY3RzIGludG8gYSBzaW5nbGUgT2JqZWN0LlxuICovXG5mdW5jdGlvbiB0b09iamVjdCAoYXJyKSB7XG4gIHZhciByZXMgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoYXJyW2ldKSB7XG4gICAgICBleHRlbmQocmVzLCBhcnJbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5cbi8qKlxuICogUGVyZm9ybSBubyBvcGVyYXRpb24uXG4gKiBTdHViYmluZyBhcmdzIHRvIG1ha2UgRmxvdyBoYXBweSB3aXRob3V0IGxlYXZpbmcgdXNlbGVzcyB0cmFuc3BpbGVkIGNvZGVcbiAqIHdpdGggLi4ucmVzdCAoaHR0cHM6Ly9mbG93Lm9yZy9ibG9nLzIwMTcvMDUvMDcvU3RyaWN0LUZ1bmN0aW9uLUNhbGwtQXJpdHkvKS5cbiAqL1xuZnVuY3Rpb24gbm9vcCAoYSwgYiwgYykge31cblxuLyoqXG4gKiBBbHdheXMgcmV0dXJuIGZhbHNlLlxuICovXG52YXIgbm8gPSBmdW5jdGlvbiAoYSwgYiwgYykgeyByZXR1cm4gZmFsc2U7IH07XG5cbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHNhbWUgdmFsdWUuXG4gKi9cbnZhciBpZGVudGl0eSA9IGZ1bmN0aW9uIChfKSB7IHJldHVybiBfOyB9O1xuXG4vKipcbiAqIENoZWNrIGlmIHR3byB2YWx1ZXMgYXJlIGxvb3NlbHkgZXF1YWwgLSB0aGF0IGlzLFxuICogaWYgdGhleSBhcmUgcGxhaW4gb2JqZWN0cywgZG8gdGhleSBoYXZlIHRoZSBzYW1lIHNoYXBlP1xuICovXG5mdW5jdGlvbiBsb29zZUVxdWFsIChhLCBiKSB7XG4gIGlmIChhID09PSBiKSB7IHJldHVybiB0cnVlIH1cbiAgdmFyIGlzT2JqZWN0QSA9IGlzT2JqZWN0KGEpO1xuICB2YXIgaXNPYmplY3RCID0gaXNPYmplY3QoYik7XG4gIGlmIChpc09iamVjdEEgJiYgaXNPYmplY3RCKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBpc0FycmF5QSA9IEFycmF5LmlzQXJyYXkoYSk7XG4gICAgICB2YXIgaXNBcnJheUIgPSBBcnJheS5pc0FycmF5KGIpO1xuICAgICAgaWYgKGlzQXJyYXlBICYmIGlzQXJyYXlCKSB7XG4gICAgICAgIHJldHVybiBhLmxlbmd0aCA9PT0gYi5sZW5ndGggJiYgYS5ldmVyeShmdW5jdGlvbiAoZSwgaSkge1xuICAgICAgICAgIHJldHVybiBsb29zZUVxdWFsKGUsIGJbaV0pXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGEgaW5zdGFuY2VvZiBEYXRlICYmIGIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHJldHVybiBhLmdldFRpbWUoKSA9PT0gYi5nZXRUaW1lKClcbiAgICAgIH0gZWxzZSBpZiAoIWlzQXJyYXlBICYmICFpc0FycmF5Qikge1xuICAgICAgICB2YXIga2V5c0EgPSBPYmplY3Qua2V5cyhhKTtcbiAgICAgICAgdmFyIGtleXNCID0gT2JqZWN0LmtleXMoYik7XG4gICAgICAgIHJldHVybiBrZXlzQS5sZW5ndGggPT09IGtleXNCLmxlbmd0aCAmJiBrZXlzQS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIGxvb3NlRXF1YWwoYVtrZXldLCBiW2tleV0pXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9IGVsc2UgaWYgKCFpc09iamVjdEEgJiYgIWlzT2JqZWN0Qikge1xuICAgIHJldHVybiBTdHJpbmcoYSkgPT09IFN0cmluZyhiKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBmaXJzdCBpbmRleCBhdCB3aGljaCBhIGxvb3NlbHkgZXF1YWwgdmFsdWUgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgYXJyYXkgKGlmIHZhbHVlIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGUgYXJyYXkgbXVzdFxuICogY29udGFpbiBhbiBvYmplY3Qgb2YgdGhlIHNhbWUgc2hhcGUpLCBvciAtMSBpZiBpdCBpcyBub3QgcHJlc2VudC5cbiAqL1xuZnVuY3Rpb24gbG9vc2VJbmRleE9mIChhcnIsIHZhbCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGlmIChsb29zZUVxdWFsKGFycltpXSwgdmFsKSkgeyByZXR1cm4gaSB9XG4gIH1cbiAgcmV0dXJuIC0xXG59XG5cbi8qKlxuICogRW5zdXJlIGEgZnVuY3Rpb24gaXMgY2FsbGVkIG9ubHkgb25jZS5cbiAqL1xuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cbn1cblxudmFyIEFTU0VUX1RZUEVTID0gW1xuICAnY29tcG9uZW50JyxcbiAgJ2RpcmVjdGl2ZScsXG4gICdmaWx0ZXInXG5dO1xuXG52YXIgTElGRUNZQ0xFX0hPT0tTID0gW1xuICAnYmVmb3JlQ3JlYXRlJyxcbiAgJ2NyZWF0ZWQnLFxuICAnYmVmb3JlTW91bnQnLFxuICAnbW91bnRlZCcsXG4gICdiZWZvcmVVcGRhdGUnLFxuICAndXBkYXRlZCcsXG4gICdiZWZvcmVEZXN0cm95JyxcbiAgJ2Rlc3Ryb3llZCcsXG4gICdhY3RpdmF0ZWQnLFxuICAnZGVhY3RpdmF0ZWQnLFxuICAnZXJyb3JDYXB0dXJlZCcsXG4gICdzZXJ2ZXJQcmVmZXRjaCdcbl07XG5cbi8qICAqL1xuXG5cblxudmFyIGNvbmZpZyA9ICh7XG4gIC8qKlxuICAgKiBPcHRpb24gbWVyZ2Ugc3RyYXRlZ2llcyAodXNlZCBpbiBjb3JlL3V0aWwvb3B0aW9ucylcbiAgICovXG4gIC8vICRmbG93LWRpc2FibGUtbGluZVxuICBvcHRpb25NZXJnZVN0cmF0ZWdpZXM6IE9iamVjdC5jcmVhdGUobnVsbCksXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gc3VwcHJlc3Mgd2FybmluZ3MuXG4gICAqL1xuICBzaWxlbnQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBTaG93IHByb2R1Y3Rpb24gbW9kZSB0aXAgbWVzc2FnZSBvbiBib290P1xuICAgKi9cbiAgcHJvZHVjdGlvblRpcDogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyxcblxuICAvKipcbiAgICogV2hldGhlciB0byBlbmFibGUgZGV2dG9vbHNcbiAgICovXG4gIGRldnRvb2xzOiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHJlY29yZCBwZXJmXG4gICAqL1xuICBwZXJmb3JtYW5jZTogZmFsc2UsXG5cbiAgLyoqXG4gICAqIEVycm9yIGhhbmRsZXIgZm9yIHdhdGNoZXIgZXJyb3JzXG4gICAqL1xuICBlcnJvckhhbmRsZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIFdhcm4gaGFuZGxlciBmb3Igd2F0Y2hlciB3YXJuc1xuICAgKi9cbiAgd2FybkhhbmRsZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIElnbm9yZSBjZXJ0YWluIGN1c3RvbSBlbGVtZW50c1xuICAgKi9cbiAgaWdub3JlZEVsZW1lbnRzOiBbXSxcblxuICAvKipcbiAgICogQ3VzdG9tIHVzZXIga2V5IGFsaWFzZXMgZm9yIHYtb25cbiAgICovXG4gIC8vICRmbG93LWRpc2FibGUtbGluZVxuICBrZXlDb2RlczogT2JqZWN0LmNyZWF0ZShudWxsKSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSB0YWcgaXMgcmVzZXJ2ZWQgc28gdGhhdCBpdCBjYW5ub3QgYmUgcmVnaXN0ZXJlZCBhcyBhXG4gICAqIGNvbXBvbmVudC4gVGhpcyBpcyBwbGF0Zm9ybS1kZXBlbmRlbnQgYW5kIG1heSBiZSBvdmVyd3JpdHRlbi5cbiAgICovXG4gIGlzUmVzZXJ2ZWRUYWc6IG5vLFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhbiBhdHRyaWJ1dGUgaXMgcmVzZXJ2ZWQgc28gdGhhdCBpdCBjYW5ub3QgYmUgdXNlZCBhcyBhIGNvbXBvbmVudFxuICAgKiBwcm9wLiBUaGlzIGlzIHBsYXRmb3JtLWRlcGVuZGVudCBhbmQgbWF5IGJlIG92ZXJ3cml0dGVuLlxuICAgKi9cbiAgaXNSZXNlcnZlZEF0dHI6IG5vLFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHRhZyBpcyBhbiB1bmtub3duIGVsZW1lbnQuXG4gICAqIFBsYXRmb3JtLWRlcGVuZGVudC5cbiAgICovXG4gIGlzVW5rbm93bkVsZW1lbnQ6IG5vLFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG5hbWVzcGFjZSBvZiBhbiBlbGVtZW50XG4gICAqL1xuICBnZXRUYWdOYW1lc3BhY2U6IG5vb3AsXG5cbiAgLyoqXG4gICAqIFBhcnNlIHRoZSByZWFsIHRhZyBuYW1lIGZvciB0aGUgc3BlY2lmaWMgcGxhdGZvcm0uXG4gICAqL1xuICBwYXJzZVBsYXRmb3JtVGFnTmFtZTogaWRlbnRpdHksXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGFuIGF0dHJpYnV0ZSBtdXN0IGJlIGJvdW5kIHVzaW5nIHByb3BlcnR5LCBlLmcuIHZhbHVlXG4gICAqIFBsYXRmb3JtLWRlcGVuZGVudC5cbiAgICovXG4gIG11c3RVc2VQcm9wOiBubyxcblxuICAvKipcbiAgICogUGVyZm9ybSB1cGRhdGVzIGFzeW5jaHJvbm91c2x5LiBJbnRlbmRlZCB0byBiZSB1c2VkIGJ5IFZ1ZSBUZXN0IFV0aWxzXG4gICAqIFRoaXMgd2lsbCBzaWduaWZpY2FudGx5IHJlZHVjZSBwZXJmb3JtYW5jZSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqL1xuICBhc3luYzogdHJ1ZSxcblxuICAvKipcbiAgICogRXhwb3NlZCBmb3IgbGVnYWN5IHJlYXNvbnNcbiAgICovXG4gIF9saWZlY3ljbGVIb29rczogTElGRUNZQ0xFX0hPT0tTXG59KTtcblxuLyogICovXG5cbi8qKlxuICogdW5pY29kZSBsZXR0ZXJzIHVzZWQgZm9yIHBhcnNpbmcgaHRtbCB0YWdzLCBjb21wb25lbnQgbmFtZXMgYW5kIHByb3BlcnR5IHBhdGhzLlxuICogdXNpbmcgaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1My9zZW1hbnRpY3Mtc2NyaXB0aW5nLmh0bWwjcG90ZW50aWFsY3VzdG9tZWxlbWVudG5hbWVcbiAqIHNraXBwaW5nIFxcdTEwMDAwLVxcdUVGRkZGIGR1ZSB0byBpdCBmcmVlemluZyB1cCBQaGFudG9tSlNcbiAqL1xudmFyIHVuaWNvZGVSZWdFeHAgPSAvYS16QS1aXFx1MDBCN1xcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwM0YtXFx1MjA0MFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRC87XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBzdHJpbmcgc3RhcnRzIHdpdGggJCBvciBfXG4gKi9cbmZ1bmN0aW9uIGlzUmVzZXJ2ZWQgKHN0cikge1xuICB2YXIgYyA9IChzdHIgKyAnJykuY2hhckNvZGVBdCgwKTtcbiAgcmV0dXJuIGMgPT09IDB4MjQgfHwgYyA9PT0gMHg1RlxufVxuXG4vKipcbiAqIERlZmluZSBhIHByb3BlcnR5LlxuICovXG5mdW5jdGlvbiBkZWYgKG9iaiwga2V5LCB2YWwsIGVudW1lcmFibGUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgdmFsdWU6IHZhbCxcbiAgICBlbnVtZXJhYmxlOiAhIWVudW1lcmFibGUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vKipcbiAqIFBhcnNlIHNpbXBsZSBwYXRoLlxuICovXG52YXIgYmFpbFJFID0gbmV3IFJlZ0V4cCgoXCJbXlwiICsgKHVuaWNvZGVSZWdFeHAuc291cmNlKSArIFwiLiRfXFxcXGRdXCIpKTtcbmZ1bmN0aW9uIHBhcnNlUGF0aCAocGF0aCkge1xuICBpZiAoYmFpbFJFLnRlc3QocGF0aCkpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgc2VnbWVudHMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFvYmopIHsgcmV0dXJuIH1cbiAgICAgIG9iaiA9IG9ialtzZWdtZW50c1tpXV07XG4gICAgfVxuICAgIHJldHVybiBvYmpcbiAgfVxufVxuXG4vKiAgKi9cblxuLy8gY2FuIHdlIHVzZSBfX3Byb3RvX18/XG52YXIgaGFzUHJvdG8gPSAnX19wcm90b19fJyBpbiB7fTtcblxuLy8gQnJvd3NlciBlbnZpcm9ubWVudCBzbmlmZmluZ1xudmFyIGluQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xudmFyIGluV2VleCA9IHR5cGVvZiBXWEVudmlyb25tZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhIVdYRW52aXJvbm1lbnQucGxhdGZvcm07XG52YXIgd2VleFBsYXRmb3JtID0gaW5XZWV4ICYmIFdYRW52aXJvbm1lbnQucGxhdGZvcm0udG9Mb3dlckNhc2UoKTtcbnZhciBVQSA9IGluQnJvd3NlciAmJiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xudmFyIGlzSUUgPSBVQSAmJiAvbXNpZXx0cmlkZW50Ly50ZXN0KFVBKTtcbnZhciBpc0lFOSA9IFVBICYmIFVBLmluZGV4T2YoJ21zaWUgOS4wJykgPiAwO1xudmFyIGlzRWRnZSA9IFVBICYmIFVBLmluZGV4T2YoJ2VkZ2UvJykgPiAwO1xudmFyIGlzQW5kcm9pZCA9IChVQSAmJiBVQS5pbmRleE9mKCdhbmRyb2lkJykgPiAwKSB8fCAod2VleFBsYXRmb3JtID09PSAnYW5kcm9pZCcpO1xudmFyIGlzSU9TID0gKFVBICYmIC9pcGhvbmV8aXBhZHxpcG9kfGlvcy8udGVzdChVQSkpIHx8ICh3ZWV4UGxhdGZvcm0gPT09ICdpb3MnKTtcbnZhciBpc0Nocm9tZSA9IFVBICYmIC9jaHJvbWVcXC9cXGQrLy50ZXN0KFVBKSAmJiAhaXNFZGdlO1xudmFyIGlzUGhhbnRvbUpTID0gVUEgJiYgL3BoYW50b21qcy8udGVzdChVQSk7XG52YXIgaXNGRiA9IFVBICYmIFVBLm1hdGNoKC9maXJlZm94XFwvKFxcZCspLyk7XG5cbi8vIEZpcmVmb3ggaGFzIGEgXCJ3YXRjaFwiIGZ1bmN0aW9uIG9uIE9iamVjdC5wcm90b3R5cGUuLi5cbnZhciBuYXRpdmVXYXRjaCA9ICh7fSkud2F0Y2g7XG5pZiAoaW5Ccm93c2VyKSB7XG4gIHRyeSB7XG4gICAgdmFyIG9wdHMgPSB7fTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob3B0cywgJ3Bhc3NpdmUnLCAoe1xuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQgKCkge1xuICAgICAgfVxuICAgIH0pKTsgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2Zsb3cvaXNzdWVzLzI4NVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0LXBhc3NpdmUnLCBudWxsLCBvcHRzKTtcbiAgfSBjYXRjaCAoZSkge31cbn1cblxuLy8gdGhpcyBuZWVkcyB0byBiZSBsYXp5LWV2YWxlZCBiZWNhdXNlIHZ1ZSBtYXkgYmUgcmVxdWlyZWQgYmVmb3JlXG4vLyB2dWUtc2VydmVyLXJlbmRlcmVyIGNhbiBzZXQgVlVFX0VOVlxudmFyIF9pc1NlcnZlcjtcbnZhciBpc1NlcnZlclJlbmRlcmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pc1NlcnZlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFpbkJyb3dzZXIgJiYgIWluV2VleCAmJiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gZGV0ZWN0IHByZXNlbmNlIG9mIHZ1ZS1zZXJ2ZXItcmVuZGVyZXIgYW5kIGF2b2lkXG4gICAgICAvLyBXZWJwYWNrIHNoaW1taW5nIHRoZSBwcm9jZXNzXG4gICAgICBfaXNTZXJ2ZXIgPSBnbG9iYWxbJ3Byb2Nlc3MnXSAmJiBnbG9iYWxbJ3Byb2Nlc3MnXS5lbnYuVlVFX0VOViA9PT0gJ3NlcnZlcic7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9pc1NlcnZlciA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gX2lzU2VydmVyXG59O1xuXG4vLyBkZXRlY3QgZGV2dG9vbHNcbnZhciBkZXZ0b29scyA9IGluQnJvd3NlciAmJiB3aW5kb3cuX19WVUVfREVWVE9PTFNfR0xPQkFMX0hPT0tfXztcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmZ1bmN0aW9uIGlzTmF0aXZlIChDdG9yKSB7XG4gIHJldHVybiB0eXBlb2YgQ3RvciA9PT0gJ2Z1bmN0aW9uJyAmJiAvbmF0aXZlIGNvZGUvLnRlc3QoQ3Rvci50b1N0cmluZygpKVxufVxuXG52YXIgaGFzU3ltYm9sID1cbiAgdHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOYXRpdmUoU3ltYm9sKSAmJlxuICB0eXBlb2YgUmVmbGVjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOYXRpdmUoUmVmbGVjdC5vd25LZXlzKTtcblxudmFyIF9TZXQ7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi8gLy8gJGZsb3ctZGlzYWJsZS1saW5lXG5pZiAodHlwZW9mIFNldCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOYXRpdmUoU2V0KSkge1xuICAvLyB1c2UgbmF0aXZlIFNldCB3aGVuIGF2YWlsYWJsZS5cbiAgX1NldCA9IFNldDtcbn0gZWxzZSB7XG4gIC8vIGEgbm9uLXN0YW5kYXJkIFNldCBwb2x5ZmlsbCB0aGF0IG9ubHkgd29ya3Mgd2l0aCBwcmltaXRpdmUga2V5cy5cbiAgX1NldCA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNldCAoKSB7XG4gICAgICB0aGlzLnNldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuICAgIFNldC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gaGFzIChrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFtrZXldID09PSB0cnVlXG4gICAgfTtcbiAgICBTZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZCAoa2V5KSB7XG4gICAgICB0aGlzLnNldFtrZXldID0gdHJ1ZTtcbiAgICB9O1xuICAgIFNldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgICB0aGlzLnNldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfTtcblxuICAgIHJldHVybiBTZXQ7XG4gIH0oKSk7XG59XG5cbi8qICAqL1xuXG52YXIgd2FybiA9IG5vb3A7XG52YXIgdGlwID0gbm9vcDtcbnZhciBnZW5lcmF0ZUNvbXBvbmVudFRyYWNlID0gKG5vb3ApOyAvLyB3b3JrIGFyb3VuZCBmbG93IGNoZWNrXG52YXIgZm9ybWF0Q29tcG9uZW50TmFtZSA9IChub29wKTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGhhc0NvbnNvbGUgPSB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCc7XG4gIHZhciBjbGFzc2lmeVJFID0gLyg/Ol58Wy1fXSkoXFx3KS9nO1xuICB2YXIgY2xhc3NpZnkgPSBmdW5jdGlvbiAoc3RyKSB7IHJldHVybiBzdHJcbiAgICAucmVwbGFjZShjbGFzc2lmeVJFLCBmdW5jdGlvbiAoYykgeyByZXR1cm4gYy50b1VwcGVyQ2FzZSgpOyB9KVxuICAgIC5yZXBsYWNlKC9bLV9dL2csICcnKTsgfTtcblxuICB3YXJuID0gZnVuY3Rpb24gKG1zZywgdm0pIHtcbiAgICB2YXIgdHJhY2UgPSB2bSA/IGdlbmVyYXRlQ29tcG9uZW50VHJhY2Uodm0pIDogJyc7XG5cbiAgICBpZiAoY29uZmlnLndhcm5IYW5kbGVyKSB7XG4gICAgICBjb25maWcud2FybkhhbmRsZXIuY2FsbChudWxsLCBtc2csIHZtLCB0cmFjZSk7XG4gICAgfSBlbHNlIGlmIChoYXNDb25zb2xlICYmICghY29uZmlnLnNpbGVudCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoKFwiW1Z1ZSB3YXJuXTogXCIgKyBtc2cgKyB0cmFjZSkpO1xuICAgIH1cbiAgfTtcblxuICB0aXAgPSBmdW5jdGlvbiAobXNnLCB2bSkge1xuICAgIGlmIChoYXNDb25zb2xlICYmICghY29uZmlnLnNpbGVudCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltWdWUgdGlwXTogXCIgKyBtc2cgKyAoXG4gICAgICAgIHZtID8gZ2VuZXJhdGVDb21wb25lbnRUcmFjZSh2bSkgOiAnJ1xuICAgICAgKSk7XG4gICAgfVxuICB9O1xuXG4gIGZvcm1hdENvbXBvbmVudE5hbWUgPSBmdW5jdGlvbiAodm0sIGluY2x1ZGVGaWxlKSB7XG4gICAge1xuICAgICAgaWYodm0uJHNjb3BlICYmIHZtLiRzY29wZS5pcyl7XG4gICAgICAgIHJldHVybiB2bS4kc2NvcGUuaXNcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZtLiRyb290ID09PSB2bSkge1xuICAgICAgcmV0dXJuICc8Um9vdD4nXG4gICAgfVxuICAgIHZhciBvcHRpb25zID0gdHlwZW9mIHZtID09PSAnZnVuY3Rpb24nICYmIHZtLmNpZCAhPSBudWxsXG4gICAgICA/IHZtLm9wdGlvbnNcbiAgICAgIDogdm0uX2lzVnVlXG4gICAgICAgID8gdm0uJG9wdGlvbnMgfHwgdm0uY29uc3RydWN0b3Iub3B0aW9uc1xuICAgICAgICA6IHZtO1xuICAgIHZhciBuYW1lID0gb3B0aW9ucy5uYW1lIHx8IG9wdGlvbnMuX2NvbXBvbmVudFRhZztcbiAgICB2YXIgZmlsZSA9IG9wdGlvbnMuX19maWxlO1xuICAgIGlmICghbmFtZSAmJiBmaWxlKSB7XG4gICAgICB2YXIgbWF0Y2ggPSBmaWxlLm1hdGNoKC8oW14vXFxcXF0rKVxcLnZ1ZSQvKTtcbiAgICAgIG5hbWUgPSBtYXRjaCAmJiBtYXRjaFsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgKG5hbWUgPyAoXCI8XCIgKyAoY2xhc3NpZnkobmFtZSkpICsgXCI+XCIpIDogXCI8QW5vbnltb3VzPlwiKSArXG4gICAgICAoZmlsZSAmJiBpbmNsdWRlRmlsZSAhPT0gZmFsc2UgPyAoXCIgYXQgXCIgKyBmaWxlKSA6ICcnKVxuICAgIClcbiAgfTtcblxuICB2YXIgcmVwZWF0ID0gZnVuY3Rpb24gKHN0ciwgbikge1xuICAgIHZhciByZXMgPSAnJztcbiAgICB3aGlsZSAobikge1xuICAgICAgaWYgKG4gJSAyID09PSAxKSB7IHJlcyArPSBzdHI7IH1cbiAgICAgIGlmIChuID4gMSkgeyBzdHIgKz0gc3RyOyB9XG4gICAgICBuID4+PSAxO1xuICAgIH1cbiAgICByZXR1cm4gcmVzXG4gIH07XG5cbiAgZ2VuZXJhdGVDb21wb25lbnRUcmFjZSA9IGZ1bmN0aW9uICh2bSkge1xuICAgIGlmICh2bS5faXNWdWUgJiYgdm0uJHBhcmVudCkge1xuICAgICAgdmFyIHRyZWUgPSBbXTtcbiAgICAgIHZhciBjdXJyZW50UmVjdXJzaXZlU2VxdWVuY2UgPSAwO1xuICAgICAgd2hpbGUgKHZtKSB7XG4gICAgICAgIGlmICh0cmVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB2YXIgbGFzdCA9IHRyZWVbdHJlZS5sZW5ndGggLSAxXTtcbiAgICAgICAgICBpZiAobGFzdC5jb25zdHJ1Y3RvciA9PT0gdm0uY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGN1cnJlbnRSZWN1cnNpdmVTZXF1ZW5jZSsrO1xuICAgICAgICAgICAgdm0gPSB2bS4kcGFyZW50O1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRSZWN1cnNpdmVTZXF1ZW5jZSA+IDApIHtcbiAgICAgICAgICAgIHRyZWVbdHJlZS5sZW5ndGggLSAxXSA9IFtsYXN0LCBjdXJyZW50UmVjdXJzaXZlU2VxdWVuY2VdO1xuICAgICAgICAgICAgY3VycmVudFJlY3Vyc2l2ZVNlcXVlbmNlID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdHJlZS5wdXNoKHZtKTtcbiAgICAgICAgdm0gPSB2bS4kcGFyZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuICdcXG5cXG5mb3VuZCBpblxcblxcbicgKyB0cmVlXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHZtLCBpKSB7IHJldHVybiAoXCJcIiArIChpID09PSAwID8gJy0tLT4gJyA6IHJlcGVhdCgnICcsIDUgKyBpICogMikpICsgKEFycmF5LmlzQXJyYXkodm0pXG4gICAgICAgICAgICA/ICgoZm9ybWF0Q29tcG9uZW50TmFtZSh2bVswXSkpICsgXCIuLi4gKFwiICsgKHZtWzFdKSArIFwiIHJlY3Vyc2l2ZSBjYWxscylcIilcbiAgICAgICAgICAgIDogZm9ybWF0Q29tcG9uZW50TmFtZSh2bSkpKTsgfSlcbiAgICAgICAgLmpvaW4oJ1xcbicpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXCJcXG5cXG4oZm91bmQgaW4gXCIgKyAoZm9ybWF0Q29tcG9uZW50TmFtZSh2bSkpICsgXCIpXCIpXG4gICAgfVxuICB9O1xufVxuXG4vKiAgKi9cblxudmFyIHVpZCA9IDA7XG5cbi8qKlxuICogQSBkZXAgaXMgYW4gb2JzZXJ2YWJsZSB0aGF0IGNhbiBoYXZlIG11bHRpcGxlXG4gKiBkaXJlY3RpdmVzIHN1YnNjcmliaW5nIHRvIGl0LlxuICovXG52YXIgRGVwID0gZnVuY3Rpb24gRGVwICgpIHtcbiAgdGhpcy5pZCA9IHVpZCsrO1xuICB0aGlzLnN1YnMgPSBbXTtcbn07XG5cbkRlcC5wcm90b3R5cGUuYWRkU3ViID0gZnVuY3Rpb24gYWRkU3ViIChzdWIpIHtcbiAgdGhpcy5zdWJzLnB1c2goc3ViKTtcbn07XG5cbkRlcC5wcm90b3R5cGUucmVtb3ZlU3ViID0gZnVuY3Rpb24gcmVtb3ZlU3ViIChzdWIpIHtcbiAgcmVtb3ZlKHRoaXMuc3Vicywgc3ViKTtcbn07XG5cbkRlcC5wcm90b3R5cGUuZGVwZW5kID0gZnVuY3Rpb24gZGVwZW5kICgpIHtcbiAgaWYgKERlcC5TaGFyZWRPYmplY3QudGFyZ2V0KSB7XG4gICAgRGVwLlNoYXJlZE9iamVjdC50YXJnZXQuYWRkRGVwKHRoaXMpO1xuICB9XG59O1xuXG5EZXAucHJvdG90eXBlLm5vdGlmeSA9IGZ1bmN0aW9uIG5vdGlmeSAoKSB7XG4gIC8vIHN0YWJpbGl6ZSB0aGUgc3Vic2NyaWJlciBsaXN0IGZpcnN0XG4gIHZhciBzdWJzID0gdGhpcy5zdWJzLnNsaWNlKCk7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmICFjb25maWcuYXN5bmMpIHtcbiAgICAvLyBzdWJzIGFyZW4ndCBzb3J0ZWQgaW4gc2NoZWR1bGVyIGlmIG5vdCBydW5uaW5nIGFzeW5jXG4gICAgLy8gd2UgbmVlZCB0byBzb3J0IHRoZW0gbm93IHRvIG1ha2Ugc3VyZSB0aGV5IGZpcmUgaW4gY29ycmVjdFxuICAgIC8vIG9yZGVyXG4gICAgc3Vicy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmlkIC0gYi5pZDsgfSk7XG4gIH1cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdWJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHN1YnNbaV0udXBkYXRlKCk7XG4gIH1cbn07XG5cbi8vIFRoZSBjdXJyZW50IHRhcmdldCB3YXRjaGVyIGJlaW5nIGV2YWx1YXRlZC5cbi8vIFRoaXMgaXMgZ2xvYmFsbHkgdW5pcXVlIGJlY2F1c2Ugb25seSBvbmUgd2F0Y2hlclxuLy8gY2FuIGJlIGV2YWx1YXRlZCBhdCBhIHRpbWUuXG4vLyBmaXhlZCBieSB4eHh4eHggKG52dWUgc2hhcmVkIHZ1ZXgpXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuRGVwLlNoYXJlZE9iamVjdCA9IHR5cGVvZiBTaGFyZWRPYmplY3QgIT09ICd1bmRlZmluZWQnID8gU2hhcmVkT2JqZWN0IDoge307XG5EZXAuU2hhcmVkT2JqZWN0LnRhcmdldCA9IG51bGw7XG5EZXAuU2hhcmVkT2JqZWN0LnRhcmdldFN0YWNrID0gW107XG5cbmZ1bmN0aW9uIHB1c2hUYXJnZXQgKHRhcmdldCkge1xuICBEZXAuU2hhcmVkT2JqZWN0LnRhcmdldFN0YWNrLnB1c2godGFyZ2V0KTtcbiAgRGVwLlNoYXJlZE9iamVjdC50YXJnZXQgPSB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIHBvcFRhcmdldCAoKSB7XG4gIERlcC5TaGFyZWRPYmplY3QudGFyZ2V0U3RhY2sucG9wKCk7XG4gIERlcC5TaGFyZWRPYmplY3QudGFyZ2V0ID0gRGVwLlNoYXJlZE9iamVjdC50YXJnZXRTdGFja1tEZXAuU2hhcmVkT2JqZWN0LnRhcmdldFN0YWNrLmxlbmd0aCAtIDFdO1xufVxuXG4vKiAgKi9cblxudmFyIFZOb2RlID0gZnVuY3Rpb24gVk5vZGUgKFxuICB0YWcsXG4gIGRhdGEsXG4gIGNoaWxkcmVuLFxuICB0ZXh0LFxuICBlbG0sXG4gIGNvbnRleHQsXG4gIGNvbXBvbmVudE9wdGlvbnMsXG4gIGFzeW5jRmFjdG9yeVxuKSB7XG4gIHRoaXMudGFnID0gdGFnO1xuICB0aGlzLmRhdGEgPSBkYXRhO1xuICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIHRoaXMudGV4dCA9IHRleHQ7XG4gIHRoaXMuZWxtID0gZWxtO1xuICB0aGlzLm5zID0gdW5kZWZpbmVkO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLmZuQ29udGV4dCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5mbk9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gIHRoaXMuZm5TY29wZUlkID0gdW5kZWZpbmVkO1xuICB0aGlzLmtleSA9IGRhdGEgJiYgZGF0YS5rZXk7XG4gIHRoaXMuY29tcG9uZW50T3B0aW9ucyA9IGNvbXBvbmVudE9wdGlvbnM7XG4gIHRoaXMuY29tcG9uZW50SW5zdGFuY2UgPSB1bmRlZmluZWQ7XG4gIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkO1xuICB0aGlzLnJhdyA9IGZhbHNlO1xuICB0aGlzLmlzU3RhdGljID0gZmFsc2U7XG4gIHRoaXMuaXNSb290SW5zZXJ0ID0gdHJ1ZTtcbiAgdGhpcy5pc0NvbW1lbnQgPSBmYWxzZTtcbiAgdGhpcy5pc0Nsb25lZCA9IGZhbHNlO1xuICB0aGlzLmlzT25jZSA9IGZhbHNlO1xuICB0aGlzLmFzeW5jRmFjdG9yeSA9IGFzeW5jRmFjdG9yeTtcbiAgdGhpcy5hc3luY01ldGEgPSB1bmRlZmluZWQ7XG4gIHRoaXMuaXNBc3luY1BsYWNlaG9sZGVyID0gZmFsc2U7XG59O1xuXG52YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyBjaGlsZDogeyBjb25maWd1cmFibGU6IHRydWUgfSB9O1xuXG4vLyBERVBSRUNBVEVEOiBhbGlhcyBmb3IgY29tcG9uZW50SW5zdGFuY2UgZm9yIGJhY2t3YXJkcyBjb21wYXQuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xucHJvdG90eXBlQWNjZXNzb3JzLmNoaWxkLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuY29tcG9uZW50SW5zdGFuY2Vcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBWTm9kZS5wcm90b3R5cGUsIHByb3RvdHlwZUFjY2Vzc29ycyApO1xuXG52YXIgY3JlYXRlRW1wdHlWTm9kZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gIGlmICggdGV4dCA9PT0gdm9pZCAwICkgdGV4dCA9ICcnO1xuXG4gIHZhciBub2RlID0gbmV3IFZOb2RlKCk7XG4gIG5vZGUudGV4dCA9IHRleHQ7XG4gIG5vZGUuaXNDb21tZW50ID0gdHJ1ZTtcbiAgcmV0dXJuIG5vZGVcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZVRleHRWTm9kZSAodmFsKSB7XG4gIHJldHVybiBuZXcgVk5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgU3RyaW5nKHZhbCkpXG59XG5cbi8vIG9wdGltaXplZCBzaGFsbG93IGNsb25lXG4vLyB1c2VkIGZvciBzdGF0aWMgbm9kZXMgYW5kIHNsb3Qgbm9kZXMgYmVjYXVzZSB0aGV5IG1heSBiZSByZXVzZWQgYWNyb3NzXG4vLyBtdWx0aXBsZSByZW5kZXJzLCBjbG9uaW5nIHRoZW0gYXZvaWRzIGVycm9ycyB3aGVuIERPTSBtYW5pcHVsYXRpb25zIHJlbHlcbi8vIG9uIHRoZWlyIGVsbSByZWZlcmVuY2UuXG5mdW5jdGlvbiBjbG9uZVZOb2RlICh2bm9kZSkge1xuICB2YXIgY2xvbmVkID0gbmV3IFZOb2RlKFxuICAgIHZub2RlLnRhZyxcbiAgICB2bm9kZS5kYXRhLFxuICAgIC8vICM3OTc1XG4gICAgLy8gY2xvbmUgY2hpbGRyZW4gYXJyYXkgdG8gYXZvaWQgbXV0YXRpbmcgb3JpZ2luYWwgaW4gY2FzZSBvZiBjbG9uaW5nXG4gICAgLy8gYSBjaGlsZC5cbiAgICB2bm9kZS5jaGlsZHJlbiAmJiB2bm9kZS5jaGlsZHJlbi5zbGljZSgpLFxuICAgIHZub2RlLnRleHQsXG4gICAgdm5vZGUuZWxtLFxuICAgIHZub2RlLmNvbnRleHQsXG4gICAgdm5vZGUuY29tcG9uZW50T3B0aW9ucyxcbiAgICB2bm9kZS5hc3luY0ZhY3RvcnlcbiAgKTtcbiAgY2xvbmVkLm5zID0gdm5vZGUubnM7XG4gIGNsb25lZC5pc1N0YXRpYyA9IHZub2RlLmlzU3RhdGljO1xuICBjbG9uZWQua2V5ID0gdm5vZGUua2V5O1xuICBjbG9uZWQuaXNDb21tZW50ID0gdm5vZGUuaXNDb21tZW50O1xuICBjbG9uZWQuZm5Db250ZXh0ID0gdm5vZGUuZm5Db250ZXh0O1xuICBjbG9uZWQuZm5PcHRpb25zID0gdm5vZGUuZm5PcHRpb25zO1xuICBjbG9uZWQuZm5TY29wZUlkID0gdm5vZGUuZm5TY29wZUlkO1xuICBjbG9uZWQuYXN5bmNNZXRhID0gdm5vZGUuYXN5bmNNZXRhO1xuICBjbG9uZWQuaXNDbG9uZWQgPSB0cnVlO1xuICByZXR1cm4gY2xvbmVkXG59XG5cbi8qXG4gKiBub3QgdHlwZSBjaGVja2luZyB0aGlzIGZpbGUgYmVjYXVzZSBmbG93IGRvZXNuJ3QgcGxheSB3ZWxsIHdpdGhcbiAqIGR5bmFtaWNhbGx5IGFjY2Vzc2luZyBtZXRob2RzIG9uIEFycmF5IHByb3RvdHlwZVxuICovXG5cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xudmFyIGFycmF5TWV0aG9kcyA9IE9iamVjdC5jcmVhdGUoYXJyYXlQcm90byk7XG5cbnZhciBtZXRob2RzVG9QYXRjaCA9IFtcbiAgJ3B1c2gnLFxuICAncG9wJyxcbiAgJ3NoaWZ0JyxcbiAgJ3Vuc2hpZnQnLFxuICAnc3BsaWNlJyxcbiAgJ3NvcnQnLFxuICAncmV2ZXJzZSdcbl07XG5cbi8qKlxuICogSW50ZXJjZXB0IG11dGF0aW5nIG1ldGhvZHMgYW5kIGVtaXQgZXZlbnRzXG4gKi9cbm1ldGhvZHNUb1BhdGNoLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyBjYWNoZSBvcmlnaW5hbCBtZXRob2RcbiAgdmFyIG9yaWdpbmFsID0gYXJyYXlQcm90b1ttZXRob2RdO1xuICBkZWYoYXJyYXlNZXRob2RzLCBtZXRob2QsIGZ1bmN0aW9uIG11dGF0b3IgKCkge1xuICAgIHZhciBhcmdzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgd2hpbGUgKCBsZW4tLSApIGFyZ3NbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICAgIHZhciByZXN1bHQgPSBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB2YXIgb2IgPSB0aGlzLl9fb2JfXztcbiAgICB2YXIgaW5zZXJ0ZWQ7XG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgIGNhc2UgJ3B1c2gnOlxuICAgICAgY2FzZSAndW5zaGlmdCc6XG4gICAgICAgIGluc2VydGVkID0gYXJncztcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3NwbGljZSc6XG4gICAgICAgIGluc2VydGVkID0gYXJncy5zbGljZSgyKTtcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgaWYgKGluc2VydGVkKSB7IG9iLm9ic2VydmVBcnJheShpbnNlcnRlZCk7IH1cbiAgICAvLyBub3RpZnkgY2hhbmdlXG4gICAgb2IuZGVwLm5vdGlmeSgpO1xuICAgIHJldHVybiByZXN1bHRcbiAgfSk7XG59KTtcblxuLyogICovXG5cbnZhciBhcnJheUtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhcnJheU1ldGhvZHMpO1xuXG4vKipcbiAqIEluIHNvbWUgY2FzZXMgd2UgbWF5IHdhbnQgdG8gZGlzYWJsZSBvYnNlcnZhdGlvbiBpbnNpZGUgYSBjb21wb25lbnQnc1xuICogdXBkYXRlIGNvbXB1dGF0aW9uLlxuICovXG52YXIgc2hvdWxkT2JzZXJ2ZSA9IHRydWU7XG5cbmZ1bmN0aW9uIHRvZ2dsZU9ic2VydmluZyAodmFsdWUpIHtcbiAgc2hvdWxkT2JzZXJ2ZSA9IHZhbHVlO1xufVxuXG4vKipcbiAqIE9ic2VydmVyIGNsYXNzIHRoYXQgaXMgYXR0YWNoZWQgdG8gZWFjaCBvYnNlcnZlZFxuICogb2JqZWN0LiBPbmNlIGF0dGFjaGVkLCB0aGUgb2JzZXJ2ZXIgY29udmVydHMgdGhlIHRhcmdldFxuICogb2JqZWN0J3MgcHJvcGVydHkga2V5cyBpbnRvIGdldHRlci9zZXR0ZXJzIHRoYXRcbiAqIGNvbGxlY3QgZGVwZW5kZW5jaWVzIGFuZCBkaXNwYXRjaCB1cGRhdGVzLlxuICovXG52YXIgT2JzZXJ2ZXIgPSBmdW5jdGlvbiBPYnNlcnZlciAodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB0aGlzLmRlcCA9IG5ldyBEZXAoKTtcbiAgdGhpcy52bUNvdW50ID0gMDtcbiAgZGVmKHZhbHVlLCAnX19vYl9fJywgdGhpcyk7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIGlmIChoYXNQcm90bykge1xuICAgICAgey8vIGZpeGVkIGJ5IHh4eHh4eCDlvq7kv6HlsI/nqIvluo/kvb/nlKggcGx1Z2lucyDkuYvlkI7vvIzmlbDnu4Tmlrnms5Xooqvnm7TmjqXmjILovb3liLDkuobmlbDnu4Tlr7nosaHkuIrvvIzpnIDopoHmiafooYwgY29weUF1Z21lbnQg6YC76L6RXG4gICAgICAgIGlmKHZhbHVlLnB1c2ggIT09IHZhbHVlLl9fcHJvdG9fXy5wdXNoKXtcbiAgICAgICAgICBjb3B5QXVnbWVudCh2YWx1ZSwgYXJyYXlNZXRob2RzLCBhcnJheUtleXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3RvQXVnbWVudCh2YWx1ZSwgYXJyYXlNZXRob2RzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3B5QXVnbWVudCh2YWx1ZSwgYXJyYXlNZXRob2RzLCBhcnJheUtleXMpO1xuICAgIH1cbiAgICB0aGlzLm9ic2VydmVBcnJheSh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy53YWxrKHZhbHVlKTtcbiAgfVxufTtcblxuLyoqXG4gKiBXYWxrIHRocm91Z2ggYWxsIHByb3BlcnRpZXMgYW5kIGNvbnZlcnQgdGhlbSBpbnRvXG4gKiBnZXR0ZXIvc2V0dGVycy4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIHdoZW5cbiAqIHZhbHVlIHR5cGUgaXMgT2JqZWN0LlxuICovXG5PYnNlcnZlci5wcm90b3R5cGUud2FsayA9IGZ1bmN0aW9uIHdhbGsgKG9iaikge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGRlZmluZVJlYWN0aXZlJCQxKG9iaiwga2V5c1tpXSk7XG4gIH1cbn07XG5cbi8qKlxuICogT2JzZXJ2ZSBhIGxpc3Qgb2YgQXJyYXkgaXRlbXMuXG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5vYnNlcnZlQXJyYXkgPSBmdW5jdGlvbiBvYnNlcnZlQXJyYXkgKGl0ZW1zKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgb2JzZXJ2ZShpdGVtc1tpXSk7XG4gIH1cbn07XG5cbi8vIGhlbHBlcnNcblxuLyoqXG4gKiBBdWdtZW50IGEgdGFyZ2V0IE9iamVjdCBvciBBcnJheSBieSBpbnRlcmNlcHRpbmdcbiAqIHRoZSBwcm90b3R5cGUgY2hhaW4gdXNpbmcgX19wcm90b19fXG4gKi9cbmZ1bmN0aW9uIHByb3RvQXVnbWVudCAodGFyZ2V0LCBzcmMpIHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbiAgdGFyZ2V0Ll9fcHJvdG9fXyA9IHNyYztcbiAgLyogZXNsaW50LWVuYWJsZSBuby1wcm90byAqL1xufVxuXG4vKipcbiAqIEF1Z21lbnQgYSB0YXJnZXQgT2JqZWN0IG9yIEFycmF5IGJ5IGRlZmluaW5nXG4gKiBoaWRkZW4gcHJvcGVydGllcy5cbiAqL1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmZ1bmN0aW9uIGNvcHlBdWdtZW50ICh0YXJnZXQsIHNyYywga2V5cykge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgZGVmKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBdHRlbXB0IHRvIGNyZWF0ZSBhbiBvYnNlcnZlciBpbnN0YW5jZSBmb3IgYSB2YWx1ZSxcbiAqIHJldHVybnMgdGhlIG5ldyBvYnNlcnZlciBpZiBzdWNjZXNzZnVsbHkgb2JzZXJ2ZWQsXG4gKiBvciB0aGUgZXhpc3Rpbmcgb2JzZXJ2ZXIgaWYgdGhlIHZhbHVlIGFscmVhZHkgaGFzIG9uZS5cbiAqL1xuZnVuY3Rpb24gb2JzZXJ2ZSAodmFsdWUsIGFzUm9vdERhdGEpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgdmFsdWUgaW5zdGFuY2VvZiBWTm9kZSkge1xuICAgIHJldHVyblxuICB9XG4gIHZhciBvYjtcbiAgaWYgKGhhc093bih2YWx1ZSwgJ19fb2JfXycpICYmIHZhbHVlLl9fb2JfXyBpbnN0YW5jZW9mIE9ic2VydmVyKSB7XG4gICAgb2IgPSB2YWx1ZS5fX29iX187XG4gIH0gZWxzZSBpZiAoXG4gICAgc2hvdWxkT2JzZXJ2ZSAmJlxuICAgICFpc1NlcnZlclJlbmRlcmluZygpICYmXG4gICAgKEFycmF5LmlzQXJyYXkodmFsdWUpIHx8IGlzUGxhaW5PYmplY3QodmFsdWUpKSAmJlxuICAgIE9iamVjdC5pc0V4dGVuc2libGUodmFsdWUpICYmXG4gICAgIXZhbHVlLl9pc1Z1ZVxuICApIHtcbiAgICBvYiA9IG5ldyBPYnNlcnZlcih2YWx1ZSk7XG4gIH1cbiAgaWYgKGFzUm9vdERhdGEgJiYgb2IpIHtcbiAgICBvYi52bUNvdW50Kys7XG4gIH1cbiAgcmV0dXJuIG9iXG59XG5cbi8qKlxuICogRGVmaW5lIGEgcmVhY3RpdmUgcHJvcGVydHkgb24gYW4gT2JqZWN0LlxuICovXG5mdW5jdGlvbiBkZWZpbmVSZWFjdGl2ZSQkMSAoXG4gIG9iaixcbiAga2V5LFxuICB2YWwsXG4gIGN1c3RvbVNldHRlcixcbiAgc2hhbGxvd1xuKSB7XG4gIHZhciBkZXAgPSBuZXcgRGVwKCk7XG5cbiAgdmFyIHByb3BlcnR5ID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSk7XG4gIGlmIChwcm9wZXJ0eSAmJiBwcm9wZXJ0eS5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBjYXRlciBmb3IgcHJlLWRlZmluZWQgZ2V0dGVyL3NldHRlcnNcbiAgdmFyIGdldHRlciA9IHByb3BlcnR5ICYmIHByb3BlcnR5LmdldDtcbiAgdmFyIHNldHRlciA9IHByb3BlcnR5ICYmIHByb3BlcnR5LnNldDtcbiAgaWYgKCghZ2V0dGVyIHx8IHNldHRlcikgJiYgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIHZhbCA9IG9ialtrZXldO1xuICB9XG5cbiAgdmFyIGNoaWxkT2IgPSAhc2hhbGxvdyAmJiBvYnNlcnZlKHZhbCk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gcmVhY3RpdmVHZXR0ZXIgKCkge1xuICAgICAgdmFyIHZhbHVlID0gZ2V0dGVyID8gZ2V0dGVyLmNhbGwob2JqKSA6IHZhbDtcbiAgICAgIGlmIChEZXAuU2hhcmVkT2JqZWN0LnRhcmdldCkgeyAvLyBmaXhlZCBieSB4eHh4eHhcbiAgICAgICAgZGVwLmRlcGVuZCgpO1xuICAgICAgICBpZiAoY2hpbGRPYikge1xuICAgICAgICAgIGNoaWxkT2IuZGVwLmRlcGVuZCgpO1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgZGVwZW5kQXJyYXkodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlU2V0dGVyIChuZXdWYWwpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGdldHRlciA/IGdldHRlci5jYWxsKG9iaikgOiB2YWw7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1zZWxmLWNvbXBhcmUgKi9cbiAgICAgIGlmIChuZXdWYWwgPT09IHZhbHVlIHx8IChuZXdWYWwgIT09IG5ld1ZhbCAmJiB2YWx1ZSAhPT0gdmFsdWUpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUgKi9cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIGN1c3RvbVNldHRlcikge1xuICAgICAgICBjdXN0b21TZXR0ZXIoKTtcbiAgICAgIH1cbiAgICAgIC8vICM3OTgxOiBmb3IgYWNjZXNzb3IgcHJvcGVydGllcyB3aXRob3V0IHNldHRlclxuICAgICAgaWYgKGdldHRlciAmJiAhc2V0dGVyKSB7IHJldHVybiB9XG4gICAgICBpZiAoc2V0dGVyKSB7XG4gICAgICAgIHNldHRlci5jYWxsKG9iaiwgbmV3VmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IG5ld1ZhbDtcbiAgICAgIH1cbiAgICAgIGNoaWxkT2IgPSAhc2hhbGxvdyAmJiBvYnNlcnZlKG5ld1ZhbCk7XG4gICAgICBkZXAubm90aWZ5KCk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBTZXQgYSBwcm9wZXJ0eSBvbiBhbiBvYmplY3QuIEFkZHMgdGhlIG5ldyBwcm9wZXJ0eSBhbmRcbiAqIHRyaWdnZXJzIGNoYW5nZSBub3RpZmljYXRpb24gaWYgdGhlIHByb3BlcnR5IGRvZXNuJ3RcbiAqIGFscmVhZHkgZXhpc3QuXG4gKi9cbmZ1bmN0aW9uIHNldCAodGFyZ2V0LCBrZXksIHZhbCkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJlxuICAgIChpc1VuZGVmKHRhcmdldCkgfHwgaXNQcmltaXRpdmUodGFyZ2V0KSlcbiAgKSB7XG4gICAgd2FybigoXCJDYW5ub3Qgc2V0IHJlYWN0aXZlIHByb3BlcnR5IG9uIHVuZGVmaW5lZCwgbnVsbCwgb3IgcHJpbWl0aXZlIHZhbHVlOiBcIiArICgodGFyZ2V0KSkpKTtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmIGlzVmFsaWRBcnJheUluZGV4KGtleSkpIHtcbiAgICB0YXJnZXQubGVuZ3RoID0gTWF0aC5tYXgodGFyZ2V0Lmxlbmd0aCwga2V5KTtcbiAgICB0YXJnZXQuc3BsaWNlKGtleSwgMSwgdmFsKTtcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgaWYgKGtleSBpbiB0YXJnZXQgJiYgIShrZXkgaW4gT2JqZWN0LnByb3RvdHlwZSkpIHtcbiAgICB0YXJnZXRba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgdmFyIG9iID0gKHRhcmdldCkuX19vYl9fO1xuICBpZiAodGFyZ2V0Ll9pc1Z1ZSB8fCAob2IgJiYgb2Iudm1Db3VudCkpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXG4gICAgICAnQXZvaWQgYWRkaW5nIHJlYWN0aXZlIHByb3BlcnRpZXMgdG8gYSBWdWUgaW5zdGFuY2Ugb3IgaXRzIHJvb3QgJGRhdGEgJyArXG4gICAgICAnYXQgcnVudGltZSAtIGRlY2xhcmUgaXQgdXBmcm9udCBpbiB0aGUgZGF0YSBvcHRpb24uJ1xuICAgICk7XG4gICAgcmV0dXJuIHZhbFxuICB9XG4gIGlmICghb2IpIHtcbiAgICB0YXJnZXRba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgZGVmaW5lUmVhY3RpdmUkJDEob2IudmFsdWUsIGtleSwgdmFsKTtcbiAgb2IuZGVwLm5vdGlmeSgpO1xuICByZXR1cm4gdmFsXG59XG5cbi8qKlxuICogRGVsZXRlIGEgcHJvcGVydHkgYW5kIHRyaWdnZXIgY2hhbmdlIGlmIG5lY2Vzc2FyeS5cbiAqL1xuZnVuY3Rpb24gZGVsICh0YXJnZXQsIGtleSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJlxuICAgIChpc1VuZGVmKHRhcmdldCkgfHwgaXNQcmltaXRpdmUodGFyZ2V0KSlcbiAgKSB7XG4gICAgd2FybigoXCJDYW5ub3QgZGVsZXRlIHJlYWN0aXZlIHByb3BlcnR5IG9uIHVuZGVmaW5lZCwgbnVsbCwgb3IgcHJpbWl0aXZlIHZhbHVlOiBcIiArICgodGFyZ2V0KSkpKTtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmIGlzVmFsaWRBcnJheUluZGV4KGtleSkpIHtcbiAgICB0YXJnZXQuc3BsaWNlKGtleSwgMSk7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIG9iID0gKHRhcmdldCkuX19vYl9fO1xuICBpZiAodGFyZ2V0Ll9pc1Z1ZSB8fCAob2IgJiYgb2Iudm1Db3VudCkpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXG4gICAgICAnQXZvaWQgZGVsZXRpbmcgcHJvcGVydGllcyBvbiBhIFZ1ZSBpbnN0YW5jZSBvciBpdHMgcm9vdCAkZGF0YSAnICtcbiAgICAgICctIGp1c3Qgc2V0IGl0IHRvIG51bGwuJ1xuICAgICk7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKCFoYXNPd24odGFyZ2V0LCBrZXkpKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgZGVsZXRlIHRhcmdldFtrZXldO1xuICBpZiAoIW9iKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgb2IuZGVwLm5vdGlmeSgpO1xufVxuXG4vKipcbiAqIENvbGxlY3QgZGVwZW5kZW5jaWVzIG9uIGFycmF5IGVsZW1lbnRzIHdoZW4gdGhlIGFycmF5IGlzIHRvdWNoZWQsIHNpbmNlXG4gKiB3ZSBjYW5ub3QgaW50ZXJjZXB0IGFycmF5IGVsZW1lbnQgYWNjZXNzIGxpa2UgcHJvcGVydHkgZ2V0dGVycy5cbiAqL1xuZnVuY3Rpb24gZGVwZW5kQXJyYXkgKHZhbHVlKSB7XG4gIGZvciAodmFyIGUgPSAodm9pZCAwKSwgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBlID0gdmFsdWVbaV07XG4gICAgZSAmJiBlLl9fb2JfXyAmJiBlLl9fb2JfXy5kZXAuZGVwZW5kKCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZSkpIHtcbiAgICAgIGRlcGVuZEFycmF5KGUpO1xuICAgIH1cbiAgfVxufVxuXG4vKiAgKi9cblxuLyoqXG4gKiBPcHRpb24gb3ZlcndyaXRpbmcgc3RyYXRlZ2llcyBhcmUgZnVuY3Rpb25zIHRoYXQgaGFuZGxlXG4gKiBob3cgdG8gbWVyZ2UgYSBwYXJlbnQgb3B0aW9uIHZhbHVlIGFuZCBhIGNoaWxkIG9wdGlvblxuICogdmFsdWUgaW50byB0aGUgZmluYWwgdmFsdWUuXG4gKi9cbnZhciBzdHJhdHMgPSBjb25maWcub3B0aW9uTWVyZ2VTdHJhdGVnaWVzO1xuXG4vKipcbiAqIE9wdGlvbnMgd2l0aCByZXN0cmljdGlvbnNcbiAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgc3RyYXRzLmVsID0gc3RyYXRzLnByb3BzRGF0YSA9IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkLCB2bSwga2V5KSB7XG4gICAgaWYgKCF2bSkge1xuICAgICAgd2FybihcbiAgICAgICAgXCJvcHRpb24gXFxcIlwiICsga2V5ICsgXCJcXFwiIGNhbiBvbmx5IGJlIHVzZWQgZHVyaW5nIGluc3RhbmNlIFwiICtcbiAgICAgICAgJ2NyZWF0aW9uIHdpdGggdGhlIGBuZXdgIGtleXdvcmQuJ1xuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRTdHJhdChwYXJlbnQsIGNoaWxkKVxuICB9O1xufVxuXG4vKipcbiAqIEhlbHBlciB0aGF0IHJlY3Vyc2l2ZWx5IG1lcmdlcyB0d28gZGF0YSBvYmplY3RzIHRvZ2V0aGVyLlxuICovXG5mdW5jdGlvbiBtZXJnZURhdGEgKHRvLCBmcm9tKSB7XG4gIGlmICghZnJvbSkgeyByZXR1cm4gdG8gfVxuICB2YXIga2V5LCB0b1ZhbCwgZnJvbVZhbDtcblxuICB2YXIga2V5cyA9IGhhc1N5bWJvbFxuICAgID8gUmVmbGVjdC5vd25LZXlzKGZyb20pXG4gICAgOiBPYmplY3Qua2V5cyhmcm9tKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBrZXkgPSBrZXlzW2ldO1xuICAgIC8vIGluIGNhc2UgdGhlIG9iamVjdCBpcyBhbHJlYWR5IG9ic2VydmVkLi4uXG4gICAgaWYgKGtleSA9PT0gJ19fb2JfXycpIHsgY29udGludWUgfVxuICAgIHRvVmFsID0gdG9ba2V5XTtcbiAgICBmcm9tVmFsID0gZnJvbVtrZXldO1xuICAgIGlmICghaGFzT3duKHRvLCBrZXkpKSB7XG4gICAgICBzZXQodG8sIGtleSwgZnJvbVZhbCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRvVmFsICE9PSBmcm9tVmFsICYmXG4gICAgICBpc1BsYWluT2JqZWN0KHRvVmFsKSAmJlxuICAgICAgaXNQbGFpbk9iamVjdChmcm9tVmFsKVxuICAgICkge1xuICAgICAgbWVyZ2VEYXRhKHRvVmFsLCBmcm9tVmFsKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvXG59XG5cbi8qKlxuICogRGF0YVxuICovXG5mdW5jdGlvbiBtZXJnZURhdGFPckZuIChcbiAgcGFyZW50VmFsLFxuICBjaGlsZFZhbCxcbiAgdm1cbikge1xuICBpZiAoIXZtKSB7XG4gICAgLy8gaW4gYSBWdWUuZXh0ZW5kIG1lcmdlLCBib3RoIHNob3VsZCBiZSBmdW5jdGlvbnNcbiAgICBpZiAoIWNoaWxkVmFsKSB7XG4gICAgICByZXR1cm4gcGFyZW50VmFsXG4gICAgfVxuICAgIGlmICghcGFyZW50VmFsKSB7XG4gICAgICByZXR1cm4gY2hpbGRWYWxcbiAgICB9XG4gICAgLy8gd2hlbiBwYXJlbnRWYWwgJiBjaGlsZFZhbCBhcmUgYm90aCBwcmVzZW50LFxuICAgIC8vIHdlIG5lZWQgdG8gcmV0dXJuIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAgIC8vIG1lcmdlZCByZXN1bHQgb2YgYm90aCBmdW5jdGlvbnMuLi4gbm8gbmVlZCB0b1xuICAgIC8vIGNoZWNrIGlmIHBhcmVudFZhbCBpcyBhIGZ1bmN0aW9uIGhlcmUgYmVjYXVzZVxuICAgIC8vIGl0IGhhcyB0byBiZSBhIGZ1bmN0aW9uIHRvIHBhc3MgcHJldmlvdXMgbWVyZ2VzLlxuICAgIHJldHVybiBmdW5jdGlvbiBtZXJnZWREYXRhRm4gKCkge1xuICAgICAgcmV0dXJuIG1lcmdlRGF0YShcbiAgICAgICAgdHlwZW9mIGNoaWxkVmFsID09PSAnZnVuY3Rpb24nID8gY2hpbGRWYWwuY2FsbCh0aGlzLCB0aGlzKSA6IGNoaWxkVmFsLFxuICAgICAgICB0eXBlb2YgcGFyZW50VmFsID09PSAnZnVuY3Rpb24nID8gcGFyZW50VmFsLmNhbGwodGhpcywgdGhpcykgOiBwYXJlbnRWYWxcbiAgICAgIClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZEluc3RhbmNlRGF0YUZuICgpIHtcbiAgICAgIC8vIGluc3RhbmNlIG1lcmdlXG4gICAgICB2YXIgaW5zdGFuY2VEYXRhID0gdHlwZW9mIGNoaWxkVmFsID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gY2hpbGRWYWwuY2FsbCh2bSwgdm0pXG4gICAgICAgIDogY2hpbGRWYWw7XG4gICAgICB2YXIgZGVmYXVsdERhdGEgPSB0eXBlb2YgcGFyZW50VmFsID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gcGFyZW50VmFsLmNhbGwodm0sIHZtKVxuICAgICAgICA6IHBhcmVudFZhbDtcbiAgICAgIGlmIChpbnN0YW5jZURhdGEpIHtcbiAgICAgICAgcmV0dXJuIG1lcmdlRGF0YShpbnN0YW5jZURhdGEsIGRlZmF1bHREYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHREYXRhXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnN0cmF0cy5kYXRhID0gZnVuY3Rpb24gKFxuICBwYXJlbnRWYWwsXG4gIGNoaWxkVmFsLFxuICB2bVxuKSB7XG4gIGlmICghdm0pIHtcbiAgICBpZiAoY2hpbGRWYWwgJiYgdHlwZW9mIGNoaWxkVmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXG4gICAgICAgICdUaGUgXCJkYXRhXCIgb3B0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uICcgK1xuICAgICAgICAndGhhdCByZXR1cm5zIGEgcGVyLWluc3RhbmNlIHZhbHVlIGluIGNvbXBvbmVudCAnICtcbiAgICAgICAgJ2RlZmluaXRpb25zLicsXG4gICAgICAgIHZtXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gcGFyZW50VmFsXG4gICAgfVxuICAgIHJldHVybiBtZXJnZURhdGFPckZuKHBhcmVudFZhbCwgY2hpbGRWYWwpXG4gIH1cblxuICByZXR1cm4gbWVyZ2VEYXRhT3JGbihwYXJlbnRWYWwsIGNoaWxkVmFsLCB2bSlcbn07XG5cbi8qKlxuICogSG9va3MgYW5kIHByb3BzIGFyZSBtZXJnZWQgYXMgYXJyYXlzLlxuICovXG5mdW5jdGlvbiBtZXJnZUhvb2sgKFxuICBwYXJlbnRWYWwsXG4gIGNoaWxkVmFsXG4pIHtcbiAgdmFyIHJlcyA9IGNoaWxkVmFsXG4gICAgPyBwYXJlbnRWYWxcbiAgICAgID8gcGFyZW50VmFsLmNvbmNhdChjaGlsZFZhbClcbiAgICAgIDogQXJyYXkuaXNBcnJheShjaGlsZFZhbClcbiAgICAgICAgPyBjaGlsZFZhbFxuICAgICAgICA6IFtjaGlsZFZhbF1cbiAgICA6IHBhcmVudFZhbDtcbiAgcmV0dXJuIHJlc1xuICAgID8gZGVkdXBlSG9va3MocmVzKVxuICAgIDogcmVzXG59XG5cbmZ1bmN0aW9uIGRlZHVwZUhvb2tzIChob29rcykge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaG9va3MubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocmVzLmluZGV4T2YoaG9va3NbaV0pID09PSAtMSkge1xuICAgICAgcmVzLnB1c2goaG9va3NbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkxJRkVDWUNMRV9IT09LUy5mb3JFYWNoKGZ1bmN0aW9uIChob29rKSB7XG4gIHN0cmF0c1tob29rXSA9IG1lcmdlSG9vaztcbn0pO1xuXG4vKipcbiAqIEFzc2V0c1xuICpcbiAqIFdoZW4gYSB2bSBpcyBwcmVzZW50IChpbnN0YW5jZSBjcmVhdGlvbiksIHdlIG5lZWQgdG8gZG9cbiAqIGEgdGhyZWUtd2F5IG1lcmdlIGJldHdlZW4gY29uc3RydWN0b3Igb3B0aW9ucywgaW5zdGFuY2VcbiAqIG9wdGlvbnMgYW5kIHBhcmVudCBvcHRpb25zLlxuICovXG5mdW5jdGlvbiBtZXJnZUFzc2V0cyAoXG4gIHBhcmVudFZhbCxcbiAgY2hpbGRWYWwsXG4gIHZtLFxuICBrZXlcbikge1xuICB2YXIgcmVzID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRWYWwgfHwgbnVsbCk7XG4gIGlmIChjaGlsZFZhbCkge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgYXNzZXJ0T2JqZWN0VHlwZShrZXksIGNoaWxkVmFsLCB2bSk7XG4gICAgcmV0dXJuIGV4dGVuZChyZXMsIGNoaWxkVmFsKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiByZXNcbiAgfVxufVxuXG5BU1NFVF9UWVBFUy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gIHN0cmF0c1t0eXBlICsgJ3MnXSA9IG1lcmdlQXNzZXRzO1xufSk7XG5cbi8qKlxuICogV2F0Y2hlcnMuXG4gKlxuICogV2F0Y2hlcnMgaGFzaGVzIHNob3VsZCBub3Qgb3ZlcndyaXRlIG9uZVxuICogYW5vdGhlciwgc28gd2UgbWVyZ2UgdGhlbSBhcyBhcnJheXMuXG4gKi9cbnN0cmF0cy53YXRjaCA9IGZ1bmN0aW9uIChcbiAgcGFyZW50VmFsLFxuICBjaGlsZFZhbCxcbiAgdm0sXG4gIGtleVxuKSB7XG4gIC8vIHdvcmsgYXJvdW5kIEZpcmVmb3gncyBPYmplY3QucHJvdG90eXBlLndhdGNoLi4uXG4gIGlmIChwYXJlbnRWYWwgPT09IG5hdGl2ZVdhdGNoKSB7IHBhcmVudFZhbCA9IHVuZGVmaW5lZDsgfVxuICBpZiAoY2hpbGRWYWwgPT09IG5hdGl2ZVdhdGNoKSB7IGNoaWxkVmFsID0gdW5kZWZpbmVkOyB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoIWNoaWxkVmFsKSB7IHJldHVybiBPYmplY3QuY3JlYXRlKHBhcmVudFZhbCB8fCBudWxsKSB9XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgYXNzZXJ0T2JqZWN0VHlwZShrZXksIGNoaWxkVmFsLCB2bSk7XG4gIH1cbiAgaWYgKCFwYXJlbnRWYWwpIHsgcmV0dXJuIGNoaWxkVmFsIH1cbiAgdmFyIHJldCA9IHt9O1xuICBleHRlbmQocmV0LCBwYXJlbnRWYWwpO1xuICBmb3IgKHZhciBrZXkkMSBpbiBjaGlsZFZhbCkge1xuICAgIHZhciBwYXJlbnQgPSByZXRba2V5JDFdO1xuICAgIHZhciBjaGlsZCA9IGNoaWxkVmFsW2tleSQxXTtcbiAgICBpZiAocGFyZW50ICYmICFBcnJheS5pc0FycmF5KHBhcmVudCkpIHtcbiAgICAgIHBhcmVudCA9IFtwYXJlbnRdO1xuICAgIH1cbiAgICByZXRba2V5JDFdID0gcGFyZW50XG4gICAgICA/IHBhcmVudC5jb25jYXQoY2hpbGQpXG4gICAgICA6IEFycmF5LmlzQXJyYXkoY2hpbGQpID8gY2hpbGQgOiBbY2hpbGRdO1xuICB9XG4gIHJldHVybiByZXRcbn07XG5cbi8qKlxuICogT3RoZXIgb2JqZWN0IGhhc2hlcy5cbiAqL1xuc3RyYXRzLnByb3BzID1cbnN0cmF0cy5tZXRob2RzID1cbnN0cmF0cy5pbmplY3QgPVxuc3RyYXRzLmNvbXB1dGVkID0gZnVuY3Rpb24gKFxuICBwYXJlbnRWYWwsXG4gIGNoaWxkVmFsLFxuICB2bSxcbiAga2V5XG4pIHtcbiAgaWYgKGNoaWxkVmFsICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBhc3NlcnRPYmplY3RUeXBlKGtleSwgY2hpbGRWYWwsIHZtKTtcbiAgfVxuICBpZiAoIXBhcmVudFZhbCkgeyByZXR1cm4gY2hpbGRWYWwgfVxuICB2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZXh0ZW5kKHJldCwgcGFyZW50VmFsKTtcbiAgaWYgKGNoaWxkVmFsKSB7IGV4dGVuZChyZXQsIGNoaWxkVmFsKTsgfVxuICByZXR1cm4gcmV0XG59O1xuc3RyYXRzLnByb3ZpZGUgPSBtZXJnZURhdGFPckZuO1xuXG4vKipcbiAqIERlZmF1bHQgc3RyYXRlZ3kuXG4gKi9cbnZhciBkZWZhdWx0U3RyYXQgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICByZXR1cm4gY2hpbGRWYWwgPT09IHVuZGVmaW5lZFxuICAgID8gcGFyZW50VmFsXG4gICAgOiBjaGlsZFZhbFxufTtcblxuLyoqXG4gKiBWYWxpZGF0ZSBjb21wb25lbnQgbmFtZXNcbiAqL1xuZnVuY3Rpb24gY2hlY2tDb21wb25lbnRzIChvcHRpb25zKSB7XG4gIGZvciAodmFyIGtleSBpbiBvcHRpb25zLmNvbXBvbmVudHMpIHtcbiAgICB2YWxpZGF0ZUNvbXBvbmVudE5hbWUoa2V5KTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUNvbXBvbmVudE5hbWUgKG5hbWUpIHtcbiAgaWYgKCFuZXcgUmVnRXhwKChcIl5bYS16QS1aXVtcXFxcLVxcXFwuMC05X1wiICsgKHVuaWNvZGVSZWdFeHAuc291cmNlKSArIFwiXSokXCIpKS50ZXN0KG5hbWUpKSB7XG4gICAgd2FybihcbiAgICAgICdJbnZhbGlkIGNvbXBvbmVudCBuYW1lOiBcIicgKyBuYW1lICsgJ1wiLiBDb21wb25lbnQgbmFtZXMgJyArXG4gICAgICAnc2hvdWxkIGNvbmZvcm0gdG8gdmFsaWQgY3VzdG9tIGVsZW1lbnQgbmFtZSBpbiBodG1sNSBzcGVjaWZpY2F0aW9uLidcbiAgICApO1xuICB9XG4gIGlmIChpc0J1aWx0SW5UYWcobmFtZSkgfHwgY29uZmlnLmlzUmVzZXJ2ZWRUYWcobmFtZSkpIHtcbiAgICB3YXJuKFxuICAgICAgJ0RvIG5vdCB1c2UgYnVpbHQtaW4gb3IgcmVzZXJ2ZWQgSFRNTCBlbGVtZW50cyBhcyBjb21wb25lbnQgJyArXG4gICAgICAnaWQ6ICcgKyBuYW1lXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIEVuc3VyZSBhbGwgcHJvcHMgb3B0aW9uIHN5bnRheCBhcmUgbm9ybWFsaXplZCBpbnRvIHRoZVxuICogT2JqZWN0LWJhc2VkIGZvcm1hdC5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplUHJvcHMgKG9wdGlvbnMsIHZtKSB7XG4gIHZhciBwcm9wcyA9IG9wdGlvbnMucHJvcHM7XG4gIGlmICghcHJvcHMpIHsgcmV0dXJuIH1cbiAgdmFyIHJlcyA9IHt9O1xuICB2YXIgaSwgdmFsLCBuYW1lO1xuICBpZiAoQXJyYXkuaXNBcnJheShwcm9wcykpIHtcbiAgICBpID0gcHJvcHMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhbCA9IHByb3BzW2ldO1xuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG5hbWUgPSBjYW1lbGl6ZSh2YWwpO1xuICAgICAgICByZXNbbmFtZV0gPSB7IHR5cGU6IG51bGwgfTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB3YXJuKCdwcm9wcyBtdXN0IGJlIHN0cmluZ3Mgd2hlbiB1c2luZyBhcnJheSBzeW50YXguJyk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QocHJvcHMpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XG4gICAgICB2YWwgPSBwcm9wc1trZXldO1xuICAgICAgbmFtZSA9IGNhbWVsaXplKGtleSk7XG4gICAgICByZXNbbmFtZV0gPSBpc1BsYWluT2JqZWN0KHZhbClcbiAgICAgICAgPyB2YWxcbiAgICAgICAgOiB7IHR5cGU6IHZhbCB9O1xuICAgIH1cbiAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgd2FybihcbiAgICAgIFwiSW52YWxpZCB2YWx1ZSBmb3Igb3B0aW9uIFxcXCJwcm9wc1xcXCI6IGV4cGVjdGVkIGFuIEFycmF5IG9yIGFuIE9iamVjdCwgXCIgK1xuICAgICAgXCJidXQgZ290IFwiICsgKHRvUmF3VHlwZShwcm9wcykpICsgXCIuXCIsXG4gICAgICB2bVxuICAgICk7XG4gIH1cbiAgb3B0aW9ucy5wcm9wcyA9IHJlcztcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgYWxsIGluamVjdGlvbnMgaW50byBPYmplY3QtYmFzZWQgZm9ybWF0XG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUluamVjdCAob3B0aW9ucywgdm0pIHtcbiAgdmFyIGluamVjdCA9IG9wdGlvbnMuaW5qZWN0O1xuICBpZiAoIWluamVjdCkgeyByZXR1cm4gfVxuICB2YXIgbm9ybWFsaXplZCA9IG9wdGlvbnMuaW5qZWN0ID0ge307XG4gIGlmIChBcnJheS5pc0FycmF5KGluamVjdCkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGluamVjdC5sZW5ndGg7IGkrKykge1xuICAgICAgbm9ybWFsaXplZFtpbmplY3RbaV1dID0geyBmcm9tOiBpbmplY3RbaV0gfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdChpbmplY3QpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGluamVjdCkge1xuICAgICAgdmFyIHZhbCA9IGluamVjdFtrZXldO1xuICAgICAgbm9ybWFsaXplZFtrZXldID0gaXNQbGFpbk9iamVjdCh2YWwpXG4gICAgICAgID8gZXh0ZW5kKHsgZnJvbToga2V5IH0sIHZhbClcbiAgICAgICAgOiB7IGZyb206IHZhbCB9O1xuICAgIH1cbiAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgd2FybihcbiAgICAgIFwiSW52YWxpZCB2YWx1ZSBmb3Igb3B0aW9uIFxcXCJpbmplY3RcXFwiOiBleHBlY3RlZCBhbiBBcnJheSBvciBhbiBPYmplY3QsIFwiICtcbiAgICAgIFwiYnV0IGdvdCBcIiArICh0b1Jhd1R5cGUoaW5qZWN0KSkgKyBcIi5cIixcbiAgICAgIHZtXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSByYXcgZnVuY3Rpb24gZGlyZWN0aXZlcyBpbnRvIG9iamVjdCBmb3JtYXQuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZURpcmVjdGl2ZXMgKG9wdGlvbnMpIHtcbiAgdmFyIGRpcnMgPSBvcHRpb25zLmRpcmVjdGl2ZXM7XG4gIGlmIChkaXJzKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGRpcnMpIHtcbiAgICAgIHZhciBkZWYkJDEgPSBkaXJzW2tleV07XG4gICAgICBpZiAodHlwZW9mIGRlZiQkMSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkaXJzW2tleV0gPSB7IGJpbmQ6IGRlZiQkMSwgdXBkYXRlOiBkZWYkJDEgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0T2JqZWN0VHlwZSAobmFtZSwgdmFsdWUsIHZtKSB7XG4gIGlmICghaXNQbGFpbk9iamVjdCh2YWx1ZSkpIHtcbiAgICB3YXJuKFxuICAgICAgXCJJbnZhbGlkIHZhbHVlIGZvciBvcHRpb24gXFxcIlwiICsgbmFtZSArIFwiXFxcIjogZXhwZWN0ZWQgYW4gT2JqZWN0LCBcIiArXG4gICAgICBcImJ1dCBnb3QgXCIgKyAodG9SYXdUeXBlKHZhbHVlKSkgKyBcIi5cIixcbiAgICAgIHZtXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlIHR3byBvcHRpb24gb2JqZWN0cyBpbnRvIGEgbmV3IG9uZS5cbiAqIENvcmUgdXRpbGl0eSB1c2VkIGluIGJvdGggaW5zdGFudGlhdGlvbiBhbmQgaW5oZXJpdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlT3B0aW9ucyAoXG4gIHBhcmVudCxcbiAgY2hpbGQsXG4gIHZtXG4pIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBjaGVja0NvbXBvbmVudHMoY2hpbGQpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNoaWxkID0gY2hpbGQub3B0aW9ucztcbiAgfVxuXG4gIG5vcm1hbGl6ZVByb3BzKGNoaWxkLCB2bSk7XG4gIG5vcm1hbGl6ZUluamVjdChjaGlsZCwgdm0pO1xuICBub3JtYWxpemVEaXJlY3RpdmVzKGNoaWxkKTtcblxuICAvLyBBcHBseSBleHRlbmRzIGFuZCBtaXhpbnMgb24gdGhlIGNoaWxkIG9wdGlvbnMsXG4gIC8vIGJ1dCBvbmx5IGlmIGl0IGlzIGEgcmF3IG9wdGlvbnMgb2JqZWN0IHRoYXQgaXNuJ3RcbiAgLy8gdGhlIHJlc3VsdCBvZiBhbm90aGVyIG1lcmdlT3B0aW9ucyBjYWxsLlxuICAvLyBPbmx5IG1lcmdlZCBvcHRpb25zIGhhcyB0aGUgX2Jhc2UgcHJvcGVydHkuXG4gIGlmICghY2hpbGQuX2Jhc2UpIHtcbiAgICBpZiAoY2hpbGQuZXh0ZW5kcykge1xuICAgICAgcGFyZW50ID0gbWVyZ2VPcHRpb25zKHBhcmVudCwgY2hpbGQuZXh0ZW5kcywgdm0pO1xuICAgIH1cbiAgICBpZiAoY2hpbGQubWl4aW5zKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkLm1peGlucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgcGFyZW50ID0gbWVyZ2VPcHRpb25zKHBhcmVudCwgY2hpbGQubWl4aW5zW2ldLCB2bSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gcGFyZW50KSB7XG4gICAgbWVyZ2VGaWVsZChrZXkpO1xuICB9XG4gIGZvciAoa2V5IGluIGNoaWxkKSB7XG4gICAgaWYgKCFoYXNPd24ocGFyZW50LCBrZXkpKSB7XG4gICAgICBtZXJnZUZpZWxkKGtleSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1lcmdlRmllbGQgKGtleSkge1xuICAgIHZhciBzdHJhdCA9IHN0cmF0c1trZXldIHx8IGRlZmF1bHRTdHJhdDtcbiAgICBvcHRpb25zW2tleV0gPSBzdHJhdChwYXJlbnRba2V5XSwgY2hpbGRba2V5XSwgdm0sIGtleSk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnNcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGFuIGFzc2V0LlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGJlY2F1c2UgY2hpbGQgaW5zdGFuY2VzIG5lZWQgYWNjZXNzXG4gKiB0byBhc3NldHMgZGVmaW5lZCBpbiBpdHMgYW5jZXN0b3IgY2hhaW4uXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVBc3NldCAoXG4gIG9wdGlvbnMsXG4gIHR5cGUsXG4gIGlkLFxuICB3YXJuTWlzc2luZ1xuKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIGlkICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVyblxuICB9XG4gIHZhciBhc3NldHMgPSBvcHRpb25zW3R5cGVdO1xuICAvLyBjaGVjayBsb2NhbCByZWdpc3RyYXRpb24gdmFyaWF0aW9ucyBmaXJzdFxuICBpZiAoaGFzT3duKGFzc2V0cywgaWQpKSB7IHJldHVybiBhc3NldHNbaWRdIH1cbiAgdmFyIGNhbWVsaXplZElkID0gY2FtZWxpemUoaWQpO1xuICBpZiAoaGFzT3duKGFzc2V0cywgY2FtZWxpemVkSWQpKSB7IHJldHVybiBhc3NldHNbY2FtZWxpemVkSWRdIH1cbiAgdmFyIFBhc2NhbENhc2VJZCA9IGNhcGl0YWxpemUoY2FtZWxpemVkSWQpO1xuICBpZiAoaGFzT3duKGFzc2V0cywgUGFzY2FsQ2FzZUlkKSkgeyByZXR1cm4gYXNzZXRzW1Bhc2NhbENhc2VJZF0gfVxuICAvLyBmYWxsYmFjayB0byBwcm90b3R5cGUgY2hhaW5cbiAgdmFyIHJlcyA9IGFzc2V0c1tpZF0gfHwgYXNzZXRzW2NhbWVsaXplZElkXSB8fCBhc3NldHNbUGFzY2FsQ2FzZUlkXTtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2Fybk1pc3NpbmcgJiYgIXJlcykge1xuICAgIHdhcm4oXG4gICAgICAnRmFpbGVkIHRvIHJlc29sdmUgJyArIHR5cGUuc2xpY2UoMCwgLTEpICsgJzogJyArIGlkLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG4vKiAgKi9cblxuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcCAoXG4gIGtleSxcbiAgcHJvcE9wdGlvbnMsXG4gIHByb3BzRGF0YSxcbiAgdm1cbikge1xuICB2YXIgcHJvcCA9IHByb3BPcHRpb25zW2tleV07XG4gIHZhciBhYnNlbnQgPSAhaGFzT3duKHByb3BzRGF0YSwga2V5KTtcbiAgdmFyIHZhbHVlID0gcHJvcHNEYXRhW2tleV07XG4gIC8vIGJvb2xlYW4gY2FzdGluZ1xuICB2YXIgYm9vbGVhbkluZGV4ID0gZ2V0VHlwZUluZGV4KEJvb2xlYW4sIHByb3AudHlwZSk7XG4gIGlmIChib29sZWFuSW5kZXggPiAtMSkge1xuICAgIGlmIChhYnNlbnQgJiYgIWhhc093bihwcm9wLCAnZGVmYXVsdCcpKSB7XG4gICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSBoeXBoZW5hdGUoa2V5KSkge1xuICAgICAgLy8gb25seSBjYXN0IGVtcHR5IHN0cmluZyAvIHNhbWUgbmFtZSB0byBib29sZWFuIGlmXG4gICAgICAvLyBib29sZWFuIGhhcyBoaWdoZXIgcHJpb3JpdHlcbiAgICAgIHZhciBzdHJpbmdJbmRleCA9IGdldFR5cGVJbmRleChTdHJpbmcsIHByb3AudHlwZSk7XG4gICAgICBpZiAoc3RyaW5nSW5kZXggPCAwIHx8IGJvb2xlYW5JbmRleCA8IHN0cmluZ0luZGV4KSB7XG4gICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gY2hlY2sgZGVmYXVsdCB2YWx1ZVxuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhbHVlID0gZ2V0UHJvcERlZmF1bHRWYWx1ZSh2bSwgcHJvcCwga2V5KTtcbiAgICAvLyBzaW5jZSB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBhIGZyZXNoIGNvcHksXG4gICAgLy8gbWFrZSBzdXJlIHRvIG9ic2VydmUgaXQuXG4gICAgdmFyIHByZXZTaG91bGRPYnNlcnZlID0gc2hvdWxkT2JzZXJ2ZTtcbiAgICB0b2dnbGVPYnNlcnZpbmcodHJ1ZSk7XG4gICAgb2JzZXJ2ZSh2YWx1ZSk7XG4gICAgdG9nZ2xlT2JzZXJ2aW5nKHByZXZTaG91bGRPYnNlcnZlKTtcbiAgfVxuICBpZiAoXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJlxuICAgIC8vIHNraXAgdmFsaWRhdGlvbiBmb3Igd2VleCByZWN5Y2xlLWxpc3QgY2hpbGQgY29tcG9uZW50IHByb3BzXG4gICAgIShmYWxzZSlcbiAgKSB7XG4gICAgYXNzZXJ0UHJvcChwcm9wLCBrZXksIHZhbHVlLCB2bSwgYWJzZW50KTtcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGRlZmF1bHQgdmFsdWUgb2YgYSBwcm9wLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wRGVmYXVsdFZhbHVlICh2bSwgcHJvcCwga2V5KSB7XG4gIC8vIG5vIGRlZmF1bHQsIHJldHVybiB1bmRlZmluZWRcbiAgaWYgKCFoYXNPd24ocHJvcCwgJ2RlZmF1bHQnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuICB2YXIgZGVmID0gcHJvcC5kZWZhdWx0O1xuICAvLyB3YXJuIGFnYWluc3Qgbm9uLWZhY3RvcnkgZGVmYXVsdHMgZm9yIE9iamVjdCAmIEFycmF5XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIGlzT2JqZWN0KGRlZikpIHtcbiAgICB3YXJuKFxuICAgICAgJ0ludmFsaWQgZGVmYXVsdCB2YWx1ZSBmb3IgcHJvcCBcIicgKyBrZXkgKyAnXCI6ICcgK1xuICAgICAgJ1Byb3BzIHdpdGggdHlwZSBPYmplY3QvQXJyYXkgbXVzdCB1c2UgYSBmYWN0b3J5IGZ1bmN0aW9uICcgK1xuICAgICAgJ3RvIHJldHVybiB0aGUgZGVmYXVsdCB2YWx1ZS4nLFxuICAgICAgdm1cbiAgICApO1xuICB9XG4gIC8vIHRoZSByYXcgcHJvcCB2YWx1ZSB3YXMgYWxzbyB1bmRlZmluZWQgZnJvbSBwcmV2aW91cyByZW5kZXIsXG4gIC8vIHJldHVybiBwcmV2aW91cyBkZWZhdWx0IHZhbHVlIHRvIGF2b2lkIHVubmVjZXNzYXJ5IHdhdGNoZXIgdHJpZ2dlclxuICBpZiAodm0gJiYgdm0uJG9wdGlvbnMucHJvcHNEYXRhICYmXG4gICAgdm0uJG9wdGlvbnMucHJvcHNEYXRhW2tleV0gPT09IHVuZGVmaW5lZCAmJlxuICAgIHZtLl9wcm9wc1trZXldICE9PSB1bmRlZmluZWRcbiAgKSB7XG4gICAgcmV0dXJuIHZtLl9wcm9wc1trZXldXG4gIH1cbiAgLy8gY2FsbCBmYWN0b3J5IGZ1bmN0aW9uIGZvciBub24tRnVuY3Rpb24gdHlwZXNcbiAgLy8gYSB2YWx1ZSBpcyBGdW5jdGlvbiBpZiBpdHMgcHJvdG90eXBlIGlzIGZ1bmN0aW9uIGV2ZW4gYWNyb3NzIGRpZmZlcmVudCBleGVjdXRpb24gY29udGV4dFxuICByZXR1cm4gdHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJyAmJiBnZXRUeXBlKHByb3AudHlwZSkgIT09ICdGdW5jdGlvbidcbiAgICA/IGRlZi5jYWxsKHZtKVxuICAgIDogZGVmXG59XG5cbi8qKlxuICogQXNzZXJ0IHdoZXRoZXIgYSBwcm9wIGlzIHZhbGlkLlxuICovXG5mdW5jdGlvbiBhc3NlcnRQcm9wIChcbiAgcHJvcCxcbiAgbmFtZSxcbiAgdmFsdWUsXG4gIHZtLFxuICBhYnNlbnRcbikge1xuICBpZiAocHJvcC5yZXF1aXJlZCAmJiBhYnNlbnQpIHtcbiAgICB3YXJuKFxuICAgICAgJ01pc3NpbmcgcmVxdWlyZWQgcHJvcDogXCInICsgbmFtZSArICdcIicsXG4gICAgICB2bVxuICAgICk7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgJiYgIXByb3AucmVxdWlyZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdHlwZSA9IHByb3AudHlwZTtcbiAgdmFyIHZhbGlkID0gIXR5cGUgfHwgdHlwZSA9PT0gdHJ1ZTtcbiAgdmFyIGV4cGVjdGVkVHlwZXMgPSBbXTtcbiAgaWYgKHR5cGUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodHlwZSkpIHtcbiAgICAgIHR5cGUgPSBbdHlwZV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZS5sZW5ndGggJiYgIXZhbGlkOyBpKyspIHtcbiAgICAgIHZhciBhc3NlcnRlZFR5cGUgPSBhc3NlcnRUeXBlKHZhbHVlLCB0eXBlW2ldKTtcbiAgICAgIGV4cGVjdGVkVHlwZXMucHVzaChhc3NlcnRlZFR5cGUuZXhwZWN0ZWRUeXBlIHx8ICcnKTtcbiAgICAgIHZhbGlkID0gYXNzZXJ0ZWRUeXBlLnZhbGlkO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdmFsaWQpIHtcbiAgICB3YXJuKFxuICAgICAgZ2V0SW52YWxpZFR5cGVNZXNzYWdlKG5hbWUsIHZhbHVlLCBleHBlY3RlZFR5cGVzKSxcbiAgICAgIHZtXG4gICAgKTtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdmFsaWRhdG9yID0gcHJvcC52YWxpZGF0b3I7XG4gIGlmICh2YWxpZGF0b3IpIHtcbiAgICBpZiAoIXZhbGlkYXRvcih2YWx1ZSkpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgICdJbnZhbGlkIHByb3A6IGN1c3RvbSB2YWxpZGF0b3IgY2hlY2sgZmFpbGVkIGZvciBwcm9wIFwiJyArIG5hbWUgKyAnXCIuJyxcbiAgICAgICAgdm1cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbnZhciBzaW1wbGVDaGVja1JFID0gL14oU3RyaW5nfE51bWJlcnxCb29sZWFufEZ1bmN0aW9ufFN5bWJvbCkkLztcblxuZnVuY3Rpb24gYXNzZXJ0VHlwZSAodmFsdWUsIHR5cGUpIHtcbiAgdmFyIHZhbGlkO1xuICB2YXIgZXhwZWN0ZWRUeXBlID0gZ2V0VHlwZSh0eXBlKTtcbiAgaWYgKHNpbXBsZUNoZWNrUkUudGVzdChleHBlY3RlZFR5cGUpKSB7XG4gICAgdmFyIHQgPSB0eXBlb2YgdmFsdWU7XG4gICAgdmFsaWQgPSB0ID09PSBleHBlY3RlZFR5cGUudG9Mb3dlckNhc2UoKTtcbiAgICAvLyBmb3IgcHJpbWl0aXZlIHdyYXBwZXIgb2JqZWN0c1xuICAgIGlmICghdmFsaWQgJiYgdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhbGlkID0gdmFsdWUgaW5zdGFuY2VvZiB0eXBlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChleHBlY3RlZFR5cGUgPT09ICdPYmplY3QnKSB7XG4gICAgdmFsaWQgPSBpc1BsYWluT2JqZWN0KHZhbHVlKTtcbiAgfSBlbHNlIGlmIChleHBlY3RlZFR5cGUgPT09ICdBcnJheScpIHtcbiAgICB2YWxpZCA9IEFycmF5LmlzQXJyYXkodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIHZhbGlkID0gdmFsdWUgaW5zdGFuY2VvZiB0eXBlO1xuICB9XG4gIHJldHVybiB7XG4gICAgdmFsaWQ6IHZhbGlkLFxuICAgIGV4cGVjdGVkVHlwZTogZXhwZWN0ZWRUeXBlXG4gIH1cbn1cblxuLyoqXG4gKiBVc2UgZnVuY3Rpb24gc3RyaW5nIG5hbWUgdG8gY2hlY2sgYnVpbHQtaW4gdHlwZXMsXG4gKiBiZWNhdXNlIGEgc2ltcGxlIGVxdWFsaXR5IGNoZWNrIHdpbGwgZmFpbCB3aGVuIHJ1bm5pbmdcbiAqIGFjcm9zcyBkaWZmZXJlbnQgdm1zIC8gaWZyYW1lcy5cbiAqL1xuZnVuY3Rpb24gZ2V0VHlwZSAoZm4pIHtcbiAgdmFyIG1hdGNoID0gZm4gJiYgZm4udG9TdHJpbmcoKS5tYXRjaCgvXlxccypmdW5jdGlvbiAoXFx3KykvKTtcbiAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xufVxuXG5mdW5jdGlvbiBpc1NhbWVUeXBlIChhLCBiKSB7XG4gIHJldHVybiBnZXRUeXBlKGEpID09PSBnZXRUeXBlKGIpXG59XG5cbmZ1bmN0aW9uIGdldFR5cGVJbmRleCAodHlwZSwgZXhwZWN0ZWRUeXBlcykge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRUeXBlcykpIHtcbiAgICByZXR1cm4gaXNTYW1lVHlwZShleHBlY3RlZFR5cGVzLCB0eXBlKSA/IDAgOiAtMVxuICB9XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBleHBlY3RlZFR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGlzU2FtZVR5cGUoZXhwZWN0ZWRUeXBlc1tpXSwgdHlwZSkpIHtcbiAgICAgIHJldHVybiBpXG4gICAgfVxuICB9XG4gIHJldHVybiAtMVxufVxuXG5mdW5jdGlvbiBnZXRJbnZhbGlkVHlwZU1lc3NhZ2UgKG5hbWUsIHZhbHVlLCBleHBlY3RlZFR5cGVzKSB7XG4gIHZhciBtZXNzYWdlID0gXCJJbnZhbGlkIHByb3A6IHR5cGUgY2hlY2sgZmFpbGVkIGZvciBwcm9wIFxcXCJcIiArIG5hbWUgKyBcIlxcXCIuXCIgK1xuICAgIFwiIEV4cGVjdGVkIFwiICsgKGV4cGVjdGVkVHlwZXMubWFwKGNhcGl0YWxpemUpLmpvaW4oJywgJykpO1xuICB2YXIgZXhwZWN0ZWRUeXBlID0gZXhwZWN0ZWRUeXBlc1swXTtcbiAgdmFyIHJlY2VpdmVkVHlwZSA9IHRvUmF3VHlwZSh2YWx1ZSk7XG4gIHZhciBleHBlY3RlZFZhbHVlID0gc3R5bGVWYWx1ZSh2YWx1ZSwgZXhwZWN0ZWRUeXBlKTtcbiAgdmFyIHJlY2VpdmVkVmFsdWUgPSBzdHlsZVZhbHVlKHZhbHVlLCByZWNlaXZlZFR5cGUpO1xuICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIHNwZWNpZnkgZXhwZWN0ZWQgdmFsdWVcbiAgaWYgKGV4cGVjdGVkVHlwZXMubGVuZ3RoID09PSAxICYmXG4gICAgICBpc0V4cGxpY2FibGUoZXhwZWN0ZWRUeXBlKSAmJlxuICAgICAgIWlzQm9vbGVhbihleHBlY3RlZFR5cGUsIHJlY2VpdmVkVHlwZSkpIHtcbiAgICBtZXNzYWdlICs9IFwiIHdpdGggdmFsdWUgXCIgKyBleHBlY3RlZFZhbHVlO1xuICB9XG4gIG1lc3NhZ2UgKz0gXCIsIGdvdCBcIiArIHJlY2VpdmVkVHlwZSArIFwiIFwiO1xuICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIHNwZWNpZnkgcmVjZWl2ZWQgdmFsdWVcbiAgaWYgKGlzRXhwbGljYWJsZShyZWNlaXZlZFR5cGUpKSB7XG4gICAgbWVzc2FnZSArPSBcIndpdGggdmFsdWUgXCIgKyByZWNlaXZlZFZhbHVlICsgXCIuXCI7XG4gIH1cbiAgcmV0dXJuIG1lc3NhZ2Vcbn1cblxuZnVuY3Rpb24gc3R5bGVWYWx1ZSAodmFsdWUsIHR5cGUpIHtcbiAgaWYgKHR5cGUgPT09ICdTdHJpbmcnKSB7XG4gICAgcmV0dXJuIChcIlxcXCJcIiArIHZhbHVlICsgXCJcXFwiXCIpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ051bWJlcicpIHtcbiAgICByZXR1cm4gKFwiXCIgKyAoTnVtYmVyKHZhbHVlKSkpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIChcIlwiICsgdmFsdWUpXG4gIH1cbn1cblxuZnVuY3Rpb24gaXNFeHBsaWNhYmxlICh2YWx1ZSkge1xuICB2YXIgZXhwbGljaXRUeXBlcyA9IFsnc3RyaW5nJywgJ251bWJlcicsICdib29sZWFuJ107XG4gIHJldHVybiBleHBsaWNpdFR5cGVzLnNvbWUoZnVuY3Rpb24gKGVsZW0pIHsgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IGVsZW07IH0pXG59XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbiAoKSB7XG4gIHZhciBhcmdzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHdoaWxlICggbGVuLS0gKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuIF07XG5cbiAgcmV0dXJuIGFyZ3Muc29tZShmdW5jdGlvbiAoZWxlbSkgeyByZXR1cm4gZWxlbS50b0xvd2VyQ2FzZSgpID09PSAnYm9vbGVhbic7IH0pXG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBoYW5kbGVFcnJvciAoZXJyLCB2bSwgaW5mbykge1xuICAvLyBEZWFjdGl2YXRlIGRlcHMgdHJhY2tpbmcgd2hpbGUgcHJvY2Vzc2luZyBlcnJvciBoYW5kbGVyIHRvIGF2b2lkIHBvc3NpYmxlIGluZmluaXRlIHJlbmRlcmluZy5cbiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVleC9pc3N1ZXMvMTUwNVxuICBwdXNoVGFyZ2V0KCk7XG4gIHRyeSB7XG4gICAgaWYgKHZtKSB7XG4gICAgICB2YXIgY3VyID0gdm07XG4gICAgICB3aGlsZSAoKGN1ciA9IGN1ci4kcGFyZW50KSkge1xuICAgICAgICB2YXIgaG9va3MgPSBjdXIuJG9wdGlvbnMuZXJyb3JDYXB0dXJlZDtcbiAgICAgICAgaWYgKGhvb2tzKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdmFyIGNhcHR1cmUgPSBob29rc1tpXS5jYWxsKGN1ciwgZXJyLCB2bSwgaW5mbykgPT09IGZhbHNlO1xuICAgICAgICAgICAgICBpZiAoY2FwdHVyZSkgeyByZXR1cm4gfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBnbG9iYWxIYW5kbGVFcnJvcihlLCBjdXIsICdlcnJvckNhcHR1cmVkIGhvb2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZ2xvYmFsSGFuZGxlRXJyb3IoZXJyLCB2bSwgaW5mbyk7XG4gIH0gZmluYWxseSB7XG4gICAgcG9wVGFyZ2V0KCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlV2l0aEVycm9ySGFuZGxpbmcgKFxuICBoYW5kbGVyLFxuICBjb250ZXh0LFxuICBhcmdzLFxuICB2bSxcbiAgaW5mb1xuKSB7XG4gIHZhciByZXM7XG4gIHRyeSB7XG4gICAgcmVzID0gYXJncyA/IGhhbmRsZXIuYXBwbHkoY29udGV4dCwgYXJncykgOiBoYW5kbGVyLmNhbGwoY29udGV4dCk7XG4gICAgaWYgKHJlcyAmJiAhcmVzLl9pc1Z1ZSAmJiBpc1Byb21pc2UocmVzKSAmJiAhcmVzLl9oYW5kbGVkKSB7XG4gICAgICByZXMuY2F0Y2goZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGUsIHZtLCBpbmZvICsgXCIgKFByb21pc2UvYXN5bmMpXCIpOyB9KTtcbiAgICAgIC8vIGlzc3VlICM5NTExXG4gICAgICAvLyBhdm9pZCBjYXRjaCB0cmlnZ2VyaW5nIG11bHRpcGxlIHRpbWVzIHdoZW4gbmVzdGVkIGNhbGxzXG4gICAgICByZXMuX2hhbmRsZWQgPSB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGhhbmRsZUVycm9yKGUsIHZtLCBpbmZvKTtcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGdsb2JhbEhhbmRsZUVycm9yIChlcnIsIHZtLCBpbmZvKSB7XG4gIGlmIChjb25maWcuZXJyb3JIYW5kbGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBjb25maWcuZXJyb3JIYW5kbGVyLmNhbGwobnVsbCwgZXJyLCB2bSwgaW5mbylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBpZiB0aGUgdXNlciBpbnRlbnRpb25hbGx5IHRocm93cyB0aGUgb3JpZ2luYWwgZXJyb3IgaW4gdGhlIGhhbmRsZXIsXG4gICAgICAvLyBkbyBub3QgbG9nIGl0IHR3aWNlXG4gICAgICBpZiAoZSAhPT0gZXJyKSB7XG4gICAgICAgIGxvZ0Vycm9yKGUsIG51bGwsICdjb25maWcuZXJyb3JIYW5kbGVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGxvZ0Vycm9yKGVyciwgdm0sIGluZm8pO1xufVxuXG5mdW5jdGlvbiBsb2dFcnJvciAoZXJyLCB2bSwgaW5mbykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHdhcm4oKFwiRXJyb3IgaW4gXCIgKyBpbmZvICsgXCI6IFxcXCJcIiArIChlcnIudG9TdHJpbmcoKSkgKyBcIlxcXCJcIiksIHZtKTtcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoKGluQnJvd3NlciB8fCBpbldlZXgpICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBlcnJcbiAgfVxufVxuXG4vKiAgKi9cblxudmFyIGNhbGxiYWNrcyA9IFtdO1xudmFyIHBlbmRpbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZmx1c2hDYWxsYmFja3MgKCkge1xuICBwZW5kaW5nID0gZmFsc2U7XG4gIHZhciBjb3BpZXMgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gIGNhbGxiYWNrcy5sZW5ndGggPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvcGllcy5sZW5ndGg7IGkrKykge1xuICAgIGNvcGllc1tpXSgpO1xuICB9XG59XG5cbi8vIEhlcmUgd2UgaGF2ZSBhc3luYyBkZWZlcnJpbmcgd3JhcHBlcnMgdXNpbmcgbWljcm90YXNrcy5cbi8vIEluIDIuNSB3ZSB1c2VkIChtYWNybykgdGFza3MgKGluIGNvbWJpbmF0aW9uIHdpdGggbWljcm90YXNrcykuXG4vLyBIb3dldmVyLCBpdCBoYXMgc3VidGxlIHByb2JsZW1zIHdoZW4gc3RhdGUgaXMgY2hhbmdlZCByaWdodCBiZWZvcmUgcmVwYWludFxuLy8gKGUuZy4gIzY4MTMsIG91dC1pbiB0cmFuc2l0aW9ucykuXG4vLyBBbHNvLCB1c2luZyAobWFjcm8pIHRhc2tzIGluIGV2ZW50IGhhbmRsZXIgd291bGQgY2F1c2Ugc29tZSB3ZWlyZCBiZWhhdmlvcnNcbi8vIHRoYXQgY2Fubm90IGJlIGNpcmN1bXZlbnRlZCAoZS5nLiAjNzEwOSwgIzcxNTMsICM3NTQ2LCAjNzgzNCwgIzgxMDkpLlxuLy8gU28gd2Ugbm93IHVzZSBtaWNyb3Rhc2tzIGV2ZXJ5d2hlcmUsIGFnYWluLlxuLy8gQSBtYWpvciBkcmF3YmFjayBvZiB0aGlzIHRyYWRlb2ZmIGlzIHRoYXQgdGhlcmUgYXJlIHNvbWUgc2NlbmFyaW9zXG4vLyB3aGVyZSBtaWNyb3Rhc2tzIGhhdmUgdG9vIGhpZ2ggYSBwcmlvcml0eSBhbmQgZmlyZSBpbiBiZXR3ZWVuIHN1cHBvc2VkbHlcbi8vIHNlcXVlbnRpYWwgZXZlbnRzIChlLmcuICM0NTIxLCAjNjY5MCwgd2hpY2ggaGF2ZSB3b3JrYXJvdW5kcylcbi8vIG9yIGV2ZW4gYmV0d2VlbiBidWJibGluZyBvZiB0aGUgc2FtZSBldmVudCAoIzY1NjYpLlxudmFyIHRpbWVyRnVuYztcblxuLy8gVGhlIG5leHRUaWNrIGJlaGF2aW9yIGxldmVyYWdlcyB0aGUgbWljcm90YXNrIHF1ZXVlLCB3aGljaCBjYW4gYmUgYWNjZXNzZWRcbi8vIHZpYSBlaXRoZXIgbmF0aXZlIFByb21pc2UudGhlbiBvciBNdXRhdGlvbk9ic2VydmVyLlxuLy8gTXV0YXRpb25PYnNlcnZlciBoYXMgd2lkZXIgc3VwcG9ydCwgaG93ZXZlciBpdCBpcyBzZXJpb3VzbHkgYnVnZ2VkIGluXG4vLyBVSVdlYlZpZXcgaW4gaU9TID49IDkuMy4zIHdoZW4gdHJpZ2dlcmVkIGluIHRvdWNoIGV2ZW50IGhhbmRsZXJzLiBJdFxuLy8gY29tcGxldGVseSBzdG9wcyB3b3JraW5nIGFmdGVyIHRyaWdnZXJpbmcgYSBmZXcgdGltZXMuLi4gc28sIGlmIG5hdGl2ZVxuLy8gUHJvbWlzZSBpcyBhdmFpbGFibGUsIHdlIHdpbGwgdXNlIGl0OlxuLyogaXN0YW5idWwgaWdub3JlIG5leHQsICRmbG93LWRpc2FibGUtbGluZSAqL1xuaWYgKHR5cGVvZiBQcm9taXNlICE9PSAndW5kZWZpbmVkJyAmJiBpc05hdGl2ZShQcm9taXNlKSkge1xuICB2YXIgcCA9IFByb21pc2UucmVzb2x2ZSgpO1xuICB0aW1lckZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcC50aGVuKGZsdXNoQ2FsbGJhY2tzKTtcbiAgICAvLyBJbiBwcm9ibGVtYXRpYyBVSVdlYlZpZXdzLCBQcm9taXNlLnRoZW4gZG9lc24ndCBjb21wbGV0ZWx5IGJyZWFrLCBidXRcbiAgICAvLyBpdCBjYW4gZ2V0IHN0dWNrIGluIGEgd2VpcmQgc3RhdGUgd2hlcmUgY2FsbGJhY2tzIGFyZSBwdXNoZWQgaW50byB0aGVcbiAgICAvLyBtaWNyb3Rhc2sgcXVldWUgYnV0IHRoZSBxdWV1ZSBpc24ndCBiZWluZyBmbHVzaGVkLCB1bnRpbCB0aGUgYnJvd3NlclxuICAgIC8vIG5lZWRzIHRvIGRvIHNvbWUgb3RoZXIgd29yaywgZS5nLiBoYW5kbGUgYSB0aW1lci4gVGhlcmVmb3JlIHdlIGNhblxuICAgIC8vIFwiZm9yY2VcIiB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGZsdXNoZWQgYnkgYWRkaW5nIGFuIGVtcHR5IHRpbWVyLlxuICAgIGlmIChpc0lPUykgeyBzZXRUaW1lb3V0KG5vb3ApOyB9XG4gIH07XG59IGVsc2UgaWYgKCFpc0lFICYmIHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyICE9PSAndW5kZWZpbmVkJyAmJiAoXG4gIGlzTmF0aXZlKE11dGF0aW9uT2JzZXJ2ZXIpIHx8XG4gIC8vIFBoYW50b21KUyBhbmQgaU9TIDcueFxuICBNdXRhdGlvbk9ic2VydmVyLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE11dGF0aW9uT2JzZXJ2ZXJDb25zdHJ1Y3Rvcl0nXG4pKSB7XG4gIC8vIFVzZSBNdXRhdGlvbk9ic2VydmVyIHdoZXJlIG5hdGl2ZSBQcm9taXNlIGlzIG5vdCBhdmFpbGFibGUsXG4gIC8vIGUuZy4gUGhhbnRvbUpTLCBpT1M3LCBBbmRyb2lkIDQuNFxuICAvLyAoIzY0NjYgTXV0YXRpb25PYnNlcnZlciBpcyB1bnJlbGlhYmxlIGluIElFMTEpXG4gIHZhciBjb3VudGVyID0gMTtcbiAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZmx1c2hDYWxsYmFja3MpO1xuICB2YXIgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShTdHJpbmcoY291bnRlcikpO1xuICBvYnNlcnZlci5vYnNlcnZlKHRleHROb2RlLCB7XG4gICAgY2hhcmFjdGVyRGF0YTogdHJ1ZVxuICB9KTtcbiAgdGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgIGNvdW50ZXIgPSAoY291bnRlciArIDEpICUgMjtcbiAgICB0ZXh0Tm9kZS5kYXRhID0gU3RyaW5nKGNvdW50ZXIpO1xuICB9O1xufSBlbHNlIGlmICh0eXBlb2Ygc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJyAmJiBpc05hdGl2ZShzZXRJbW1lZGlhdGUpKSB7XG4gIC8vIEZhbGxiYWNrIHRvIHNldEltbWVkaWF0ZS5cbiAgLy8gVGVjaGluaWNhbGx5IGl0IGxldmVyYWdlcyB0aGUgKG1hY3JvKSB0YXNrIHF1ZXVlLFxuICAvLyBidXQgaXQgaXMgc3RpbGwgYSBiZXR0ZXIgY2hvaWNlIHRoYW4gc2V0VGltZW91dC5cbiAgdGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgIHNldEltbWVkaWF0ZShmbHVzaENhbGxiYWNrcyk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBGYWxsYmFjayB0byBzZXRUaW1lb3V0LlxuICB0aW1lckZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2V0VGltZW91dChmbHVzaENhbGxiYWNrcywgMCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG5leHRUaWNrIChjYiwgY3R4KSB7XG4gIHZhciBfcmVzb2x2ZTtcbiAgY2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgIGlmIChjYikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY2IuY2FsbChjdHgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBoYW5kbGVFcnJvcihlLCBjdHgsICduZXh0VGljaycpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoX3Jlc29sdmUpIHtcbiAgICAgIF9yZXNvbHZlKGN0eCk7XG4gICAgfVxuICB9KTtcbiAgaWYgKCFwZW5kaW5nKSB7XG4gICAgcGVuZGluZyA9IHRydWU7XG4gICAgdGltZXJGdW5jKCk7XG4gIH1cbiAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXG4gIGlmICghY2IgJiYgdHlwZW9mIFByb21pc2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICBfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgfSlcbiAgfVxufVxuXG4vKiAgKi9cblxuLyogbm90IHR5cGUgY2hlY2tpbmcgdGhpcyBmaWxlIGJlY2F1c2UgZmxvdyBkb2Vzbid0IHBsYXkgd2VsbCB3aXRoIFByb3h5ICovXG5cbnZhciBpbml0UHJveHk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBhbGxvd2VkR2xvYmFscyA9IG1ha2VNYXAoXG4gICAgJ0luZmluaXR5LHVuZGVmaW5lZCxOYU4saXNGaW5pdGUsaXNOYU4sJyArXG4gICAgJ3BhcnNlRmxvYXQscGFyc2VJbnQsZGVjb2RlVVJJLGRlY29kZVVSSUNvbXBvbmVudCxlbmNvZGVVUkksZW5jb2RlVVJJQ29tcG9uZW50LCcgK1xuICAgICdNYXRoLE51bWJlcixEYXRlLEFycmF5LE9iamVjdCxCb29sZWFuLFN0cmluZyxSZWdFeHAsTWFwLFNldCxKU09OLEludGwsJyArXG4gICAgJ3JlcXVpcmUnIC8vIGZvciBXZWJwYWNrL0Jyb3dzZXJpZnlcbiAgKTtcblxuICB2YXIgd2Fybk5vblByZXNlbnQgPSBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHtcbiAgICB3YXJuKFxuICAgICAgXCJQcm9wZXJ0eSBvciBtZXRob2QgXFxcIlwiICsga2V5ICsgXCJcXFwiIGlzIG5vdCBkZWZpbmVkIG9uIHRoZSBpbnN0YW5jZSBidXQgXCIgK1xuICAgICAgJ3JlZmVyZW5jZWQgZHVyaW5nIHJlbmRlci4gTWFrZSBzdXJlIHRoYXQgdGhpcyBwcm9wZXJ0eSBpcyByZWFjdGl2ZSwgJyArXG4gICAgICAnZWl0aGVyIGluIHRoZSBkYXRhIG9wdGlvbiwgb3IgZm9yIGNsYXNzLWJhc2VkIGNvbXBvbmVudHMsIGJ5ICcgK1xuICAgICAgJ2luaXRpYWxpemluZyB0aGUgcHJvcGVydHkuICcgK1xuICAgICAgJ1NlZTogaHR0cHM6Ly92dWVqcy5vcmcvdjIvZ3VpZGUvcmVhY3Rpdml0eS5odG1sI0RlY2xhcmluZy1SZWFjdGl2ZS1Qcm9wZXJ0aWVzLicsXG4gICAgICB0YXJnZXRcbiAgICApO1xuICB9O1xuXG4gIHZhciB3YXJuUmVzZXJ2ZWRQcmVmaXggPSBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHtcbiAgICB3YXJuKFxuICAgICAgXCJQcm9wZXJ0eSBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgbXVzdCBiZSBhY2Nlc3NlZCB3aXRoIFxcXCIkZGF0YS5cIiArIGtleSArIFwiXFxcIiBiZWNhdXNlIFwiICtcbiAgICAgICdwcm9wZXJ0aWVzIHN0YXJ0aW5nIHdpdGggXCIkXCIgb3IgXCJfXCIgYXJlIG5vdCBwcm94aWVkIGluIHRoZSBWdWUgaW5zdGFuY2UgdG8gJyArXG4gICAgICAncHJldmVudCBjb25mbGljdHMgd2l0aCBWdWUgaW50ZXJuYWxzJyArXG4gICAgICAnU2VlOiBodHRwczovL3Z1ZWpzLm9yZy92Mi9hcGkvI2RhdGEnLFxuICAgICAgdGFyZ2V0XG4gICAgKTtcbiAgfTtcblxuICB2YXIgaGFzUHJveHkgPVxuICAgIHR5cGVvZiBQcm94eSAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOYXRpdmUoUHJveHkpO1xuXG4gIGlmIChoYXNQcm94eSkge1xuICAgIHZhciBpc0J1aWx0SW5Nb2RpZmllciA9IG1ha2VNYXAoJ3N0b3AscHJldmVudCxzZWxmLGN0cmwsc2hpZnQsYWx0LG1ldGEsZXhhY3QnKTtcbiAgICBjb25maWcua2V5Q29kZXMgPSBuZXcgUHJveHkoY29uZmlnLmtleUNvZGVzLCB7XG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldCAodGFyZ2V0LCBrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChpc0J1aWx0SW5Nb2RpZmllcihrZXkpKSB7XG4gICAgICAgICAgd2FybigoXCJBdm9pZCBvdmVyd3JpdGluZyBidWlsdC1pbiBtb2RpZmllciBpbiBjb25maWcua2V5Q29kZXM6IC5cIiArIGtleSkpO1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmFyIGhhc0hhbmRsZXIgPSB7XG4gICAgaGFzOiBmdW5jdGlvbiBoYXMgKHRhcmdldCwga2V5KSB7XG4gICAgICB2YXIgaGFzID0ga2V5IGluIHRhcmdldDtcbiAgICAgIHZhciBpc0FsbG93ZWQgPSBhbGxvd2VkR2xvYmFscyhrZXkpIHx8XG4gICAgICAgICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyAmJiBrZXkuY2hhckF0KDApID09PSAnXycgJiYgIShrZXkgaW4gdGFyZ2V0LiRkYXRhKSk7XG4gICAgICBpZiAoIWhhcyAmJiAhaXNBbGxvd2VkKSB7XG4gICAgICAgIGlmIChrZXkgaW4gdGFyZ2V0LiRkYXRhKSB7IHdhcm5SZXNlcnZlZFByZWZpeCh0YXJnZXQsIGtleSk7IH1cbiAgICAgICAgZWxzZSB7IHdhcm5Ob25QcmVzZW50KHRhcmdldCwga2V5KTsgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGhhcyB8fCAhaXNBbGxvd2VkXG4gICAgfVxuICB9O1xuXG4gIHZhciBnZXRIYW5kbGVyID0ge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0ICh0YXJnZXQsIGtleSkge1xuICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmICEoa2V5IGluIHRhcmdldCkpIHtcbiAgICAgICAgaWYgKGtleSBpbiB0YXJnZXQuJGRhdGEpIHsgd2FyblJlc2VydmVkUHJlZml4KHRhcmdldCwga2V5KTsgfVxuICAgICAgICBlbHNlIHsgd2Fybk5vblByZXNlbnQodGFyZ2V0LCBrZXkpOyB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0W2tleV1cbiAgICB9XG4gIH07XG5cbiAgaW5pdFByb3h5ID0gZnVuY3Rpb24gaW5pdFByb3h5ICh2bSkge1xuICAgIGlmIChoYXNQcm94eSkge1xuICAgICAgLy8gZGV0ZXJtaW5lIHdoaWNoIHByb3h5IGhhbmRsZXIgdG8gdXNlXG4gICAgICB2YXIgb3B0aW9ucyA9IHZtLiRvcHRpb25zO1xuICAgICAgdmFyIGhhbmRsZXJzID0gb3B0aW9ucy5yZW5kZXIgJiYgb3B0aW9ucy5yZW5kZXIuX3dpdGhTdHJpcHBlZFxuICAgICAgICA/IGdldEhhbmRsZXJcbiAgICAgICAgOiBoYXNIYW5kbGVyO1xuICAgICAgdm0uX3JlbmRlclByb3h5ID0gbmV3IFByb3h5KHZtLCBoYW5kbGVycyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZtLl9yZW5kZXJQcm94eSA9IHZtO1xuICAgIH1cbiAgfTtcbn1cblxuLyogICovXG5cbnZhciBzZWVuT2JqZWN0cyA9IG5ldyBfU2V0KCk7XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdHJhdmVyc2UgYW4gb2JqZWN0IHRvIGV2b2tlIGFsbCBjb252ZXJ0ZWRcbiAqIGdldHRlcnMsIHNvIHRoYXQgZXZlcnkgbmVzdGVkIHByb3BlcnR5IGluc2lkZSB0aGUgb2JqZWN0XG4gKiBpcyBjb2xsZWN0ZWQgYXMgYSBcImRlZXBcIiBkZXBlbmRlbmN5LlxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZSAodmFsKSB7XG4gIF90cmF2ZXJzZSh2YWwsIHNlZW5PYmplY3RzKTtcbiAgc2Vlbk9iamVjdHMuY2xlYXIoKTtcbn1cblxuZnVuY3Rpb24gX3RyYXZlcnNlICh2YWwsIHNlZW4pIHtcbiAgdmFyIGksIGtleXM7XG4gIHZhciBpc0EgPSBBcnJheS5pc0FycmF5KHZhbCk7XG4gIGlmICgoIWlzQSAmJiAhaXNPYmplY3QodmFsKSkgfHwgT2JqZWN0LmlzRnJvemVuKHZhbCkgfHwgdmFsIGluc3RhbmNlb2YgVk5vZGUpIHtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAodmFsLl9fb2JfXykge1xuICAgIHZhciBkZXBJZCA9IHZhbC5fX29iX18uZGVwLmlkO1xuICAgIGlmIChzZWVuLmhhcyhkZXBJZCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBzZWVuLmFkZChkZXBJZCk7XG4gIH1cbiAgaWYgKGlzQSkge1xuICAgIGkgPSB2YWwubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHsgX3RyYXZlcnNlKHZhbFtpXSwgc2Vlbik7IH1cbiAgfSBlbHNlIHtcbiAgICBrZXlzID0gT2JqZWN0LmtleXModmFsKTtcbiAgICBpID0ga2V5cy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkgeyBfdHJhdmVyc2UodmFsW2tleXNbaV1dLCBzZWVuKTsgfVxuICB9XG59XG5cbnZhciBtYXJrO1xudmFyIG1lYXN1cmU7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBwZXJmID0gaW5Ccm93c2VyICYmIHdpbmRvdy5wZXJmb3JtYW5jZTtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChcbiAgICBwZXJmICYmXG4gICAgcGVyZi5tYXJrICYmXG4gICAgcGVyZi5tZWFzdXJlICYmXG4gICAgcGVyZi5jbGVhck1hcmtzICYmXG4gICAgcGVyZi5jbGVhck1lYXN1cmVzXG4gICkge1xuICAgIG1hcmsgPSBmdW5jdGlvbiAodGFnKSB7IHJldHVybiBwZXJmLm1hcmsodGFnKTsgfTtcbiAgICBtZWFzdXJlID0gZnVuY3Rpb24gKG5hbWUsIHN0YXJ0VGFnLCBlbmRUYWcpIHtcbiAgICAgIHBlcmYubWVhc3VyZShuYW1lLCBzdGFydFRhZywgZW5kVGFnKTtcbiAgICAgIHBlcmYuY2xlYXJNYXJrcyhzdGFydFRhZyk7XG4gICAgICBwZXJmLmNsZWFyTWFya3MoZW5kVGFnKTtcbiAgICAgIC8vIHBlcmYuY2xlYXJNZWFzdXJlcyhuYW1lKVxuICAgIH07XG4gIH1cbn1cblxuLyogICovXG5cbnZhciBub3JtYWxpemVFdmVudCA9IGNhY2hlZChmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgcGFzc2l2ZSA9IG5hbWUuY2hhckF0KDApID09PSAnJic7XG4gIG5hbWUgPSBwYXNzaXZlID8gbmFtZS5zbGljZSgxKSA6IG5hbWU7XG4gIHZhciBvbmNlJCQxID0gbmFtZS5jaGFyQXQoMCkgPT09ICd+JzsgLy8gUHJlZml4ZWQgbGFzdCwgY2hlY2tlZCBmaXJzdFxuICBuYW1lID0gb25jZSQkMSA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lO1xuICB2YXIgY2FwdHVyZSA9IG5hbWUuY2hhckF0KDApID09PSAnISc7XG4gIG5hbWUgPSBjYXB0dXJlID8gbmFtZS5zbGljZSgxKSA6IG5hbWU7XG4gIHJldHVybiB7XG4gICAgbmFtZTogbmFtZSxcbiAgICBvbmNlOiBvbmNlJCQxLFxuICAgIGNhcHR1cmU6IGNhcHR1cmUsXG4gICAgcGFzc2l2ZTogcGFzc2l2ZVxuICB9XG59KTtcblxuZnVuY3Rpb24gY3JlYXRlRm5JbnZva2VyIChmbnMsIHZtKSB7XG4gIGZ1bmN0aW9uIGludm9rZXIgKCkge1xuICAgIHZhciBhcmd1bWVudHMkMSA9IGFyZ3VtZW50cztcblxuICAgIHZhciBmbnMgPSBpbnZva2VyLmZucztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShmbnMpKSB7XG4gICAgICB2YXIgY2xvbmVkID0gZm5zLnNsaWNlKCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsb25lZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpbnZva2VXaXRoRXJyb3JIYW5kbGluZyhjbG9uZWRbaV0sIG51bGwsIGFyZ3VtZW50cyQxLCB2bSwgXCJ2LW9uIGhhbmRsZXJcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJldHVybiBoYW5kbGVyIHJldHVybiB2YWx1ZSBmb3Igc2luZ2xlIGhhbmRsZXJzXG4gICAgICByZXR1cm4gaW52b2tlV2l0aEVycm9ySGFuZGxpbmcoZm5zLCBudWxsLCBhcmd1bWVudHMsIHZtLCBcInYtb24gaGFuZGxlclwiKVxuICAgIH1cbiAgfVxuICBpbnZva2VyLmZucyA9IGZucztcbiAgcmV0dXJuIGludm9rZXJcbn1cblxuZnVuY3Rpb24gdXBkYXRlTGlzdGVuZXJzIChcbiAgb24sXG4gIG9sZE9uLFxuICBhZGQsXG4gIHJlbW92ZSQkMSxcbiAgY3JlYXRlT25jZUhhbmRsZXIsXG4gIHZtXG4pIHtcbiAgdmFyIG5hbWUsIGRlZiQkMSwgY3VyLCBvbGQsIGV2ZW50O1xuICBmb3IgKG5hbWUgaW4gb24pIHtcbiAgICBkZWYkJDEgPSBjdXIgPSBvbltuYW1lXTtcbiAgICBvbGQgPSBvbGRPbltuYW1lXTtcbiAgICBldmVudCA9IG5vcm1hbGl6ZUV2ZW50KG5hbWUpO1xuICAgIGlmIChpc1VuZGVmKGN1cikpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICAgXCJJbnZhbGlkIGhhbmRsZXIgZm9yIGV2ZW50IFxcXCJcIiArIChldmVudC5uYW1lKSArIFwiXFxcIjogZ290IFwiICsgU3RyaW5nKGN1ciksXG4gICAgICAgIHZtXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoaXNVbmRlZihvbGQpKSB7XG4gICAgICBpZiAoaXNVbmRlZihjdXIuZm5zKSkge1xuICAgICAgICBjdXIgPSBvbltuYW1lXSA9IGNyZWF0ZUZuSW52b2tlcihjdXIsIHZtKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1RydWUoZXZlbnQub25jZSkpIHtcbiAgICAgICAgY3VyID0gb25bbmFtZV0gPSBjcmVhdGVPbmNlSGFuZGxlcihldmVudC5uYW1lLCBjdXIsIGV2ZW50LmNhcHR1cmUpO1xuICAgICAgfVxuICAgICAgYWRkKGV2ZW50Lm5hbWUsIGN1ciwgZXZlbnQuY2FwdHVyZSwgZXZlbnQucGFzc2l2ZSwgZXZlbnQucGFyYW1zKTtcbiAgICB9IGVsc2UgaWYgKGN1ciAhPT0gb2xkKSB7XG4gICAgICBvbGQuZm5zID0gY3VyO1xuICAgICAgb25bbmFtZV0gPSBvbGQ7XG4gICAgfVxuICB9XG4gIGZvciAobmFtZSBpbiBvbGRPbikge1xuICAgIGlmIChpc1VuZGVmKG9uW25hbWVdKSkge1xuICAgICAgZXZlbnQgPSBub3JtYWxpemVFdmVudChuYW1lKTtcbiAgICAgIHJlbW92ZSQkMShldmVudC5uYW1lLCBvbGRPbltuYW1lXSwgZXZlbnQuY2FwdHVyZSk7XG4gICAgfVxuICB9XG59XG5cbi8qICAqL1xuXG4vKiAgKi9cblxuZnVuY3Rpb24gZXh0cmFjdFByb3BzRnJvbVZOb2RlRGF0YSAoXG4gIGRhdGEsXG4gIEN0b3IsXG4gIHRhZ1xuKSB7XG4gIC8vIHdlIGFyZSBvbmx5IGV4dHJhY3RpbmcgcmF3IHZhbHVlcyBoZXJlLlxuICAvLyB2YWxpZGF0aW9uIGFuZCBkZWZhdWx0IHZhbHVlcyBhcmUgaGFuZGxlZCBpbiB0aGUgY2hpbGRcbiAgLy8gY29tcG9uZW50IGl0c2VsZi5cbiAgdmFyIHByb3BPcHRpb25zID0gQ3Rvci5vcHRpb25zLnByb3BzO1xuICBpZiAoaXNVbmRlZihwcm9wT3B0aW9ucykpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgcmVzID0ge307XG4gIHZhciBhdHRycyA9IGRhdGEuYXR0cnM7XG4gIHZhciBwcm9wcyA9IGRhdGEucHJvcHM7XG4gIGlmIChpc0RlZihhdHRycykgfHwgaXNEZWYocHJvcHMpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BPcHRpb25zKSB7XG4gICAgICB2YXIgYWx0S2V5ID0gaHlwaGVuYXRlKGtleSk7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB2YXIga2V5SW5Mb3dlckNhc2UgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGtleSAhPT0ga2V5SW5Mb3dlckNhc2UgJiZcbiAgICAgICAgICBhdHRycyAmJiBoYXNPd24oYXR0cnMsIGtleUluTG93ZXJDYXNlKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aXAoXG4gICAgICAgICAgICBcIlByb3AgXFxcIlwiICsga2V5SW5Mb3dlckNhc2UgKyBcIlxcXCIgaXMgcGFzc2VkIHRvIGNvbXBvbmVudCBcIiArXG4gICAgICAgICAgICAoZm9ybWF0Q29tcG9uZW50TmFtZSh0YWcgfHwgQ3RvcikpICsgXCIsIGJ1dCB0aGUgZGVjbGFyZWQgcHJvcCBuYW1lIGlzXCIgK1xuICAgICAgICAgICAgXCIgXFxcIlwiICsga2V5ICsgXCJcXFwiLiBcIiArXG4gICAgICAgICAgICBcIk5vdGUgdGhhdCBIVE1MIGF0dHJpYnV0ZXMgYXJlIGNhc2UtaW5zZW5zaXRpdmUgYW5kIGNhbWVsQ2FzZWQgXCIgK1xuICAgICAgICAgICAgXCJwcm9wcyBuZWVkIHRvIHVzZSB0aGVpciBrZWJhYi1jYXNlIGVxdWl2YWxlbnRzIHdoZW4gdXNpbmcgaW4tRE9NIFwiICtcbiAgICAgICAgICAgIFwidGVtcGxhdGVzLiBZb3Ugc2hvdWxkIHByb2JhYmx5IHVzZSBcXFwiXCIgKyBhbHRLZXkgKyBcIlxcXCIgaW5zdGVhZCBvZiBcXFwiXCIgKyBrZXkgKyBcIlxcXCIuXCJcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjaGVja1Byb3AocmVzLCBwcm9wcywga2V5LCBhbHRLZXksIHRydWUpIHx8XG4gICAgICBjaGVja1Byb3AocmVzLCBhdHRycywga2V5LCBhbHRLZXksIGZhbHNlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBjaGVja1Byb3AgKFxuICByZXMsXG4gIGhhc2gsXG4gIGtleSxcbiAgYWx0S2V5LFxuICBwcmVzZXJ2ZVxuKSB7XG4gIGlmIChpc0RlZihoYXNoKSkge1xuICAgIGlmIChoYXNPd24oaGFzaCwga2V5KSkge1xuICAgICAgcmVzW2tleV0gPSBoYXNoW2tleV07XG4gICAgICBpZiAoIXByZXNlcnZlKSB7XG4gICAgICAgIGRlbGV0ZSBoYXNoW2tleV07XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSBpZiAoaGFzT3duKGhhc2gsIGFsdEtleSkpIHtcbiAgICAgIHJlc1trZXldID0gaGFzaFthbHRLZXldO1xuICAgICAgaWYgKCFwcmVzZXJ2ZSkge1xuICAgICAgICBkZWxldGUgaGFzaFthbHRLZXldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qICAqL1xuXG4vLyBUaGUgdGVtcGxhdGUgY29tcGlsZXIgYXR0ZW1wdHMgdG8gbWluaW1pemUgdGhlIG5lZWQgZm9yIG5vcm1hbGl6YXRpb24gYnlcbi8vIHN0YXRpY2FsbHkgYW5hbHl6aW5nIHRoZSB0ZW1wbGF0ZSBhdCBjb21waWxlIHRpbWUuXG4vL1xuLy8gRm9yIHBsYWluIEhUTUwgbWFya3VwLCBub3JtYWxpemF0aW9uIGNhbiBiZSBjb21wbGV0ZWx5IHNraXBwZWQgYmVjYXVzZSB0aGVcbi8vIGdlbmVyYXRlZCByZW5kZXIgZnVuY3Rpb24gaXMgZ3VhcmFudGVlZCB0byByZXR1cm4gQXJyYXk8Vk5vZGU+LiBUaGVyZSBhcmVcbi8vIHR3byBjYXNlcyB3aGVyZSBleHRyYSBub3JtYWxpemF0aW9uIGlzIG5lZWRlZDpcblxuLy8gMS4gV2hlbiB0aGUgY2hpbGRyZW4gY29udGFpbnMgY29tcG9uZW50cyAtIGJlY2F1c2UgYSBmdW5jdGlvbmFsIGNvbXBvbmVudFxuLy8gbWF5IHJldHVybiBhbiBBcnJheSBpbnN0ZWFkIG9mIGEgc2luZ2xlIHJvb3QuIEluIHRoaXMgY2FzZSwganVzdCBhIHNpbXBsZVxuLy8gbm9ybWFsaXphdGlvbiBpcyBuZWVkZWQgLSBpZiBhbnkgY2hpbGQgaXMgYW4gQXJyYXksIHdlIGZsYXR0ZW4gdGhlIHdob2xlXG4vLyB0aGluZyB3aXRoIEFycmF5LnByb3RvdHlwZS5jb25jYXQuIEl0IGlzIGd1YXJhbnRlZWQgdG8gYmUgb25seSAxLWxldmVsIGRlZXBcbi8vIGJlY2F1c2UgZnVuY3Rpb25hbCBjb21wb25lbnRzIGFscmVhZHkgbm9ybWFsaXplIHRoZWlyIG93biBjaGlsZHJlbi5cbmZ1bmN0aW9uIHNpbXBsZU5vcm1hbGl6ZUNoaWxkcmVuIChjaGlsZHJlbikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW5baV0pKSB7XG4gICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgY2hpbGRyZW4pXG4gICAgfVxuICB9XG4gIHJldHVybiBjaGlsZHJlblxufVxuXG4vLyAyLiBXaGVuIHRoZSBjaGlsZHJlbiBjb250YWlucyBjb25zdHJ1Y3RzIHRoYXQgYWx3YXlzIGdlbmVyYXRlZCBuZXN0ZWQgQXJyYXlzLFxuLy8gZS5nLiA8dGVtcGxhdGU+LCA8c2xvdD4sIHYtZm9yLCBvciB3aGVuIHRoZSBjaGlsZHJlbiBpcyBwcm92aWRlZCBieSB1c2VyXG4vLyB3aXRoIGhhbmQtd3JpdHRlbiByZW5kZXIgZnVuY3Rpb25zIC8gSlNYLiBJbiBzdWNoIGNhc2VzIGEgZnVsbCBub3JtYWxpemF0aW9uXG4vLyBpcyBuZWVkZWQgdG8gY2F0ZXIgdG8gYWxsIHBvc3NpYmxlIHR5cGVzIG9mIGNoaWxkcmVuIHZhbHVlcy5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUNoaWxkcmVuIChjaGlsZHJlbikge1xuICByZXR1cm4gaXNQcmltaXRpdmUoY2hpbGRyZW4pXG4gICAgPyBbY3JlYXRlVGV4dFZOb2RlKGNoaWxkcmVuKV1cbiAgICA6IEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pXG4gICAgICA/IG5vcm1hbGl6ZUFycmF5Q2hpbGRyZW4oY2hpbGRyZW4pXG4gICAgICA6IHVuZGVmaW5lZFxufVxuXG5mdW5jdGlvbiBpc1RleHROb2RlIChub2RlKSB7XG4gIHJldHVybiBpc0RlZihub2RlKSAmJiBpc0RlZihub2RlLnRleHQpICYmIGlzRmFsc2Uobm9kZS5pc0NvbW1lbnQpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5Q2hpbGRyZW4gKGNoaWxkcmVuLCBuZXN0ZWRJbmRleCkge1xuICB2YXIgcmVzID0gW107XG4gIHZhciBpLCBjLCBsYXN0SW5kZXgsIGxhc3Q7XG4gIGZvciAoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBjaGlsZHJlbltpXTtcbiAgICBpZiAoaXNVbmRlZihjKSB8fCB0eXBlb2YgYyA9PT0gJ2Jvb2xlYW4nKSB7IGNvbnRpbnVlIH1cbiAgICBsYXN0SW5kZXggPSByZXMubGVuZ3RoIC0gMTtcbiAgICBsYXN0ID0gcmVzW2xhc3RJbmRleF07XG4gICAgLy8gIG5lc3RlZFxuICAgIGlmIChBcnJheS5pc0FycmF5KGMpKSB7XG4gICAgICBpZiAoYy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGMgPSBub3JtYWxpemVBcnJheUNoaWxkcmVuKGMsICgobmVzdGVkSW5kZXggfHwgJycpICsgXCJfXCIgKyBpKSk7XG4gICAgICAgIC8vIG1lcmdlIGFkamFjZW50IHRleHQgbm9kZXNcbiAgICAgICAgaWYgKGlzVGV4dE5vZGUoY1swXSkgJiYgaXNUZXh0Tm9kZShsYXN0KSkge1xuICAgICAgICAgIHJlc1tsYXN0SW5kZXhdID0gY3JlYXRlVGV4dFZOb2RlKGxhc3QudGV4dCArIChjWzBdKS50ZXh0KTtcbiAgICAgICAgICBjLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzLnB1c2guYXBwbHkocmVzLCBjKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzUHJpbWl0aXZlKGMpKSB7XG4gICAgICBpZiAoaXNUZXh0Tm9kZShsYXN0KSkge1xuICAgICAgICAvLyBtZXJnZSBhZGphY2VudCB0ZXh0IG5vZGVzXG4gICAgICAgIC8vIHRoaXMgaXMgbmVjZXNzYXJ5IGZvciBTU1IgaHlkcmF0aW9uIGJlY2F1c2UgdGV4dCBub2RlcyBhcmVcbiAgICAgICAgLy8gZXNzZW50aWFsbHkgbWVyZ2VkIHdoZW4gcmVuZGVyZWQgdG8gSFRNTCBzdHJpbmdzXG4gICAgICAgIHJlc1tsYXN0SW5kZXhdID0gY3JlYXRlVGV4dFZOb2RlKGxhc3QudGV4dCArIGMpO1xuICAgICAgfSBlbHNlIGlmIChjICE9PSAnJykge1xuICAgICAgICAvLyBjb252ZXJ0IHByaW1pdGl2ZSB0byB2bm9kZVxuICAgICAgICByZXMucHVzaChjcmVhdGVUZXh0Vk5vZGUoYykpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNUZXh0Tm9kZShjKSAmJiBpc1RleHROb2RlKGxhc3QpKSB7XG4gICAgICAgIC8vIG1lcmdlIGFkamFjZW50IHRleHQgbm9kZXNcbiAgICAgICAgcmVzW2xhc3RJbmRleF0gPSBjcmVhdGVUZXh0Vk5vZGUobGFzdC50ZXh0ICsgYy50ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRlZmF1bHQga2V5IGZvciBuZXN0ZWQgYXJyYXkgY2hpbGRyZW4gKGxpa2VseSBnZW5lcmF0ZWQgYnkgdi1mb3IpXG4gICAgICAgIGlmIChpc1RydWUoY2hpbGRyZW4uX2lzVkxpc3QpICYmXG4gICAgICAgICAgaXNEZWYoYy50YWcpICYmXG4gICAgICAgICAgaXNVbmRlZihjLmtleSkgJiZcbiAgICAgICAgICBpc0RlZihuZXN0ZWRJbmRleCkpIHtcbiAgICAgICAgICBjLmtleSA9IFwiX192bGlzdFwiICsgbmVzdGVkSW5kZXggKyBcIl9cIiArIGkgKyBcIl9fXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmVzLnB1c2goYyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGluaXRQcm92aWRlICh2bSkge1xuICB2YXIgcHJvdmlkZSA9IHZtLiRvcHRpb25zLnByb3ZpZGU7XG4gIGlmIChwcm92aWRlKSB7XG4gICAgdm0uX3Byb3ZpZGVkID0gdHlwZW9mIHByb3ZpZGUgPT09ICdmdW5jdGlvbidcbiAgICAgID8gcHJvdmlkZS5jYWxsKHZtKVxuICAgICAgOiBwcm92aWRlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRJbmplY3Rpb25zICh2bSkge1xuICB2YXIgcmVzdWx0ID0gcmVzb2x2ZUluamVjdCh2bS4kb3B0aW9ucy5pbmplY3QsIHZtKTtcbiAgaWYgKHJlc3VsdCkge1xuICAgIHRvZ2dsZU9ic2VydmluZyhmYWxzZSk7XG4gICAgT2JqZWN0LmtleXMocmVzdWx0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBkZWZpbmVSZWFjdGl2ZSQkMSh2bSwga2V5LCByZXN1bHRba2V5XSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICBcIkF2b2lkIG11dGF0aW5nIGFuIGluamVjdGVkIHZhbHVlIGRpcmVjdGx5IHNpbmNlIHRoZSBjaGFuZ2VzIHdpbGwgYmUgXCIgK1xuICAgICAgICAgICAgXCJvdmVyd3JpdHRlbiB3aGVuZXZlciB0aGUgcHJvdmlkZWQgY29tcG9uZW50IHJlLXJlbmRlcnMuIFwiICtcbiAgICAgICAgICAgIFwiaW5qZWN0aW9uIGJlaW5nIG11dGF0ZWQ6IFxcXCJcIiArIGtleSArIFwiXFxcIlwiLFxuICAgICAgICAgICAgdm1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZmluZVJlYWN0aXZlJCQxKHZtLCBrZXksIHJlc3VsdFtrZXldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0b2dnbGVPYnNlcnZpbmcodHJ1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUluamVjdCAoaW5qZWN0LCB2bSkge1xuICBpZiAoaW5qZWN0KSB7XG4gICAgLy8gaW5qZWN0IGlzIDphbnkgYmVjYXVzZSBmbG93IGlzIG5vdCBzbWFydCBlbm91Z2ggdG8gZmlndXJlIG91dCBjYWNoZWRcbiAgICB2YXIgcmVzdWx0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB2YXIga2V5cyA9IGhhc1N5bWJvbFxuICAgICAgPyBSZWZsZWN0Lm93bktleXMoaW5qZWN0KVxuICAgICAgOiBPYmplY3Qua2V5cyhpbmplY3QpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIC8vICM2NTc0IGluIGNhc2UgdGhlIGluamVjdCBvYmplY3QgaXMgb2JzZXJ2ZWQuLi5cbiAgICAgIGlmIChrZXkgPT09ICdfX29iX18nKSB7IGNvbnRpbnVlIH1cbiAgICAgIHZhciBwcm92aWRlS2V5ID0gaW5qZWN0W2tleV0uZnJvbTtcbiAgICAgIHZhciBzb3VyY2UgPSB2bTtcbiAgICAgIHdoaWxlIChzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZS5fcHJvdmlkZWQgJiYgaGFzT3duKHNvdXJjZS5fcHJvdmlkZWQsIHByb3ZpZGVLZXkpKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBzb3VyY2UuX3Byb3ZpZGVkW3Byb3ZpZGVLZXldO1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgc291cmNlID0gc291cmNlLiRwYXJlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgICBpZiAoJ2RlZmF1bHQnIGluIGluamVjdFtrZXldKSB7XG4gICAgICAgICAgdmFyIHByb3ZpZGVEZWZhdWx0ID0gaW5qZWN0W2tleV0uZGVmYXVsdDtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHR5cGVvZiBwcm92aWRlRGVmYXVsdCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgPyBwcm92aWRlRGVmYXVsdC5jYWxsKHZtKVxuICAgICAgICAgICAgOiBwcm92aWRlRGVmYXVsdDtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgd2FybigoXCJJbmplY3Rpb24gXFxcIlwiICsga2V5ICsgXCJcXFwiIG5vdCBmb3VuZFwiKSwgdm0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuXG4vKiAgKi9cblxuXG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIHJlc29sdmluZyByYXcgY2hpbGRyZW4gVk5vZGVzIGludG8gYSBzbG90IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZVNsb3RzIChcbiAgY2hpbGRyZW4sXG4gIGNvbnRleHRcbikge1xuICBpZiAoIWNoaWxkcmVuIHx8ICFjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICByZXR1cm4ge31cbiAgfVxuICB2YXIgc2xvdHMgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICB2YXIgZGF0YSA9IGNoaWxkLmRhdGE7XG4gICAgLy8gcmVtb3ZlIHNsb3QgYXR0cmlidXRlIGlmIHRoZSBub2RlIGlzIHJlc29sdmVkIGFzIGEgVnVlIHNsb3Qgbm9kZVxuICAgIGlmIChkYXRhICYmIGRhdGEuYXR0cnMgJiYgZGF0YS5hdHRycy5zbG90KSB7XG4gICAgICBkZWxldGUgZGF0YS5hdHRycy5zbG90O1xuICAgIH1cbiAgICAvLyBuYW1lZCBzbG90cyBzaG91bGQgb25seSBiZSByZXNwZWN0ZWQgaWYgdGhlIHZub2RlIHdhcyByZW5kZXJlZCBpbiB0aGVcbiAgICAvLyBzYW1lIGNvbnRleHQuXG4gICAgaWYgKChjaGlsZC5jb250ZXh0ID09PSBjb250ZXh0IHx8IGNoaWxkLmZuQ29udGV4dCA9PT0gY29udGV4dCkgJiZcbiAgICAgIGRhdGEgJiYgZGF0YS5zbG90ICE9IG51bGxcbiAgICApIHtcbiAgICAgIHZhciBuYW1lID0gZGF0YS5zbG90O1xuICAgICAgdmFyIHNsb3QgPSAoc2xvdHNbbmFtZV0gfHwgKHNsb3RzW25hbWVdID0gW10pKTtcbiAgICAgIGlmIChjaGlsZC50YWcgPT09ICd0ZW1wbGF0ZScpIHtcbiAgICAgICAgc2xvdC5wdXNoLmFwcGx5KHNsb3QsIGNoaWxkLmNoaWxkcmVuIHx8IFtdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsb3QucHVzaChjaGlsZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGZpeGVkIGJ5IHh4eHh4eCDkuLTml7YgaGFjayDmjokgdW5pLWFwcCDkuK3nmoTlvILmraUgbmFtZSBzbG90IHBhZ2VcbiAgICAgIGlmKGNoaWxkLmFzeW5jTWV0YSAmJiBjaGlsZC5hc3luY01ldGEuZGF0YSAmJiBjaGlsZC5hc3luY01ldGEuZGF0YS5zbG90ID09PSAncGFnZScpe1xuICAgICAgICAoc2xvdHNbJ3BhZ2UnXSB8fCAoc2xvdHNbJ3BhZ2UnXSA9IFtdKSkucHVzaChjaGlsZCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgKHNsb3RzLmRlZmF1bHQgfHwgKHNsb3RzLmRlZmF1bHQgPSBbXSkpLnB1c2goY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBpZ25vcmUgc2xvdHMgdGhhdCBjb250YWlucyBvbmx5IHdoaXRlc3BhY2VcbiAgZm9yICh2YXIgbmFtZSQxIGluIHNsb3RzKSB7XG4gICAgaWYgKHNsb3RzW25hbWUkMV0uZXZlcnkoaXNXaGl0ZXNwYWNlKSkge1xuICAgICAgZGVsZXRlIHNsb3RzW25hbWUkMV07XG4gICAgfVxuICB9XG4gIHJldHVybiBzbG90c1xufVxuXG5mdW5jdGlvbiBpc1doaXRlc3BhY2UgKG5vZGUpIHtcbiAgcmV0dXJuIChub2RlLmlzQ29tbWVudCAmJiAhbm9kZS5hc3luY0ZhY3RvcnkpIHx8IG5vZGUudGV4dCA9PT0gJyAnXG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemVTY29wZWRTbG90cyAoXG4gIHNsb3RzLFxuICBub3JtYWxTbG90cyxcbiAgcHJldlNsb3RzXG4pIHtcbiAgdmFyIHJlcztcbiAgdmFyIGhhc05vcm1hbFNsb3RzID0gT2JqZWN0LmtleXMobm9ybWFsU2xvdHMpLmxlbmd0aCA+IDA7XG4gIHZhciBpc1N0YWJsZSA9IHNsb3RzID8gISFzbG90cy4kc3RhYmxlIDogIWhhc05vcm1hbFNsb3RzO1xuICB2YXIga2V5ID0gc2xvdHMgJiYgc2xvdHMuJGtleTtcbiAgaWYgKCFzbG90cykge1xuICAgIHJlcyA9IHt9O1xuICB9IGVsc2UgaWYgKHNsb3RzLl9ub3JtYWxpemVkKSB7XG4gICAgLy8gZmFzdCBwYXRoIDE6IGNoaWxkIGNvbXBvbmVudCByZS1yZW5kZXIgb25seSwgcGFyZW50IGRpZCBub3QgY2hhbmdlXG4gICAgcmV0dXJuIHNsb3RzLl9ub3JtYWxpemVkXG4gIH0gZWxzZSBpZiAoXG4gICAgaXNTdGFibGUgJiZcbiAgICBwcmV2U2xvdHMgJiZcbiAgICBwcmV2U2xvdHMgIT09IGVtcHR5T2JqZWN0ICYmXG4gICAga2V5ID09PSBwcmV2U2xvdHMuJGtleSAmJlxuICAgICFoYXNOb3JtYWxTbG90cyAmJlxuICAgICFwcmV2U2xvdHMuJGhhc05vcm1hbFxuICApIHtcbiAgICAvLyBmYXN0IHBhdGggMjogc3RhYmxlIHNjb3BlZCBzbG90cyB3LyBubyBub3JtYWwgc2xvdHMgdG8gcHJveHksXG4gICAgLy8gb25seSBuZWVkIHRvIG5vcm1hbGl6ZSBvbmNlXG4gICAgcmV0dXJuIHByZXZTbG90c1xuICB9IGVsc2Uge1xuICAgIHJlcyA9IHt9O1xuICAgIGZvciAodmFyIGtleSQxIGluIHNsb3RzKSB7XG4gICAgICBpZiAoc2xvdHNba2V5JDFdICYmIGtleSQxWzBdICE9PSAnJCcpIHtcbiAgICAgICAgcmVzW2tleSQxXSA9IG5vcm1hbGl6ZVNjb3BlZFNsb3Qobm9ybWFsU2xvdHMsIGtleSQxLCBzbG90c1trZXkkMV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBleHBvc2Ugbm9ybWFsIHNsb3RzIG9uIHNjb3BlZFNsb3RzXG4gIGZvciAodmFyIGtleSQyIGluIG5vcm1hbFNsb3RzKSB7XG4gICAgaWYgKCEoa2V5JDIgaW4gcmVzKSkge1xuICAgICAgcmVzW2tleSQyXSA9IHByb3h5Tm9ybWFsU2xvdChub3JtYWxTbG90cywga2V5JDIpO1xuICAgIH1cbiAgfVxuICAvLyBhdm9yaWF6IHNlZW1zIHRvIG1vY2sgYSBub24tZXh0ZW5zaWJsZSAkc2NvcGVkU2xvdHMgb2JqZWN0XG4gIC8vIGFuZCB3aGVuIHRoYXQgaXMgcGFzc2VkIGRvd24gdGhpcyB3b3VsZCBjYXVzZSBhbiBlcnJvclxuICBpZiAoc2xvdHMgJiYgT2JqZWN0LmlzRXh0ZW5zaWJsZShzbG90cykpIHtcbiAgICAoc2xvdHMpLl9ub3JtYWxpemVkID0gcmVzO1xuICB9XG4gIGRlZihyZXMsICckc3RhYmxlJywgaXNTdGFibGUpO1xuICBkZWYocmVzLCAnJGtleScsIGtleSk7XG4gIGRlZihyZXMsICckaGFzTm9ybWFsJywgaGFzTm9ybWFsU2xvdHMpO1xuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNjb3BlZFNsb3Qobm9ybWFsU2xvdHMsIGtleSwgZm4pIHtcbiAgdmFyIG5vcm1hbGl6ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlcyA9IGFyZ3VtZW50cy5sZW5ndGggPyBmbi5hcHBseShudWxsLCBhcmd1bWVudHMpIDogZm4oe30pO1xuICAgIHJlcyA9IHJlcyAmJiB0eXBlb2YgcmVzID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShyZXMpXG4gICAgICA/IFtyZXNdIC8vIHNpbmdsZSB2bm9kZVxuICAgICAgOiBub3JtYWxpemVDaGlsZHJlbihyZXMpO1xuICAgIHJldHVybiByZXMgJiYgKFxuICAgICAgcmVzLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgKHJlcy5sZW5ndGggPT09IDEgJiYgcmVzWzBdLmlzQ29tbWVudCkgLy8gIzk2NThcbiAgICApID8gdW5kZWZpbmVkXG4gICAgICA6IHJlc1xuICB9O1xuICAvLyB0aGlzIGlzIGEgc2xvdCB1c2luZyB0aGUgbmV3IHYtc2xvdCBzeW50YXggd2l0aG91dCBzY29wZS4gYWx0aG91Z2ggaXQgaXNcbiAgLy8gY29tcGlsZWQgYXMgYSBzY29wZWQgc2xvdCwgcmVuZGVyIGZuIHVzZXJzIHdvdWxkIGV4cGVjdCBpdCB0byBiZSBwcmVzZW50XG4gIC8vIG9uIHRoaXMuJHNsb3RzIGJlY2F1c2UgdGhlIHVzYWdlIGlzIHNlbWFudGljYWxseSBhIG5vcm1hbCBzbG90LlxuICBpZiAoZm4ucHJveHkpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobm9ybWFsU2xvdHMsIGtleSwge1xuICAgICAgZ2V0OiBub3JtYWxpemVkLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBub3JtYWxpemVkXG59XG5cbmZ1bmN0aW9uIHByb3h5Tm9ybWFsU2xvdChzbG90cywga2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBzbG90c1trZXldOyB9XG59XG5cbi8qICAqL1xuXG4vKipcbiAqIFJ1bnRpbWUgaGVscGVyIGZvciByZW5kZXJpbmcgdi1mb3IgbGlzdHMuXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckxpc3QgKFxuICB2YWwsXG4gIHJlbmRlclxuKSB7XG4gIHZhciByZXQsIGksIGwsIGtleXMsIGtleTtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSB8fCB0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHJldCA9IG5ldyBBcnJheSh2YWwubGVuZ3RoKTtcbiAgICBmb3IgKGkgPSAwLCBsID0gdmFsLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgcmV0W2ldID0gcmVuZGVyKHZhbFtpXSwgaSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgcmV0ID0gbmV3IEFycmF5KHZhbCk7XG4gICAgZm9yIChpID0gMDsgaSA8IHZhbDsgaSsrKSB7XG4gICAgICByZXRbaV0gPSByZW5kZXIoaSArIDEsIGkpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdCh2YWwpKSB7XG4gICAgaWYgKGhhc1N5bWJvbCAmJiB2YWxbU3ltYm9sLml0ZXJhdG9yXSkge1xuICAgICAgcmV0ID0gW107XG4gICAgICB2YXIgaXRlcmF0b3IgPSB2YWxbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgICAgdmFyIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIHdoaWxlICghcmVzdWx0LmRvbmUpIHtcbiAgICAgICAgcmV0LnB1c2gocmVuZGVyKHJlc3VsdC52YWx1ZSwgcmV0Lmxlbmd0aCkpO1xuICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBPYmplY3Qua2V5cyh2YWwpO1xuICAgICAgcmV0ID0gbmV3IEFycmF5KGtleXMubGVuZ3RoKTtcbiAgICAgIGZvciAoaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICByZXRbaV0gPSByZW5kZXIodmFsW2tleV0sIGtleSwgaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghaXNEZWYocmV0KSkge1xuICAgIHJldCA9IFtdO1xuICB9XG4gIChyZXQpLl9pc1ZMaXN0ID0gdHJ1ZTtcbiAgcmV0dXJuIHJldFxufVxuXG4vKiAgKi9cblxuLyoqXG4gKiBSdW50aW1lIGhlbHBlciBmb3IgcmVuZGVyaW5nIDxzbG90PlxuICovXG5mdW5jdGlvbiByZW5kZXJTbG90IChcbiAgbmFtZSxcbiAgZmFsbGJhY2ssXG4gIHByb3BzLFxuICBiaW5kT2JqZWN0XG4pIHtcbiAgdmFyIHNjb3BlZFNsb3RGbiA9IHRoaXMuJHNjb3BlZFNsb3RzW25hbWVdO1xuICB2YXIgbm9kZXM7XG4gIGlmIChzY29wZWRTbG90Rm4pIHsgLy8gc2NvcGVkIHNsb3RcbiAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xuICAgIGlmIChiaW5kT2JqZWN0KSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAhaXNPYmplY3QoYmluZE9iamVjdCkpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICAnc2xvdCB2LWJpbmQgd2l0aG91dCBhcmd1bWVudCBleHBlY3RzIGFuIE9iamVjdCcsXG4gICAgICAgICAgdGhpc1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcHJvcHMgPSBleHRlbmQoZXh0ZW5kKHt9LCBiaW5kT2JqZWN0KSwgcHJvcHMpO1xuICAgIH1cbiAgICBub2RlcyA9IHNjb3BlZFNsb3RGbihwcm9wcykgfHwgZmFsbGJhY2s7XG4gIH0gZWxzZSB7XG4gICAgbm9kZXMgPSB0aGlzLiRzbG90c1tuYW1lXSB8fCBmYWxsYmFjaztcbiAgfVxuXG4gIHZhciB0YXJnZXQgPSBwcm9wcyAmJiBwcm9wcy5zbG90O1xuICBpZiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJywgeyBzbG90OiB0YXJnZXQgfSwgbm9kZXMpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5vZGVzXG4gIH1cbn1cblxuLyogICovXG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIHJlc29sdmluZyBmaWx0ZXJzXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVGaWx0ZXIgKGlkKSB7XG4gIHJldHVybiByZXNvbHZlQXNzZXQodGhpcy4kb3B0aW9ucywgJ2ZpbHRlcnMnLCBpZCwgdHJ1ZSkgfHwgaWRlbnRpdHlcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGlzS2V5Tm90TWF0Y2ggKGV4cGVjdCwgYWN0dWFsKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGV4cGVjdCkpIHtcbiAgICByZXR1cm4gZXhwZWN0LmluZGV4T2YoYWN0dWFsKSA9PT0gLTFcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZXhwZWN0ICE9PSBhY3R1YWxcbiAgfVxufVxuXG4vKipcbiAqIFJ1bnRpbWUgaGVscGVyIGZvciBjaGVja2luZyBrZXlDb2RlcyBmcm9tIGNvbmZpZy5cbiAqIGV4cG9zZWQgYXMgVnVlLnByb3RvdHlwZS5fa1xuICogcGFzc2luZyBpbiBldmVudEtleU5hbWUgYXMgbGFzdCBhcmd1bWVudCBzZXBhcmF0ZWx5IGZvciBiYWNrd2FyZHMgY29tcGF0XG4gKi9cbmZ1bmN0aW9uIGNoZWNrS2V5Q29kZXMgKFxuICBldmVudEtleUNvZGUsXG4gIGtleSxcbiAgYnVpbHRJbktleUNvZGUsXG4gIGV2ZW50S2V5TmFtZSxcbiAgYnVpbHRJbktleU5hbWVcbikge1xuICB2YXIgbWFwcGVkS2V5Q29kZSA9IGNvbmZpZy5rZXlDb2Rlc1trZXldIHx8IGJ1aWx0SW5LZXlDb2RlO1xuICBpZiAoYnVpbHRJbktleU5hbWUgJiYgZXZlbnRLZXlOYW1lICYmICFjb25maWcua2V5Q29kZXNba2V5XSkge1xuICAgIHJldHVybiBpc0tleU5vdE1hdGNoKGJ1aWx0SW5LZXlOYW1lLCBldmVudEtleU5hbWUpXG4gIH0gZWxzZSBpZiAobWFwcGVkS2V5Q29kZSkge1xuICAgIHJldHVybiBpc0tleU5vdE1hdGNoKG1hcHBlZEtleUNvZGUsIGV2ZW50S2V5Q29kZSlcbiAgfSBlbHNlIGlmIChldmVudEtleU5hbWUpIHtcbiAgICByZXR1cm4gaHlwaGVuYXRlKGV2ZW50S2V5TmFtZSkgIT09IGtleVxuICB9XG59XG5cbi8qICAqL1xuXG4vKipcbiAqIFJ1bnRpbWUgaGVscGVyIGZvciBtZXJnaW5nIHYtYmluZD1cIm9iamVjdFwiIGludG8gYSBWTm9kZSdzIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGJpbmRPYmplY3RQcm9wcyAoXG4gIGRhdGEsXG4gIHRhZyxcbiAgdmFsdWUsXG4gIGFzUHJvcCxcbiAgaXNTeW5jXG4pIHtcbiAgaWYgKHZhbHVlKSB7XG4gICAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICAgJ3YtYmluZCB3aXRob3V0IGFyZ3VtZW50IGV4cGVjdHMgYW4gT2JqZWN0IG9yIEFycmF5IHZhbHVlJyxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdG9PYmplY3QodmFsdWUpO1xuICAgICAgfVxuICAgICAgdmFyIGhhc2g7XG4gICAgICB2YXIgbG9vcCA9IGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAga2V5ID09PSAnY2xhc3MnIHx8XG4gICAgICAgICAga2V5ID09PSAnc3R5bGUnIHx8XG4gICAgICAgICAgaXNSZXNlcnZlZEF0dHJpYnV0ZShrZXkpXG4gICAgICAgICkge1xuICAgICAgICAgIGhhc2ggPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB0eXBlID0gZGF0YS5hdHRycyAmJiBkYXRhLmF0dHJzLnR5cGU7XG4gICAgICAgICAgaGFzaCA9IGFzUHJvcCB8fCBjb25maWcubXVzdFVzZVByb3AodGFnLCB0eXBlLCBrZXkpXG4gICAgICAgICAgICA/IGRhdGEuZG9tUHJvcHMgfHwgKGRhdGEuZG9tUHJvcHMgPSB7fSlcbiAgICAgICAgICAgIDogZGF0YS5hdHRycyB8fCAoZGF0YS5hdHRycyA9IHt9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2FtZWxpemVkS2V5ID0gY2FtZWxpemUoa2V5KTtcbiAgICAgICAgdmFyIGh5cGhlbmF0ZWRLZXkgPSBoeXBoZW5hdGUoa2V5KTtcbiAgICAgICAgaWYgKCEoY2FtZWxpemVkS2V5IGluIGhhc2gpICYmICEoaHlwaGVuYXRlZEtleSBpbiBoYXNoKSkge1xuICAgICAgICAgIGhhc2hba2V5XSA9IHZhbHVlW2tleV07XG5cbiAgICAgICAgICBpZiAoaXNTeW5jKSB7XG4gICAgICAgICAgICB2YXIgb24gPSBkYXRhLm9uIHx8IChkYXRhLm9uID0ge30pO1xuICAgICAgICAgICAgb25bKFwidXBkYXRlOlwiICsga2V5KV0gPSBmdW5jdGlvbiAoJGV2ZW50KSB7XG4gICAgICAgICAgICAgIHZhbHVlW2tleV0gPSAkZXZlbnQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHZhbHVlKSBsb29wKCBrZXkgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGFcbn1cblxuLyogICovXG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIHJlbmRlcmluZyBzdGF0aWMgdHJlZXMuXG4gKi9cbmZ1bmN0aW9uIHJlbmRlclN0YXRpYyAoXG4gIGluZGV4LFxuICBpc0luRm9yXG4pIHtcbiAgdmFyIGNhY2hlZCA9IHRoaXMuX3N0YXRpY1RyZWVzIHx8ICh0aGlzLl9zdGF0aWNUcmVlcyA9IFtdKTtcbiAgdmFyIHRyZWUgPSBjYWNoZWRbaW5kZXhdO1xuICAvLyBpZiBoYXMgYWxyZWFkeS1yZW5kZXJlZCBzdGF0aWMgdHJlZSBhbmQgbm90IGluc2lkZSB2LWZvcixcbiAgLy8gd2UgY2FuIHJldXNlIHRoZSBzYW1lIHRyZWUuXG4gIGlmICh0cmVlICYmICFpc0luRm9yKSB7XG4gICAgcmV0dXJuIHRyZWVcbiAgfVxuICAvLyBvdGhlcndpc2UsIHJlbmRlciBhIGZyZXNoIHRyZWUuXG4gIHRyZWUgPSBjYWNoZWRbaW5kZXhdID0gdGhpcy4kb3B0aW9ucy5zdGF0aWNSZW5kZXJGbnNbaW5kZXhdLmNhbGwoXG4gICAgdGhpcy5fcmVuZGVyUHJveHksXG4gICAgbnVsbCxcbiAgICB0aGlzIC8vIGZvciByZW5kZXIgZm5zIGdlbmVyYXRlZCBmb3IgZnVuY3Rpb25hbCBjb21wb25lbnQgdGVtcGxhdGVzXG4gICk7XG4gIG1hcmtTdGF0aWModHJlZSwgKFwiX19zdGF0aWNfX1wiICsgaW5kZXgpLCBmYWxzZSk7XG4gIHJldHVybiB0cmVlXG59XG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIHYtb25jZS5cbiAqIEVmZmVjdGl2ZWx5IGl0IG1lYW5zIG1hcmtpbmcgdGhlIG5vZGUgYXMgc3RhdGljIHdpdGggYSB1bmlxdWUga2V5LlxuICovXG5mdW5jdGlvbiBtYXJrT25jZSAoXG4gIHRyZWUsXG4gIGluZGV4LFxuICBrZXlcbikge1xuICBtYXJrU3RhdGljKHRyZWUsIChcIl9fb25jZV9fXCIgKyBpbmRleCArIChrZXkgPyAoXCJfXCIgKyBrZXkpIDogXCJcIikpLCB0cnVlKTtcbiAgcmV0dXJuIHRyZWVcbn1cblxuZnVuY3Rpb24gbWFya1N0YXRpYyAoXG4gIHRyZWUsXG4gIGtleSxcbiAgaXNPbmNlXG4pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodHJlZSkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0cmVlW2ldICYmIHR5cGVvZiB0cmVlW2ldICE9PSAnc3RyaW5nJykge1xuICAgICAgICBtYXJrU3RhdGljTm9kZSh0cmVlW2ldLCAoa2V5ICsgXCJfXCIgKyBpKSwgaXNPbmNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbWFya1N0YXRpY05vZGUodHJlZSwga2V5LCBpc09uY2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcmtTdGF0aWNOb2RlIChub2RlLCBrZXksIGlzT25jZSkge1xuICBub2RlLmlzU3RhdGljID0gdHJ1ZTtcbiAgbm9kZS5rZXkgPSBrZXk7XG4gIG5vZGUuaXNPbmNlID0gaXNPbmNlO1xufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gYmluZE9iamVjdExpc3RlbmVycyAoZGF0YSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlKSB7XG4gICAgaWYgKCFpc1BsYWluT2JqZWN0KHZhbHVlKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxuICAgICAgICAndi1vbiB3aXRob3V0IGFyZ3VtZW50IGV4cGVjdHMgYW4gT2JqZWN0IHZhbHVlJyxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG9uID0gZGF0YS5vbiA9IGRhdGEub24gPyBleHRlbmQoe30sIGRhdGEub24pIDoge307XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICAgICAgdmFyIGV4aXN0aW5nID0gb25ba2V5XTtcbiAgICAgICAgdmFyIG91cnMgPSB2YWx1ZVtrZXldO1xuICAgICAgICBvbltrZXldID0gZXhpc3RpbmcgPyBbXS5jb25jYXQoZXhpc3RpbmcsIG91cnMpIDogb3VycztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGFcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIHJlc29sdmVTY29wZWRTbG90cyAoXG4gIGZucywgLy8gc2VlIGZsb3cvdm5vZGVcbiAgcmVzLFxuICAvLyB0aGUgZm9sbG93aW5nIGFyZSBhZGRlZCBpbiAyLjZcbiAgaGFzRHluYW1pY0tleXMsXG4gIGNvbnRlbnRIYXNoS2V5XG4pIHtcbiAgcmVzID0gcmVzIHx8IHsgJHN0YWJsZTogIWhhc0R5bmFtaWNLZXlzIH07XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNsb3QgPSBmbnNbaV07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc2xvdCkpIHtcbiAgICAgIHJlc29sdmVTY29wZWRTbG90cyhzbG90LCByZXMsIGhhc0R5bmFtaWNLZXlzKTtcbiAgICB9IGVsc2UgaWYgKHNsb3QpIHtcbiAgICAgIC8vIG1hcmtlciBmb3IgcmV2ZXJzZSBwcm94eWluZyB2LXNsb3Qgd2l0aG91dCBzY29wZSBvbiB0aGlzLiRzbG90c1xuICAgICAgaWYgKHNsb3QucHJveHkpIHtcbiAgICAgICAgc2xvdC5mbi5wcm94eSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXNbc2xvdC5rZXldID0gc2xvdC5mbjtcbiAgICB9XG4gIH1cbiAgaWYgKGNvbnRlbnRIYXNoS2V5KSB7XG4gICAgKHJlcykuJGtleSA9IGNvbnRlbnRIYXNoS2V5O1xuICB9XG4gIHJldHVybiByZXNcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGJpbmREeW5hbWljS2V5cyAoYmFzZU9iaiwgdmFsdWVzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgdmFyIGtleSA9IHZhbHVlc1tpXTtcbiAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycgJiYga2V5KSB7XG4gICAgICBiYXNlT2JqW3ZhbHVlc1tpXV0gPSB2YWx1ZXNbaSArIDFdO1xuICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBrZXkgIT09ICcnICYmIGtleSAhPT0gbnVsbCkge1xuICAgICAgLy8gbnVsbCBpcyBhIHNwZWljYWwgdmFsdWUgZm9yIGV4cGxpY2l0bHkgcmVtb3ZpbmcgYSBiaW5kaW5nXG4gICAgICB3YXJuKFxuICAgICAgICAoXCJJbnZhbGlkIHZhbHVlIGZvciBkeW5hbWljIGRpcmVjdGl2ZSBhcmd1bWVudCAoZXhwZWN0ZWQgc3RyaW5nIG9yIG51bGwpOiBcIiArIGtleSksXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBiYXNlT2JqXG59XG5cbi8vIGhlbHBlciB0byBkeW5hbWljYWxseSBhcHBlbmQgbW9kaWZpZXIgcnVudGltZSBtYXJrZXJzIHRvIGV2ZW50IG5hbWVzLlxuLy8gZW5zdXJlIG9ubHkgYXBwZW5kIHdoZW4gdmFsdWUgaXMgYWxyZWFkeSBzdHJpbmcsIG90aGVyd2lzZSBpdCB3aWxsIGJlIGNhc3Rcbi8vIHRvIHN0cmluZyBhbmQgY2F1c2UgdGhlIHR5cGUgY2hlY2sgdG8gbWlzcy5cbmZ1bmN0aW9uIHByZXBlbmRNb2RpZmllciAodmFsdWUsIHN5bWJvbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHN5bWJvbCArIHZhbHVlIDogdmFsdWVcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGluc3RhbGxSZW5kZXJIZWxwZXJzICh0YXJnZXQpIHtcbiAgdGFyZ2V0Ll9vID0gbWFya09uY2U7XG4gIHRhcmdldC5fbiA9IHRvTnVtYmVyO1xuICB0YXJnZXQuX3MgPSB0b1N0cmluZztcbiAgdGFyZ2V0Ll9sID0gcmVuZGVyTGlzdDtcbiAgdGFyZ2V0Ll90ID0gcmVuZGVyU2xvdDtcbiAgdGFyZ2V0Ll9xID0gbG9vc2VFcXVhbDtcbiAgdGFyZ2V0Ll9pID0gbG9vc2VJbmRleE9mO1xuICB0YXJnZXQuX20gPSByZW5kZXJTdGF0aWM7XG4gIHRhcmdldC5fZiA9IHJlc29sdmVGaWx0ZXI7XG4gIHRhcmdldC5fayA9IGNoZWNrS2V5Q29kZXM7XG4gIHRhcmdldC5fYiA9IGJpbmRPYmplY3RQcm9wcztcbiAgdGFyZ2V0Ll92ID0gY3JlYXRlVGV4dFZOb2RlO1xuICB0YXJnZXQuX2UgPSBjcmVhdGVFbXB0eVZOb2RlO1xuICB0YXJnZXQuX3UgPSByZXNvbHZlU2NvcGVkU2xvdHM7XG4gIHRhcmdldC5fZyA9IGJpbmRPYmplY3RMaXN0ZW5lcnM7XG4gIHRhcmdldC5fZCA9IGJpbmREeW5hbWljS2V5cztcbiAgdGFyZ2V0Ll9wID0gcHJlcGVuZE1vZGlmaWVyO1xufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gRnVuY3Rpb25hbFJlbmRlckNvbnRleHQgKFxuICBkYXRhLFxuICBwcm9wcyxcbiAgY2hpbGRyZW4sXG4gIHBhcmVudCxcbiAgQ3RvclxuKSB7XG4gIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIHZhciBvcHRpb25zID0gQ3Rvci5vcHRpb25zO1xuICAvLyBlbnN1cmUgdGhlIGNyZWF0ZUVsZW1lbnQgZnVuY3Rpb24gaW4gZnVuY3Rpb25hbCBjb21wb25lbnRzXG4gIC8vIGdldHMgYSB1bmlxdWUgY29udGV4dCAtIHRoaXMgaXMgbmVjZXNzYXJ5IGZvciBjb3JyZWN0IG5hbWVkIHNsb3QgY2hlY2tcbiAgdmFyIGNvbnRleHRWbTtcbiAgaWYgKGhhc093bihwYXJlbnQsICdfdWlkJykpIHtcbiAgICBjb250ZXh0Vm0gPSBPYmplY3QuY3JlYXRlKHBhcmVudCk7XG4gICAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXG4gICAgY29udGV4dFZtLl9vcmlnaW5hbCA9IHBhcmVudDtcbiAgfSBlbHNlIHtcbiAgICAvLyB0aGUgY29udGV4dCB2bSBwYXNzZWQgaW4gaXMgYSBmdW5jdGlvbmFsIGNvbnRleHQgYXMgd2VsbC5cbiAgICAvLyBpbiB0aGlzIGNhc2Ugd2Ugd2FudCB0byBtYWtlIHN1cmUgd2UgYXJlIGFibGUgdG8gZ2V0IGEgaG9sZCB0byB0aGVcbiAgICAvLyByZWFsIGNvbnRleHQgaW5zdGFuY2UuXG4gICAgY29udGV4dFZtID0gcGFyZW50O1xuICAgIC8vICRmbG93LWRpc2FibGUtbGluZVxuICAgIHBhcmVudCA9IHBhcmVudC5fb3JpZ2luYWw7XG4gIH1cbiAgdmFyIGlzQ29tcGlsZWQgPSBpc1RydWUob3B0aW9ucy5fY29tcGlsZWQpO1xuICB2YXIgbmVlZE5vcm1hbGl6YXRpb24gPSAhaXNDb21waWxlZDtcblxuICB0aGlzLmRhdGEgPSBkYXRhO1xuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMubGlzdGVuZXJzID0gZGF0YS5vbiB8fCBlbXB0eU9iamVjdDtcbiAgdGhpcy5pbmplY3Rpb25zID0gcmVzb2x2ZUluamVjdChvcHRpb25zLmluamVjdCwgcGFyZW50KTtcbiAgdGhpcy5zbG90cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMkMS4kc2xvdHMpIHtcbiAgICAgIG5vcm1hbGl6ZVNjb3BlZFNsb3RzKFxuICAgICAgICBkYXRhLnNjb3BlZFNsb3RzLFxuICAgICAgICB0aGlzJDEuJHNsb3RzID0gcmVzb2x2ZVNsb3RzKGNoaWxkcmVuLCBwYXJlbnQpXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcyQxLiRzbG90c1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2NvcGVkU2xvdHMnLCAoe1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQgKCkge1xuICAgICAgcmV0dXJuIG5vcm1hbGl6ZVNjb3BlZFNsb3RzKGRhdGEuc2NvcGVkU2xvdHMsIHRoaXMuc2xvdHMoKSlcbiAgICB9XG4gIH0pKTtcblxuICAvLyBzdXBwb3J0IGZvciBjb21waWxlZCBmdW5jdGlvbmFsIHRlbXBsYXRlXG4gIGlmIChpc0NvbXBpbGVkKSB7XG4gICAgLy8gZXhwb3NpbmcgJG9wdGlvbnMgZm9yIHJlbmRlclN0YXRpYygpXG4gICAgdGhpcy4kb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgLy8gcHJlLXJlc29sdmUgc2xvdHMgZm9yIHJlbmRlclNsb3QoKVxuICAgIHRoaXMuJHNsb3RzID0gdGhpcy5zbG90cygpO1xuICAgIHRoaXMuJHNjb3BlZFNsb3RzID0gbm9ybWFsaXplU2NvcGVkU2xvdHMoZGF0YS5zY29wZWRTbG90cywgdGhpcy4kc2xvdHMpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuX3Njb3BlSWQpIHtcbiAgICB0aGlzLl9jID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHtcbiAgICAgIHZhciB2bm9kZSA9IGNyZWF0ZUVsZW1lbnQoY29udGV4dFZtLCBhLCBiLCBjLCBkLCBuZWVkTm9ybWFsaXphdGlvbik7XG4gICAgICBpZiAodm5vZGUgJiYgIUFycmF5LmlzQXJyYXkodm5vZGUpKSB7XG4gICAgICAgIHZub2RlLmZuU2NvcGVJZCA9IG9wdGlvbnMuX3Njb3BlSWQ7XG4gICAgICAgIHZub2RlLmZuQ29udGV4dCA9IHBhcmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2bm9kZVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fYyA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7IHJldHVybiBjcmVhdGVFbGVtZW50KGNvbnRleHRWbSwgYSwgYiwgYywgZCwgbmVlZE5vcm1hbGl6YXRpb24pOyB9O1xuICB9XG59XG5cbmluc3RhbGxSZW5kZXJIZWxwZXJzKEZ1bmN0aW9uYWxSZW5kZXJDb250ZXh0LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUZ1bmN0aW9uYWxDb21wb25lbnQgKFxuICBDdG9yLFxuICBwcm9wc0RhdGEsXG4gIGRhdGEsXG4gIGNvbnRleHRWbSxcbiAgY2hpbGRyZW5cbikge1xuICB2YXIgb3B0aW9ucyA9IEN0b3Iub3B0aW9ucztcbiAgdmFyIHByb3BzID0ge307XG4gIHZhciBwcm9wT3B0aW9ucyA9IG9wdGlvbnMucHJvcHM7XG4gIGlmIChpc0RlZihwcm9wT3B0aW9ucykpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcE9wdGlvbnMpIHtcbiAgICAgIHByb3BzW2tleV0gPSB2YWxpZGF0ZVByb3Aoa2V5LCBwcm9wT3B0aW9ucywgcHJvcHNEYXRhIHx8IGVtcHR5T2JqZWN0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGlzRGVmKGRhdGEuYXR0cnMpKSB7IG1lcmdlUHJvcHMocHJvcHMsIGRhdGEuYXR0cnMpOyB9XG4gICAgaWYgKGlzRGVmKGRhdGEucHJvcHMpKSB7IG1lcmdlUHJvcHMocHJvcHMsIGRhdGEucHJvcHMpOyB9XG4gIH1cblxuICB2YXIgcmVuZGVyQ29udGV4dCA9IG5ldyBGdW5jdGlvbmFsUmVuZGVyQ29udGV4dChcbiAgICBkYXRhLFxuICAgIHByb3BzLFxuICAgIGNoaWxkcmVuLFxuICAgIGNvbnRleHRWbSxcbiAgICBDdG9yXG4gICk7XG5cbiAgdmFyIHZub2RlID0gb3B0aW9ucy5yZW5kZXIuY2FsbChudWxsLCByZW5kZXJDb250ZXh0Ll9jLCByZW5kZXJDb250ZXh0KTtcblxuICBpZiAodm5vZGUgaW5zdGFuY2VvZiBWTm9kZSkge1xuICAgIHJldHVybiBjbG9uZUFuZE1hcmtGdW5jdGlvbmFsUmVzdWx0KHZub2RlLCBkYXRhLCByZW5kZXJDb250ZXh0LnBhcmVudCwgb3B0aW9ucywgcmVuZGVyQ29udGV4dClcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZub2RlKSkge1xuICAgIHZhciB2bm9kZXMgPSBub3JtYWxpemVDaGlsZHJlbih2bm9kZSkgfHwgW107XG4gICAgdmFyIHJlcyA9IG5ldyBBcnJheSh2bm9kZXMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzW2ldID0gY2xvbmVBbmRNYXJrRnVuY3Rpb25hbFJlc3VsdCh2bm9kZXNbaV0sIGRhdGEsIHJlbmRlckNvbnRleHQucGFyZW50LCBvcHRpb25zLCByZW5kZXJDb250ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5cbmZ1bmN0aW9uIGNsb25lQW5kTWFya0Z1bmN0aW9uYWxSZXN1bHQgKHZub2RlLCBkYXRhLCBjb250ZXh0Vm0sIG9wdGlvbnMsIHJlbmRlckNvbnRleHQpIHtcbiAgLy8gIzc4MTcgY2xvbmUgbm9kZSBiZWZvcmUgc2V0dGluZyBmbkNvbnRleHQsIG90aGVyd2lzZSBpZiB0aGUgbm9kZSBpcyByZXVzZWRcbiAgLy8gKGUuZy4gaXQgd2FzIGZyb20gYSBjYWNoZWQgbm9ybWFsIHNsb3QpIHRoZSBmbkNvbnRleHQgY2F1c2VzIG5hbWVkIHNsb3RzXG4gIC8vIHRoYXQgc2hvdWxkIG5vdCBiZSBtYXRjaGVkIHRvIG1hdGNoLlxuICB2YXIgY2xvbmUgPSBjbG9uZVZOb2RlKHZub2RlKTtcbiAgY2xvbmUuZm5Db250ZXh0ID0gY29udGV4dFZtO1xuICBjbG9uZS5mbk9wdGlvbnMgPSBvcHRpb25zO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIChjbG9uZS5kZXZ0b29sc01ldGEgPSBjbG9uZS5kZXZ0b29sc01ldGEgfHwge30pLnJlbmRlckNvbnRleHQgPSByZW5kZXJDb250ZXh0O1xuICB9XG4gIGlmIChkYXRhLnNsb3QpIHtcbiAgICAoY2xvbmUuZGF0YSB8fCAoY2xvbmUuZGF0YSA9IHt9KSkuc2xvdCA9IGRhdGEuc2xvdDtcbiAgfVxuICByZXR1cm4gY2xvbmVcbn1cblxuZnVuY3Rpb24gbWVyZ2VQcm9wcyAodG8sIGZyb20pIHtcbiAgZm9yICh2YXIga2V5IGluIGZyb20pIHtcbiAgICB0b1tjYW1lbGl6ZShrZXkpXSA9IGZyb21ba2V5XTtcbiAgfVxufVxuXG4vKiAgKi9cblxuLyogICovXG5cbi8qICAqL1xuXG4vKiAgKi9cblxuLy8gaW5saW5lIGhvb2tzIHRvIGJlIGludm9rZWQgb24gY29tcG9uZW50IFZOb2RlcyBkdXJpbmcgcGF0Y2hcbnZhciBjb21wb25lbnRWTm9kZUhvb2tzID0ge1xuICBpbml0OiBmdW5jdGlvbiBpbml0ICh2bm9kZSwgaHlkcmF0aW5nKSB7XG4gICAgaWYgKFxuICAgICAgdm5vZGUuY29tcG9uZW50SW5zdGFuY2UgJiZcbiAgICAgICF2bm9kZS5jb21wb25lbnRJbnN0YW5jZS5faXNEZXN0cm95ZWQgJiZcbiAgICAgIHZub2RlLmRhdGEua2VlcEFsaXZlXG4gICAgKSB7XG4gICAgICAvLyBrZXB0LWFsaXZlIGNvbXBvbmVudHMsIHRyZWF0IGFzIGEgcGF0Y2hcbiAgICAgIHZhciBtb3VudGVkTm9kZSA9IHZub2RlOyAvLyB3b3JrIGFyb3VuZCBmbG93XG4gICAgICBjb21wb25lbnRWTm9kZUhvb2tzLnByZXBhdGNoKG1vdW50ZWROb2RlLCBtb3VudGVkTm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjaGlsZCA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VGb3JWbm9kZShcbiAgICAgICAgdm5vZGUsXG4gICAgICAgIGFjdGl2ZUluc3RhbmNlXG4gICAgICApO1xuICAgICAgY2hpbGQuJG1vdW50KGh5ZHJhdGluZyA/IHZub2RlLmVsbSA6IHVuZGVmaW5lZCwgaHlkcmF0aW5nKTtcbiAgICB9XG4gIH0sXG5cbiAgcHJlcGF0Y2g6IGZ1bmN0aW9uIHByZXBhdGNoIChvbGRWbm9kZSwgdm5vZGUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHZub2RlLmNvbXBvbmVudE9wdGlvbnM7XG4gICAgdmFyIGNoaWxkID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2UgPSBvbGRWbm9kZS5jb21wb25lbnRJbnN0YW5jZTtcbiAgICB1cGRhdGVDaGlsZENvbXBvbmVudChcbiAgICAgIGNoaWxkLFxuICAgICAgb3B0aW9ucy5wcm9wc0RhdGEsIC8vIHVwZGF0ZWQgcHJvcHNcbiAgICAgIG9wdGlvbnMubGlzdGVuZXJzLCAvLyB1cGRhdGVkIGxpc3RlbmVyc1xuICAgICAgdm5vZGUsIC8vIG5ldyBwYXJlbnQgdm5vZGVcbiAgICAgIG9wdGlvbnMuY2hpbGRyZW4gLy8gbmV3IGNoaWxkcmVuXG4gICAgKTtcbiAgfSxcblxuICBpbnNlcnQ6IGZ1bmN0aW9uIGluc2VydCAodm5vZGUpIHtcbiAgICB2YXIgY29udGV4dCA9IHZub2RlLmNvbnRleHQ7XG4gICAgdmFyIGNvbXBvbmVudEluc3RhbmNlID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2U7XG4gICAgaWYgKCFjb21wb25lbnRJbnN0YW5jZS5faXNNb3VudGVkKSB7XG4gICAgICBjb21wb25lbnRJbnN0YW5jZS5faXNNb3VudGVkID0gdHJ1ZTtcbiAgICAgIGNhbGxIb29rKGNvbXBvbmVudEluc3RhbmNlLCAnbW91bnRlZCcpO1xuICAgIH1cbiAgICBpZiAodm5vZGUuZGF0YS5rZWVwQWxpdmUpIHtcbiAgICAgIGlmIChjb250ZXh0Ll9pc01vdW50ZWQpIHtcbiAgICAgICAgLy8gdnVlLXJvdXRlciMxMjEyXG4gICAgICAgIC8vIER1cmluZyB1cGRhdGVzLCBhIGtlcHQtYWxpdmUgY29tcG9uZW50J3MgY2hpbGQgY29tcG9uZW50cyBtYXlcbiAgICAgICAgLy8gY2hhbmdlLCBzbyBkaXJlY3RseSB3YWxraW5nIHRoZSB0cmVlIGhlcmUgbWF5IGNhbGwgYWN0aXZhdGVkIGhvb2tzXG4gICAgICAgIC8vIG9uIGluY29ycmVjdCBjaGlsZHJlbi4gSW5zdGVhZCB3ZSBwdXNoIHRoZW0gaW50byBhIHF1ZXVlIHdoaWNoIHdpbGxcbiAgICAgICAgLy8gYmUgcHJvY2Vzc2VkIGFmdGVyIHRoZSB3aG9sZSBwYXRjaCBwcm9jZXNzIGVuZGVkLlxuICAgICAgICBxdWV1ZUFjdGl2YXRlZENvbXBvbmVudChjb21wb25lbnRJbnN0YW5jZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY3RpdmF0ZUNoaWxkQ29tcG9uZW50KGNvbXBvbmVudEluc3RhbmNlLCB0cnVlIC8qIGRpcmVjdCAqLyk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3kgKHZub2RlKSB7XG4gICAgdmFyIGNvbXBvbmVudEluc3RhbmNlID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2U7XG4gICAgaWYgKCFjb21wb25lbnRJbnN0YW5jZS5faXNEZXN0cm95ZWQpIHtcbiAgICAgIGlmICghdm5vZGUuZGF0YS5rZWVwQWxpdmUpIHtcbiAgICAgICAgY29tcG9uZW50SW5zdGFuY2UuJGRlc3Ryb3koKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlYWN0aXZhdGVDaGlsZENvbXBvbmVudChjb21wb25lbnRJbnN0YW5jZSwgdHJ1ZSAvKiBkaXJlY3QgKi8pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGhvb2tzVG9NZXJnZSA9IE9iamVjdC5rZXlzKGNvbXBvbmVudFZOb2RlSG9va3MpO1xuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQgKFxuICBDdG9yLFxuICBkYXRhLFxuICBjb250ZXh0LFxuICBjaGlsZHJlbixcbiAgdGFnXG4pIHtcbiAgaWYgKGlzVW5kZWYoQ3RvcikpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBiYXNlQ3RvciA9IGNvbnRleHQuJG9wdGlvbnMuX2Jhc2U7XG5cbiAgLy8gcGxhaW4gb3B0aW9ucyBvYmplY3Q6IHR1cm4gaXQgaW50byBhIGNvbnN0cnVjdG9yXG4gIGlmIChpc09iamVjdChDdG9yKSkge1xuICAgIEN0b3IgPSBiYXNlQ3Rvci5leHRlbmQoQ3Rvcik7XG4gIH1cblxuICAvLyBpZiBhdCB0aGlzIHN0YWdlIGl0J3Mgbm90IGEgY29uc3RydWN0b3Igb3IgYW4gYXN5bmMgY29tcG9uZW50IGZhY3RvcnksXG4gIC8vIHJlamVjdC5cbiAgaWYgKHR5cGVvZiBDdG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHdhcm4oKFwiSW52YWxpZCBDb21wb25lbnQgZGVmaW5pdGlvbjogXCIgKyAoU3RyaW5nKEN0b3IpKSksIGNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIGFzeW5jIGNvbXBvbmVudFxuICB2YXIgYXN5bmNGYWN0b3J5O1xuICBpZiAoaXNVbmRlZihDdG9yLmNpZCkpIHtcbiAgICBhc3luY0ZhY3RvcnkgPSBDdG9yO1xuICAgIEN0b3IgPSByZXNvbHZlQXN5bmNDb21wb25lbnQoYXN5bmNGYWN0b3J5LCBiYXNlQ3Rvcik7XG4gICAgaWYgKEN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gcmV0dXJuIGEgcGxhY2Vob2xkZXIgbm9kZSBmb3IgYXN5bmMgY29tcG9uZW50LCB3aGljaCBpcyByZW5kZXJlZFxuICAgICAgLy8gYXMgYSBjb21tZW50IG5vZGUgYnV0IHByZXNlcnZlcyBhbGwgdGhlIHJhdyBpbmZvcm1hdGlvbiBmb3IgdGhlIG5vZGUuXG4gICAgICAvLyB0aGUgaW5mb3JtYXRpb24gd2lsbCBiZSB1c2VkIGZvciBhc3luYyBzZXJ2ZXItcmVuZGVyaW5nIGFuZCBoeWRyYXRpb24uXG4gICAgICByZXR1cm4gY3JlYXRlQXN5bmNQbGFjZWhvbGRlcihcbiAgICAgICAgYXN5bmNGYWN0b3J5LFxuICAgICAgICBkYXRhLFxuICAgICAgICBjb250ZXh0LFxuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgdGFnXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgZGF0YSA9IGRhdGEgfHwge307XG5cbiAgLy8gcmVzb2x2ZSBjb25zdHJ1Y3RvciBvcHRpb25zIGluIGNhc2UgZ2xvYmFsIG1peGlucyBhcmUgYXBwbGllZCBhZnRlclxuICAvLyBjb21wb25lbnQgY29uc3RydWN0b3IgY3JlYXRpb25cbiAgcmVzb2x2ZUNvbnN0cnVjdG9yT3B0aW9ucyhDdG9yKTtcblxuICAvLyB0cmFuc2Zvcm0gY29tcG9uZW50IHYtbW9kZWwgZGF0YSBpbnRvIHByb3BzICYgZXZlbnRzXG4gIGlmIChpc0RlZihkYXRhLm1vZGVsKSkge1xuICAgIHRyYW5zZm9ybU1vZGVsKEN0b3Iub3B0aW9ucywgZGF0YSk7XG4gIH1cblxuICAvLyBleHRyYWN0IHByb3BzXG4gIHZhciBwcm9wc0RhdGEgPSBleHRyYWN0UHJvcHNGcm9tVk5vZGVEYXRhKGRhdGEsIEN0b3IsIHRhZyk7XG5cbiAgLy8gZnVuY3Rpb25hbCBjb21wb25lbnRcbiAgaWYgKGlzVHJ1ZShDdG9yLm9wdGlvbnMuZnVuY3Rpb25hbCkpIHtcbiAgICByZXR1cm4gY3JlYXRlRnVuY3Rpb25hbENvbXBvbmVudChDdG9yLCBwcm9wc0RhdGEsIGRhdGEsIGNvbnRleHQsIGNoaWxkcmVuKVxuICB9XG5cbiAgLy8gZXh0cmFjdCBsaXN0ZW5lcnMsIHNpbmNlIHRoZXNlIG5lZWRzIHRvIGJlIHRyZWF0ZWQgYXNcbiAgLy8gY2hpbGQgY29tcG9uZW50IGxpc3RlbmVycyBpbnN0ZWFkIG9mIERPTSBsaXN0ZW5lcnNcbiAgdmFyIGxpc3RlbmVycyA9IGRhdGEub247XG4gIC8vIHJlcGxhY2Ugd2l0aCBsaXN0ZW5lcnMgd2l0aCAubmF0aXZlIG1vZGlmaWVyXG4gIC8vIHNvIGl0IGdldHMgcHJvY2Vzc2VkIGR1cmluZyBwYXJlbnQgY29tcG9uZW50IHBhdGNoLlxuICBkYXRhLm9uID0gZGF0YS5uYXRpdmVPbjtcblxuICBpZiAoaXNUcnVlKEN0b3Iub3B0aW9ucy5hYnN0cmFjdCkpIHtcbiAgICAvLyBhYnN0cmFjdCBjb21wb25lbnRzIGRvIG5vdCBrZWVwIGFueXRoaW5nXG4gICAgLy8gb3RoZXIgdGhhbiBwcm9wcyAmIGxpc3RlbmVycyAmIHNsb3RcblxuICAgIC8vIHdvcmsgYXJvdW5kIGZsb3dcbiAgICB2YXIgc2xvdCA9IGRhdGEuc2xvdDtcbiAgICBkYXRhID0ge307XG4gICAgaWYgKHNsb3QpIHtcbiAgICAgIGRhdGEuc2xvdCA9IHNsb3Q7XG4gICAgfVxuICB9XG5cbiAgLy8gaW5zdGFsbCBjb21wb25lbnQgbWFuYWdlbWVudCBob29rcyBvbnRvIHRoZSBwbGFjZWhvbGRlciBub2RlXG4gIGluc3RhbGxDb21wb25lbnRIb29rcyhkYXRhKTtcblxuICAvLyByZXR1cm4gYSBwbGFjZWhvbGRlciB2bm9kZVxuICB2YXIgbmFtZSA9IEN0b3Iub3B0aW9ucy5uYW1lIHx8IHRhZztcbiAgdmFyIHZub2RlID0gbmV3IFZOb2RlKFxuICAgIChcInZ1ZS1jb21wb25lbnQtXCIgKyAoQ3Rvci5jaWQpICsgKG5hbWUgPyAoXCItXCIgKyBuYW1lKSA6ICcnKSksXG4gICAgZGF0YSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29udGV4dCxcbiAgICB7IEN0b3I6IEN0b3IsIHByb3BzRGF0YTogcHJvcHNEYXRhLCBsaXN0ZW5lcnM6IGxpc3RlbmVycywgdGFnOiB0YWcsIGNoaWxkcmVuOiBjaGlsZHJlbiB9LFxuICAgIGFzeW5jRmFjdG9yeVxuICApO1xuXG4gIHJldHVybiB2bm9kZVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnRJbnN0YW5jZUZvclZub2RlIChcbiAgdm5vZGUsIC8vIHdlIGtub3cgaXQncyBNb3VudGVkQ29tcG9uZW50Vk5vZGUgYnV0IGZsb3cgZG9lc24ndFxuICBwYXJlbnQgLy8gYWN0aXZlSW5zdGFuY2UgaW4gbGlmZWN5Y2xlIHN0YXRlXG4pIHtcbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgX2lzQ29tcG9uZW50OiB0cnVlLFxuICAgIF9wYXJlbnRWbm9kZTogdm5vZGUsXG4gICAgcGFyZW50OiBwYXJlbnRcbiAgfTtcbiAgLy8gY2hlY2sgaW5saW5lLXRlbXBsYXRlIHJlbmRlciBmdW5jdGlvbnNcbiAgdmFyIGlubGluZVRlbXBsYXRlID0gdm5vZGUuZGF0YS5pbmxpbmVUZW1wbGF0ZTtcbiAgaWYgKGlzRGVmKGlubGluZVRlbXBsYXRlKSkge1xuICAgIG9wdGlvbnMucmVuZGVyID0gaW5saW5lVGVtcGxhdGUucmVuZGVyO1xuICAgIG9wdGlvbnMuc3RhdGljUmVuZGVyRm5zID0gaW5saW5lVGVtcGxhdGUuc3RhdGljUmVuZGVyRm5zO1xuICB9XG4gIHJldHVybiBuZXcgdm5vZGUuY29tcG9uZW50T3B0aW9ucy5DdG9yKG9wdGlvbnMpXG59XG5cbmZ1bmN0aW9uIGluc3RhbGxDb21wb25lbnRIb29rcyAoZGF0YSkge1xuICB2YXIgaG9va3MgPSBkYXRhLmhvb2sgfHwgKGRhdGEuaG9vayA9IHt9KTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBob29rc1RvTWVyZ2UubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0gaG9va3NUb01lcmdlW2ldO1xuICAgIHZhciBleGlzdGluZyA9IGhvb2tzW2tleV07XG4gICAgdmFyIHRvTWVyZ2UgPSBjb21wb25lbnRWTm9kZUhvb2tzW2tleV07XG4gICAgaWYgKGV4aXN0aW5nICE9PSB0b01lcmdlICYmICEoZXhpc3RpbmcgJiYgZXhpc3RpbmcuX21lcmdlZCkpIHtcbiAgICAgIGhvb2tzW2tleV0gPSBleGlzdGluZyA/IG1lcmdlSG9vayQxKHRvTWVyZ2UsIGV4aXN0aW5nKSA6IHRvTWVyZ2U7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlSG9vayQxIChmMSwgZjIpIHtcbiAgdmFyIG1lcmdlZCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgLy8gZmxvdyBjb21wbGFpbnMgYWJvdXQgZXh0cmEgYXJncyB3aGljaCBpcyB3aHkgd2UgdXNlIGFueVxuICAgIGYxKGEsIGIpO1xuICAgIGYyKGEsIGIpO1xuICB9O1xuICBtZXJnZWQuX21lcmdlZCA9IHRydWU7XG4gIHJldHVybiBtZXJnZWRcbn1cblxuLy8gdHJhbnNmb3JtIGNvbXBvbmVudCB2LW1vZGVsIGluZm8gKHZhbHVlIGFuZCBjYWxsYmFjaykgaW50b1xuLy8gcHJvcCBhbmQgZXZlbnQgaGFuZGxlciByZXNwZWN0aXZlbHkuXG5mdW5jdGlvbiB0cmFuc2Zvcm1Nb2RlbCAob3B0aW9ucywgZGF0YSkge1xuICB2YXIgcHJvcCA9IChvcHRpb25zLm1vZGVsICYmIG9wdGlvbnMubW9kZWwucHJvcCkgfHwgJ3ZhbHVlJztcbiAgdmFyIGV2ZW50ID0gKG9wdGlvbnMubW9kZWwgJiYgb3B0aW9ucy5tb2RlbC5ldmVudCkgfHwgJ2lucHV0J1xuICA7KGRhdGEuYXR0cnMgfHwgKGRhdGEuYXR0cnMgPSB7fSkpW3Byb3BdID0gZGF0YS5tb2RlbC52YWx1ZTtcbiAgdmFyIG9uID0gZGF0YS5vbiB8fCAoZGF0YS5vbiA9IHt9KTtcbiAgdmFyIGV4aXN0aW5nID0gb25bZXZlbnRdO1xuICB2YXIgY2FsbGJhY2sgPSBkYXRhLm1vZGVsLmNhbGxiYWNrO1xuICBpZiAoaXNEZWYoZXhpc3RpbmcpKSB7XG4gICAgaWYgKFxuICAgICAgQXJyYXkuaXNBcnJheShleGlzdGluZylcbiAgICAgICAgPyBleGlzdGluZy5pbmRleE9mKGNhbGxiYWNrKSA9PT0gLTFcbiAgICAgICAgOiBleGlzdGluZyAhPT0gY2FsbGJhY2tcbiAgICApIHtcbiAgICAgIG9uW2V2ZW50XSA9IFtjYWxsYmFja10uY29uY2F0KGV4aXN0aW5nKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb25bZXZlbnRdID0gY2FsbGJhY2s7XG4gIH1cbn1cblxuLyogICovXG5cbnZhciBTSU1QTEVfTk9STUFMSVpFID0gMTtcbnZhciBBTFdBWVNfTk9STUFMSVpFID0gMjtcblxuLy8gd3JhcHBlciBmdW5jdGlvbiBmb3IgcHJvdmlkaW5nIGEgbW9yZSBmbGV4aWJsZSBpbnRlcmZhY2Vcbi8vIHdpdGhvdXQgZ2V0dGluZyB5ZWxsZWQgYXQgYnkgZmxvd1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCAoXG4gIGNvbnRleHQsXG4gIHRhZyxcbiAgZGF0YSxcbiAgY2hpbGRyZW4sXG4gIG5vcm1hbGl6YXRpb25UeXBlLFxuICBhbHdheXNOb3JtYWxpemVcbikge1xuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSB8fCBpc1ByaW1pdGl2ZShkYXRhKSkge1xuICAgIG5vcm1hbGl6YXRpb25UeXBlID0gY2hpbGRyZW47XG4gICAgY2hpbGRyZW4gPSBkYXRhO1xuICAgIGRhdGEgPSB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKGlzVHJ1ZShhbHdheXNOb3JtYWxpemUpKSB7XG4gICAgbm9ybWFsaXphdGlvblR5cGUgPSBBTFdBWVNfTk9STUFMSVpFO1xuICB9XG4gIHJldHVybiBfY3JlYXRlRWxlbWVudChjb250ZXh0LCB0YWcsIGRhdGEsIGNoaWxkcmVuLCBub3JtYWxpemF0aW9uVHlwZSlcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUVsZW1lbnQgKFxuICBjb250ZXh0LFxuICB0YWcsXG4gIGRhdGEsXG4gIGNoaWxkcmVuLFxuICBub3JtYWxpemF0aW9uVHlwZVxuKSB7XG4gIGlmIChpc0RlZihkYXRhKSAmJiBpc0RlZigoZGF0YSkuX19vYl9fKSkge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgIFwiQXZvaWQgdXNpbmcgb2JzZXJ2ZWQgZGF0YSBvYmplY3QgYXMgdm5vZGUgZGF0YTogXCIgKyAoSlNPTi5zdHJpbmdpZnkoZGF0YSkpICsgXCJcXG5cIiArXG4gICAgICAnQWx3YXlzIGNyZWF0ZSBmcmVzaCB2bm9kZSBkYXRhIG9iamVjdHMgaW4gZWFjaCByZW5kZXIhJyxcbiAgICAgIGNvbnRleHRcbiAgICApO1xuICAgIHJldHVybiBjcmVhdGVFbXB0eVZOb2RlKClcbiAgfVxuICAvLyBvYmplY3Qgc3ludGF4IGluIHYtYmluZFxuICBpZiAoaXNEZWYoZGF0YSkgJiYgaXNEZWYoZGF0YS5pcykpIHtcbiAgICB0YWcgPSBkYXRhLmlzO1xuICB9XG4gIGlmICghdGFnKSB7XG4gICAgLy8gaW4gY2FzZSBvZiBjb21wb25lbnQgOmlzIHNldCB0byBmYWxzeSB2YWx1ZVxuICAgIHJldHVybiBjcmVhdGVFbXB0eVZOb2RlKClcbiAgfVxuICAvLyB3YXJuIGFnYWluc3Qgbm9uLXByaW1pdGl2ZSBrZXlcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiZcbiAgICBpc0RlZihkYXRhKSAmJiBpc0RlZihkYXRhLmtleSkgJiYgIWlzUHJpbWl0aXZlKGRhdGEua2V5KVxuICApIHtcbiAgICB7XG4gICAgICB3YXJuKFxuICAgICAgICAnQXZvaWQgdXNpbmcgbm9uLXByaW1pdGl2ZSB2YWx1ZSBhcyBrZXksICcgK1xuICAgICAgICAndXNlIHN0cmluZy9udW1iZXIgdmFsdWUgaW5zdGVhZC4nLFxuICAgICAgICBjb250ZXh0XG4gICAgICApO1xuICAgIH1cbiAgfVxuICAvLyBzdXBwb3J0IHNpbmdsZSBmdW5jdGlvbiBjaGlsZHJlbiBhcyBkZWZhdWx0IHNjb3BlZCBzbG90XG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSAmJlxuICAgIHR5cGVvZiBjaGlsZHJlblswXSA9PT0gJ2Z1bmN0aW9uJ1xuICApIHtcbiAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICBkYXRhLnNjb3BlZFNsb3RzID0geyBkZWZhdWx0OiBjaGlsZHJlblswXSB9O1xuICAgIGNoaWxkcmVuLmxlbmd0aCA9IDA7XG4gIH1cbiAgaWYgKG5vcm1hbGl6YXRpb25UeXBlID09PSBBTFdBWVNfTk9STUFMSVpFKSB7XG4gICAgY2hpbGRyZW4gPSBub3JtYWxpemVDaGlsZHJlbihjaGlsZHJlbik7XG4gIH0gZWxzZSBpZiAobm9ybWFsaXphdGlvblR5cGUgPT09IFNJTVBMRV9OT1JNQUxJWkUpIHtcbiAgICBjaGlsZHJlbiA9IHNpbXBsZU5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKTtcbiAgfVxuICB2YXIgdm5vZGUsIG5zO1xuICBpZiAodHlwZW9mIHRhZyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgQ3RvcjtcbiAgICBucyA9IChjb250ZXh0LiR2bm9kZSAmJiBjb250ZXh0LiR2bm9kZS5ucykgfHwgY29uZmlnLmdldFRhZ05hbWVzcGFjZSh0YWcpO1xuICAgIGlmIChjb25maWcuaXNSZXNlcnZlZFRhZyh0YWcpKSB7XG4gICAgICAvLyBwbGF0Zm9ybSBidWlsdC1pbiBlbGVtZW50c1xuICAgICAgdm5vZGUgPSBuZXcgVk5vZGUoXG4gICAgICAgIGNvbmZpZy5wYXJzZVBsYXRmb3JtVGFnTmFtZSh0YWcpLCBkYXRhLCBjaGlsZHJlbixcbiAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbnRleHRcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICgoIWRhdGEgfHwgIWRhdGEucHJlKSAmJiBpc0RlZihDdG9yID0gcmVzb2x2ZUFzc2V0KGNvbnRleHQuJG9wdGlvbnMsICdjb21wb25lbnRzJywgdGFnKSkpIHtcbiAgICAgIC8vIGNvbXBvbmVudFxuICAgICAgdm5vZGUgPSBjcmVhdGVDb21wb25lbnQoQ3RvciwgZGF0YSwgY29udGV4dCwgY2hpbGRyZW4sIHRhZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHVua25vd24gb3IgdW5saXN0ZWQgbmFtZXNwYWNlZCBlbGVtZW50c1xuICAgICAgLy8gY2hlY2sgYXQgcnVudGltZSBiZWNhdXNlIGl0IG1heSBnZXQgYXNzaWduZWQgYSBuYW1lc3BhY2Ugd2hlbiBpdHNcbiAgICAgIC8vIHBhcmVudCBub3JtYWxpemVzIGNoaWxkcmVuXG4gICAgICB2bm9kZSA9IG5ldyBWTm9kZShcbiAgICAgICAgdGFnLCBkYXRhLCBjaGlsZHJlbixcbiAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbnRleHRcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGRpcmVjdCBjb21wb25lbnQgb3B0aW9ucyAvIGNvbnN0cnVjdG9yXG4gICAgdm5vZGUgPSBjcmVhdGVDb21wb25lbnQodGFnLCBkYXRhLCBjb250ZXh0LCBjaGlsZHJlbik7XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkodm5vZGUpKSB7XG4gICAgcmV0dXJuIHZub2RlXG4gIH0gZWxzZSBpZiAoaXNEZWYodm5vZGUpKSB7XG4gICAgaWYgKGlzRGVmKG5zKSkgeyBhcHBseU5TKHZub2RlLCBucyk7IH1cbiAgICBpZiAoaXNEZWYoZGF0YSkpIHsgcmVnaXN0ZXJEZWVwQmluZGluZ3MoZGF0YSk7IH1cbiAgICByZXR1cm4gdm5vZGVcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY3JlYXRlRW1wdHlWTm9kZSgpXG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlOUyAodm5vZGUsIG5zLCBmb3JjZSkge1xuICB2bm9kZS5ucyA9IG5zO1xuICBpZiAodm5vZGUudGFnID09PSAnZm9yZWlnbk9iamVjdCcpIHtcbiAgICAvLyB1c2UgZGVmYXVsdCBuYW1lc3BhY2UgaW5zaWRlIGZvcmVpZ25PYmplY3RcbiAgICBucyA9IHVuZGVmaW5lZDtcbiAgICBmb3JjZSA9IHRydWU7XG4gIH1cbiAgaWYgKGlzRGVmKHZub2RlLmNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSB2bm9kZS5jaGlsZHJlbltpXTtcbiAgICAgIGlmIChpc0RlZihjaGlsZC50YWcpICYmIChcbiAgICAgICAgaXNVbmRlZihjaGlsZC5ucykgfHwgKGlzVHJ1ZShmb3JjZSkgJiYgY2hpbGQudGFnICE9PSAnc3ZnJykpKSB7XG4gICAgICAgIGFwcGx5TlMoY2hpbGQsIG5zLCBmb3JjZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIHJlZiAjNTMxOFxuLy8gbmVjZXNzYXJ5IHRvIGVuc3VyZSBwYXJlbnQgcmUtcmVuZGVyIHdoZW4gZGVlcCBiaW5kaW5ncyBsaWtlIDpzdHlsZSBhbmRcbi8vIDpjbGFzcyBhcmUgdXNlZCBvbiBzbG90IG5vZGVzXG5mdW5jdGlvbiByZWdpc3RlckRlZXBCaW5kaW5ncyAoZGF0YSkge1xuICBpZiAoaXNPYmplY3QoZGF0YS5zdHlsZSkpIHtcbiAgICB0cmF2ZXJzZShkYXRhLnN0eWxlKTtcbiAgfVxuICBpZiAoaXNPYmplY3QoZGF0YS5jbGFzcykpIHtcbiAgICB0cmF2ZXJzZShkYXRhLmNsYXNzKTtcbiAgfVxufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gaW5pdFJlbmRlciAodm0pIHtcbiAgdm0uX3Zub2RlID0gbnVsbDsgLy8gdGhlIHJvb3Qgb2YgdGhlIGNoaWxkIHRyZWVcbiAgdm0uX3N0YXRpY1RyZWVzID0gbnVsbDsgLy8gdi1vbmNlIGNhY2hlZCB0cmVlc1xuICB2YXIgb3B0aW9ucyA9IHZtLiRvcHRpb25zO1xuICB2YXIgcGFyZW50Vm5vZGUgPSB2bS4kdm5vZGUgPSBvcHRpb25zLl9wYXJlbnRWbm9kZTsgLy8gdGhlIHBsYWNlaG9sZGVyIG5vZGUgaW4gcGFyZW50IHRyZWVcbiAgdmFyIHJlbmRlckNvbnRleHQgPSBwYXJlbnRWbm9kZSAmJiBwYXJlbnRWbm9kZS5jb250ZXh0O1xuICB2bS4kc2xvdHMgPSByZXNvbHZlU2xvdHMob3B0aW9ucy5fcmVuZGVyQ2hpbGRyZW4sIHJlbmRlckNvbnRleHQpO1xuICB2bS4kc2NvcGVkU2xvdHMgPSBlbXB0eU9iamVjdDtcbiAgLy8gYmluZCB0aGUgY3JlYXRlRWxlbWVudCBmbiB0byB0aGlzIGluc3RhbmNlXG4gIC8vIHNvIHRoYXQgd2UgZ2V0IHByb3BlciByZW5kZXIgY29udGV4dCBpbnNpZGUgaXQuXG4gIC8vIGFyZ3Mgb3JkZXI6IHRhZywgZGF0YSwgY2hpbGRyZW4sIG5vcm1hbGl6YXRpb25UeXBlLCBhbHdheXNOb3JtYWxpemVcbiAgLy8gaW50ZXJuYWwgdmVyc2lvbiBpcyB1c2VkIGJ5IHJlbmRlciBmdW5jdGlvbnMgY29tcGlsZWQgZnJvbSB0ZW1wbGF0ZXNcbiAgdm0uX2MgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCkgeyByZXR1cm4gY3JlYXRlRWxlbWVudCh2bSwgYSwgYiwgYywgZCwgZmFsc2UpOyB9O1xuICAvLyBub3JtYWxpemF0aW9uIGlzIGFsd2F5cyBhcHBsaWVkIGZvciB0aGUgcHVibGljIHZlcnNpb24sIHVzZWQgaW5cbiAgLy8gdXNlci13cml0dGVuIHJlbmRlciBmdW5jdGlvbnMuXG4gIHZtLiRjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHsgcmV0dXJuIGNyZWF0ZUVsZW1lbnQodm0sIGEsIGIsIGMsIGQsIHRydWUpOyB9O1xuXG4gIC8vICRhdHRycyAmICRsaXN0ZW5lcnMgYXJlIGV4cG9zZWQgZm9yIGVhc2llciBIT0MgY3JlYXRpb24uXG4gIC8vIHRoZXkgbmVlZCB0byBiZSByZWFjdGl2ZSBzbyB0aGF0IEhPQ3MgdXNpbmcgdGhlbSBhcmUgYWx3YXlzIHVwZGF0ZWRcbiAgdmFyIHBhcmVudERhdGEgPSBwYXJlbnRWbm9kZSAmJiBwYXJlbnRWbm9kZS5kYXRhO1xuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZGVmaW5lUmVhY3RpdmUkJDEodm0sICckYXR0cnMnLCBwYXJlbnREYXRhICYmIHBhcmVudERhdGEuYXR0cnMgfHwgZW1wdHlPYmplY3QsIGZ1bmN0aW9uICgpIHtcbiAgICAgICFpc1VwZGF0aW5nQ2hpbGRDb21wb25lbnQgJiYgd2FybihcIiRhdHRycyBpcyByZWFkb25seS5cIiwgdm0pO1xuICAgIH0sIHRydWUpO1xuICAgIGRlZmluZVJlYWN0aXZlJCQxKHZtLCAnJGxpc3RlbmVycycsIG9wdGlvbnMuX3BhcmVudExpc3RlbmVycyB8fCBlbXB0eU9iamVjdCwgZnVuY3Rpb24gKCkge1xuICAgICAgIWlzVXBkYXRpbmdDaGlsZENvbXBvbmVudCAmJiB3YXJuKFwiJGxpc3RlbmVycyBpcyByZWFkb25seS5cIiwgdm0pO1xuICAgIH0sIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGRlZmluZVJlYWN0aXZlJCQxKHZtLCAnJGF0dHJzJywgcGFyZW50RGF0YSAmJiBwYXJlbnREYXRhLmF0dHJzIHx8IGVtcHR5T2JqZWN0LCBudWxsLCB0cnVlKTtcbiAgICBkZWZpbmVSZWFjdGl2ZSQkMSh2bSwgJyRsaXN0ZW5lcnMnLCBvcHRpb25zLl9wYXJlbnRMaXN0ZW5lcnMgfHwgZW1wdHlPYmplY3QsIG51bGwsIHRydWUpO1xuICB9XG59XG5cbnZhciBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UgPSBudWxsO1xuXG5mdW5jdGlvbiByZW5kZXJNaXhpbiAoVnVlKSB7XG4gIC8vIGluc3RhbGwgcnVudGltZSBjb252ZW5pZW5jZSBoZWxwZXJzXG4gIGluc3RhbGxSZW5kZXJIZWxwZXJzKFZ1ZS5wcm90b3R5cGUpO1xuXG4gIFZ1ZS5wcm90b3R5cGUuJG5leHRUaWNrID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgcmV0dXJuIG5leHRUaWNrKGZuLCB0aGlzKVxuICB9O1xuXG4gIFZ1ZS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZhciByZWYgPSB2bS4kb3B0aW9ucztcbiAgICB2YXIgcmVuZGVyID0gcmVmLnJlbmRlcjtcbiAgICB2YXIgX3BhcmVudFZub2RlID0gcmVmLl9wYXJlbnRWbm9kZTtcblxuICAgIGlmIChfcGFyZW50Vm5vZGUpIHtcbiAgICAgIHZtLiRzY29wZWRTbG90cyA9IG5vcm1hbGl6ZVNjb3BlZFNsb3RzKFxuICAgICAgICBfcGFyZW50Vm5vZGUuZGF0YS5zY29wZWRTbG90cyxcbiAgICAgICAgdm0uJHNsb3RzLFxuICAgICAgICB2bS4kc2NvcGVkU2xvdHNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHBhcmVudCB2bm9kZS4gdGhpcyBhbGxvd3MgcmVuZGVyIGZ1bmN0aW9ucyB0byBoYXZlIGFjY2Vzc1xuICAgIC8vIHRvIHRoZSBkYXRhIG9uIHRoZSBwbGFjZWhvbGRlciBub2RlLlxuICAgIHZtLiR2bm9kZSA9IF9wYXJlbnRWbm9kZTtcbiAgICAvLyByZW5kZXIgc2VsZlxuICAgIHZhciB2bm9kZTtcbiAgICB0cnkge1xuICAgICAgLy8gVGhlcmUncyBubyBuZWVkIHRvIG1haW50YWluIGEgc3RhY2sgYmVjYXVlcyBhbGwgcmVuZGVyIGZucyBhcmUgY2FsbGVkXG4gICAgICAvLyBzZXBhcmF0ZWx5IGZyb20gb25lIGFub3RoZXIuIE5lc3RlZCBjb21wb25lbnQncyByZW5kZXIgZm5zIGFyZSBjYWxsZWRcbiAgICAgIC8vIHdoZW4gcGFyZW50IGNvbXBvbmVudCBpcyBwYXRjaGVkLlxuICAgICAgY3VycmVudFJlbmRlcmluZ0luc3RhbmNlID0gdm07XG4gICAgICB2bm9kZSA9IHJlbmRlci5jYWxsKHZtLl9yZW5kZXJQcm94eSwgdm0uJGNyZWF0ZUVsZW1lbnQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGhhbmRsZUVycm9yKGUsIHZtLCBcInJlbmRlclwiKTtcbiAgICAgIC8vIHJldHVybiBlcnJvciByZW5kZXIgcmVzdWx0LFxuICAgICAgLy8gb3IgcHJldmlvdXMgdm5vZGUgdG8gcHJldmVudCByZW5kZXIgZXJyb3IgY2F1c2luZyBibGFuayBjb21wb25lbnRcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB2bS4kb3B0aW9ucy5yZW5kZXJFcnJvcikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZub2RlID0gdm0uJG9wdGlvbnMucmVuZGVyRXJyb3IuY2FsbCh2bS5fcmVuZGVyUHJveHksIHZtLiRjcmVhdGVFbGVtZW50LCBlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGhhbmRsZUVycm9yKGUsIHZtLCBcInJlbmRlckVycm9yXCIpO1xuICAgICAgICAgIHZub2RlID0gdm0uX3Zub2RlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2bm9kZSA9IHZtLl92bm9kZTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgY3VycmVudFJlbmRlcmluZ0luc3RhbmNlID0gbnVsbDtcbiAgICB9XG4gICAgLy8gaWYgdGhlIHJldHVybmVkIGFycmF5IGNvbnRhaW5zIG9ubHkgYSBzaW5nbGUgbm9kZSwgYWxsb3cgaXRcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2bm9kZSkgJiYgdm5vZGUubGVuZ3RoID09PSAxKSB7XG4gICAgICB2bm9kZSA9IHZub2RlWzBdO1xuICAgIH1cbiAgICAvLyByZXR1cm4gZW1wdHkgdm5vZGUgaW4gY2FzZSB0aGUgcmVuZGVyIGZ1bmN0aW9uIGVycm9yZWQgb3V0XG4gICAgaWYgKCEodm5vZGUgaW5zdGFuY2VvZiBWTm9kZSkpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIEFycmF5LmlzQXJyYXkodm5vZGUpKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgJ011bHRpcGxlIHJvb3Qgbm9kZXMgcmV0dXJuZWQgZnJvbSByZW5kZXIgZnVuY3Rpb24uIFJlbmRlciBmdW5jdGlvbiAnICtcbiAgICAgICAgICAnc2hvdWxkIHJldHVybiBhIHNpbmdsZSByb290IG5vZGUuJyxcbiAgICAgICAgICB2bVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdm5vZGUgPSBjcmVhdGVFbXB0eVZOb2RlKCk7XG4gICAgfVxuICAgIC8vIHNldCBwYXJlbnRcbiAgICB2bm9kZS5wYXJlbnQgPSBfcGFyZW50Vm5vZGU7XG4gICAgcmV0dXJuIHZub2RlXG4gIH07XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBlbnN1cmVDdG9yIChjb21wLCBiYXNlKSB7XG4gIGlmIChcbiAgICBjb21wLl9fZXNNb2R1bGUgfHxcbiAgICAoaGFzU3ltYm9sICYmIGNvbXBbU3ltYm9sLnRvU3RyaW5nVGFnXSA9PT0gJ01vZHVsZScpXG4gICkge1xuICAgIGNvbXAgPSBjb21wLmRlZmF1bHQ7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0KGNvbXApXG4gICAgPyBiYXNlLmV4dGVuZChjb21wKVxuICAgIDogY29tcFxufVxuXG5mdW5jdGlvbiBjcmVhdGVBc3luY1BsYWNlaG9sZGVyIChcbiAgZmFjdG9yeSxcbiAgZGF0YSxcbiAgY29udGV4dCxcbiAgY2hpbGRyZW4sXG4gIHRhZ1xuKSB7XG4gIHZhciBub2RlID0gY3JlYXRlRW1wdHlWTm9kZSgpO1xuICBub2RlLmFzeW5jRmFjdG9yeSA9IGZhY3Rvcnk7XG4gIG5vZGUuYXN5bmNNZXRhID0geyBkYXRhOiBkYXRhLCBjb250ZXh0OiBjb250ZXh0LCBjaGlsZHJlbjogY2hpbGRyZW4sIHRhZzogdGFnIH07XG4gIHJldHVybiBub2RlXG59XG5cbmZ1bmN0aW9uIHJlc29sdmVBc3luY0NvbXBvbmVudCAoXG4gIGZhY3RvcnksXG4gIGJhc2VDdG9yXG4pIHtcbiAgaWYgKGlzVHJ1ZShmYWN0b3J5LmVycm9yKSAmJiBpc0RlZihmYWN0b3J5LmVycm9yQ29tcCkpIHtcbiAgICByZXR1cm4gZmFjdG9yeS5lcnJvckNvbXBcbiAgfVxuXG4gIGlmIChpc0RlZihmYWN0b3J5LnJlc29sdmVkKSkge1xuICAgIHJldHVybiBmYWN0b3J5LnJlc29sdmVkXG4gIH1cblxuICB2YXIgb3duZXIgPSBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2U7XG4gIGlmIChvd25lciAmJiBpc0RlZihmYWN0b3J5Lm93bmVycykgJiYgZmFjdG9yeS5vd25lcnMuaW5kZXhPZihvd25lcikgPT09IC0xKSB7XG4gICAgLy8gYWxyZWFkeSBwZW5kaW5nXG4gICAgZmFjdG9yeS5vd25lcnMucHVzaChvd25lcik7XG4gIH1cblxuICBpZiAoaXNUcnVlKGZhY3RvcnkubG9hZGluZykgJiYgaXNEZWYoZmFjdG9yeS5sb2FkaW5nQ29tcCkpIHtcbiAgICByZXR1cm4gZmFjdG9yeS5sb2FkaW5nQ29tcFxuICB9XG5cbiAgaWYgKG93bmVyICYmICFpc0RlZihmYWN0b3J5Lm93bmVycykpIHtcbiAgICB2YXIgb3duZXJzID0gZmFjdG9yeS5vd25lcnMgPSBbb3duZXJdO1xuICAgIHZhciBzeW5jID0gdHJ1ZTtcbiAgICB2YXIgdGltZXJMb2FkaW5nID0gbnVsbDtcbiAgICB2YXIgdGltZXJUaW1lb3V0ID0gbnVsbFxuXG4gICAgOyhvd25lcikuJG9uKCdob29rOmRlc3Ryb3llZCcsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlbW92ZShvd25lcnMsIG93bmVyKTsgfSk7XG5cbiAgICB2YXIgZm9yY2VSZW5kZXIgPSBmdW5jdGlvbiAocmVuZGVyQ29tcGxldGVkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG93bmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgKG93bmVyc1tpXSkuJGZvcmNlVXBkYXRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZW5kZXJDb21wbGV0ZWQpIHtcbiAgICAgICAgb3duZXJzLmxlbmd0aCA9IDA7XG4gICAgICAgIGlmICh0aW1lckxvYWRpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXJMb2FkaW5nKTtcbiAgICAgICAgICB0aW1lckxvYWRpbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aW1lclRpbWVvdXQgIT09IG51bGwpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXJUaW1lb3V0KTtcbiAgICAgICAgICB0aW1lclRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciByZXNvbHZlID0gb25jZShmdW5jdGlvbiAocmVzKSB7XG4gICAgICAvLyBjYWNoZSByZXNvbHZlZFxuICAgICAgZmFjdG9yeS5yZXNvbHZlZCA9IGVuc3VyZUN0b3IocmVzLCBiYXNlQ3Rvcik7XG4gICAgICAvLyBpbnZva2UgY2FsbGJhY2tzIG9ubHkgaWYgdGhpcyBpcyBub3QgYSBzeW5jaHJvbm91cyByZXNvbHZlXG4gICAgICAvLyAoYXN5bmMgcmVzb2x2ZXMgYXJlIHNoaW1tZWQgYXMgc3luY2hyb25vdXMgZHVyaW5nIFNTUilcbiAgICAgIGlmICghc3luYykge1xuICAgICAgICBmb3JjZVJlbmRlcih0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG93bmVycy5sZW5ndGggPSAwO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHJlamVjdCA9IG9uY2UoZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxuICAgICAgICBcIkZhaWxlZCB0byByZXNvbHZlIGFzeW5jIGNvbXBvbmVudDogXCIgKyAoU3RyaW5nKGZhY3RvcnkpKSArXG4gICAgICAgIChyZWFzb24gPyAoXCJcXG5SZWFzb246IFwiICsgcmVhc29uKSA6ICcnKVxuICAgICAgKTtcbiAgICAgIGlmIChpc0RlZihmYWN0b3J5LmVycm9yQ29tcCkpIHtcbiAgICAgICAgZmFjdG9yeS5lcnJvciA9IHRydWU7XG4gICAgICAgIGZvcmNlUmVuZGVyKHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHJlcyA9IGZhY3RvcnkocmVzb2x2ZSwgcmVqZWN0KTtcblxuICAgIGlmIChpc09iamVjdChyZXMpKSB7XG4gICAgICBpZiAoaXNQcm9taXNlKHJlcykpIHtcbiAgICAgICAgLy8gKCkgPT4gUHJvbWlzZVxuICAgICAgICBpZiAoaXNVbmRlZihmYWN0b3J5LnJlc29sdmVkKSkge1xuICAgICAgICAgIHJlcy50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNQcm9taXNlKHJlcy5jb21wb25lbnQpKSB7XG4gICAgICAgIHJlcy5jb21wb25lbnQudGhlbihyZXNvbHZlLCByZWplY3QpO1xuXG4gICAgICAgIGlmIChpc0RlZihyZXMuZXJyb3IpKSB7XG4gICAgICAgICAgZmFjdG9yeS5lcnJvckNvbXAgPSBlbnN1cmVDdG9yKHJlcy5lcnJvciwgYmFzZUN0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRGVmKHJlcy5sb2FkaW5nKSkge1xuICAgICAgICAgIGZhY3RvcnkubG9hZGluZ0NvbXAgPSBlbnN1cmVDdG9yKHJlcy5sb2FkaW5nLCBiYXNlQ3Rvcik7XG4gICAgICAgICAgaWYgKHJlcy5kZWxheSA9PT0gMCkge1xuICAgICAgICAgICAgZmFjdG9yeS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGltZXJMb2FkaW5nID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRpbWVyTG9hZGluZyA9IG51bGw7XG4gICAgICAgICAgICAgIGlmIChpc1VuZGVmKGZhY3RvcnkucmVzb2x2ZWQpICYmIGlzVW5kZWYoZmFjdG9yeS5lcnJvcikpIHtcbiAgICAgICAgICAgICAgICBmYWN0b3J5LmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcmNlUmVuZGVyKGZhbHNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgcmVzLmRlbGF5IHx8IDIwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRGVmKHJlcy50aW1lb3V0KSkge1xuICAgICAgICAgIHRpbWVyVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGltZXJUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChpc1VuZGVmKGZhY3RvcnkucmVzb2x2ZWQpKSB7XG4gICAgICAgICAgICAgIHJlamVjdChcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nXG4gICAgICAgICAgICAgICAgICA/IChcInRpbWVvdXQgKFwiICsgKHJlcy50aW1lb3V0KSArIFwibXMpXCIpXG4gICAgICAgICAgICAgICAgICA6IG51bGxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCByZXMudGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzeW5jID0gZmFsc2U7XG4gICAgLy8gcmV0dXJuIGluIGNhc2UgcmVzb2x2ZWQgc3luY2hyb25vdXNseVxuICAgIHJldHVybiBmYWN0b3J5LmxvYWRpbmdcbiAgICAgID8gZmFjdG9yeS5sb2FkaW5nQ29tcFxuICAgICAgOiBmYWN0b3J5LnJlc29sdmVkXG4gIH1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGlzQXN5bmNQbGFjZWhvbGRlciAobm9kZSkge1xuICByZXR1cm4gbm9kZS5pc0NvbW1lbnQgJiYgbm9kZS5hc3luY0ZhY3Rvcnlcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGdldEZpcnN0Q29tcG9uZW50Q2hpbGQgKGNoaWxkcmVuKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjID0gY2hpbGRyZW5baV07XG4gICAgICBpZiAoaXNEZWYoYykgJiYgKGlzRGVmKGMuY29tcG9uZW50T3B0aW9ucykgfHwgaXNBc3luY1BsYWNlaG9sZGVyKGMpKSkge1xuICAgICAgICByZXR1cm4gY1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKiAgKi9cblxuLyogICovXG5cbmZ1bmN0aW9uIGluaXRFdmVudHMgKHZtKSB7XG4gIHZtLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2bS5faGFzSG9va0V2ZW50ID0gZmFsc2U7XG4gIC8vIGluaXQgcGFyZW50IGF0dGFjaGVkIGV2ZW50c1xuICB2YXIgbGlzdGVuZXJzID0gdm0uJG9wdGlvbnMuX3BhcmVudExpc3RlbmVycztcbiAgaWYgKGxpc3RlbmVycykge1xuICAgIHVwZGF0ZUNvbXBvbmVudExpc3RlbmVycyh2bSwgbGlzdGVuZXJzKTtcbiAgfVxufVxuXG52YXIgdGFyZ2V0O1xuXG5mdW5jdGlvbiBhZGQgKGV2ZW50LCBmbikge1xuICB0YXJnZXQuJG9uKGV2ZW50LCBmbik7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZSQxIChldmVudCwgZm4pIHtcbiAgdGFyZ2V0LiRvZmYoZXZlbnQsIGZuKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlT25jZUhhbmRsZXIgKGV2ZW50LCBmbikge1xuICB2YXIgX3RhcmdldCA9IHRhcmdldDtcbiAgcmV0dXJuIGZ1bmN0aW9uIG9uY2VIYW5kbGVyICgpIHtcbiAgICB2YXIgcmVzID0gZm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICBpZiAocmVzICE9PSBudWxsKSB7XG4gICAgICBfdGFyZ2V0LiRvZmYoZXZlbnQsIG9uY2VIYW5kbGVyKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQ29tcG9uZW50TGlzdGVuZXJzIChcbiAgdm0sXG4gIGxpc3RlbmVycyxcbiAgb2xkTGlzdGVuZXJzXG4pIHtcbiAgdGFyZ2V0ID0gdm07XG4gIHVwZGF0ZUxpc3RlbmVycyhsaXN0ZW5lcnMsIG9sZExpc3RlbmVycyB8fCB7fSwgYWRkLCByZW1vdmUkMSwgY3JlYXRlT25jZUhhbmRsZXIsIHZtKTtcbiAgdGFyZ2V0ID0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBldmVudHNNaXhpbiAoVnVlKSB7XG4gIHZhciBob29rUkUgPSAvXmhvb2s6LztcbiAgVnVlLnByb3RvdHlwZS4kb24gPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZXZlbnQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZtLiRvbihldmVudFtpXSwgZm4pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAodm0uX2V2ZW50c1tldmVudF0gfHwgKHZtLl9ldmVudHNbZXZlbnRdID0gW10pKS5wdXNoKGZuKTtcbiAgICAgIC8vIG9wdGltaXplIGhvb2s6ZXZlbnQgY29zdCBieSB1c2luZyBhIGJvb2xlYW4gZmxhZyBtYXJrZWQgYXQgcmVnaXN0cmF0aW9uXG4gICAgICAvLyBpbnN0ZWFkIG9mIGEgaGFzaCBsb29rdXBcbiAgICAgIGlmIChob29rUkUudGVzdChldmVudCkpIHtcbiAgICAgICAgdm0uX2hhc0hvb2tFdmVudCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2bVxuICB9O1xuXG4gIFZ1ZS5wcm90b3R5cGUuJG9uY2UgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICBmdW5jdGlvbiBvbiAoKSB7XG4gICAgICB2bS4kb2ZmKGV2ZW50LCBvbik7XG4gICAgICBmbi5hcHBseSh2bSwgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgb24uZm4gPSBmbjtcbiAgICB2bS4kb24oZXZlbnQsIG9uKTtcbiAgICByZXR1cm4gdm1cbiAgfTtcblxuICBWdWUucHJvdG90eXBlLiRvZmYgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICAvLyBhbGxcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIHZtLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgcmV0dXJuIHZtXG4gICAgfVxuICAgIC8vIGFycmF5IG9mIGV2ZW50c1xuICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgZm9yICh2YXIgaSQxID0gMCwgbCA9IGV2ZW50Lmxlbmd0aDsgaSQxIDwgbDsgaSQxKyspIHtcbiAgICAgICAgdm0uJG9mZihldmVudFtpJDFdLCBmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdm1cbiAgICB9XG4gICAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgICB2YXIgY2JzID0gdm0uX2V2ZW50c1tldmVudF07XG4gICAgaWYgKCFjYnMpIHtcbiAgICAgIHJldHVybiB2bVxuICAgIH1cbiAgICBpZiAoIWZuKSB7XG4gICAgICB2bS5fZXZlbnRzW2V2ZW50XSA9IG51bGw7XG4gICAgICByZXR1cm4gdm1cbiAgICB9XG4gICAgLy8gc3BlY2lmaWMgaGFuZGxlclxuICAgIHZhciBjYjtcbiAgICB2YXIgaSA9IGNicy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgY2IgPSBjYnNbaV07XG4gICAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgICBjYnMuc3BsaWNlKGksIDEpO1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdm1cbiAgfTtcblxuICBWdWUucHJvdG90eXBlLiRlbWl0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIGxvd2VyQ2FzZUV2ZW50ID0gZXZlbnQudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChsb3dlckNhc2VFdmVudCAhPT0gZXZlbnQgJiYgdm0uX2V2ZW50c1tsb3dlckNhc2VFdmVudF0pIHtcbiAgICAgICAgdGlwKFxuICAgICAgICAgIFwiRXZlbnQgXFxcIlwiICsgbG93ZXJDYXNlRXZlbnQgKyBcIlxcXCIgaXMgZW1pdHRlZCBpbiBjb21wb25lbnQgXCIgK1xuICAgICAgICAgIChmb3JtYXRDb21wb25lbnROYW1lKHZtKSkgKyBcIiBidXQgdGhlIGhhbmRsZXIgaXMgcmVnaXN0ZXJlZCBmb3IgXFxcIlwiICsgZXZlbnQgKyBcIlxcXCIuIFwiICtcbiAgICAgICAgICBcIk5vdGUgdGhhdCBIVE1MIGF0dHJpYnV0ZXMgYXJlIGNhc2UtaW5zZW5zaXRpdmUgYW5kIHlvdSBjYW5ub3QgdXNlIFwiICtcbiAgICAgICAgICBcInYtb24gdG8gbGlzdGVuIHRvIGNhbWVsQ2FzZSBldmVudHMgd2hlbiB1c2luZyBpbi1ET00gdGVtcGxhdGVzLiBcIiArXG4gICAgICAgICAgXCJZb3Ugc2hvdWxkIHByb2JhYmx5IHVzZSBcXFwiXCIgKyAoaHlwaGVuYXRlKGV2ZW50KSkgKyBcIlxcXCIgaW5zdGVhZCBvZiBcXFwiXCIgKyBldmVudCArIFwiXFxcIi5cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgY2JzID0gdm0uX2V2ZW50c1tldmVudF07XG4gICAgaWYgKGNicykge1xuICAgICAgY2JzID0gY2JzLmxlbmd0aCA+IDEgPyB0b0FycmF5KGNicykgOiBjYnM7XG4gICAgICB2YXIgYXJncyA9IHRvQXJyYXkoYXJndW1lbnRzLCAxKTtcbiAgICAgIHZhciBpbmZvID0gXCJldmVudCBoYW5kbGVyIGZvciBcXFwiXCIgKyBldmVudCArIFwiXFxcIlwiO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGludm9rZVdpdGhFcnJvckhhbmRsaW5nKGNic1tpXSwgdm0sIGFyZ3MsIHZtLCBpbmZvKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZtXG4gIH07XG59XG5cbi8qICAqL1xuXG52YXIgYWN0aXZlSW5zdGFuY2UgPSBudWxsO1xudmFyIGlzVXBkYXRpbmdDaGlsZENvbXBvbmVudCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBzZXRBY3RpdmVJbnN0YW5jZSh2bSkge1xuICB2YXIgcHJldkFjdGl2ZUluc3RhbmNlID0gYWN0aXZlSW5zdGFuY2U7XG4gIGFjdGl2ZUluc3RhbmNlID0gdm07XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgYWN0aXZlSW5zdGFuY2UgPSBwcmV2QWN0aXZlSW5zdGFuY2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdExpZmVjeWNsZSAodm0pIHtcbiAgdmFyIG9wdGlvbnMgPSB2bS4kb3B0aW9ucztcblxuICAvLyBsb2NhdGUgZmlyc3Qgbm9uLWFic3RyYWN0IHBhcmVudFxuICB2YXIgcGFyZW50ID0gb3B0aW9ucy5wYXJlbnQ7XG4gIGlmIChwYXJlbnQgJiYgIW9wdGlvbnMuYWJzdHJhY3QpIHtcbiAgICB3aGlsZSAocGFyZW50LiRvcHRpb25zLmFic3RyYWN0ICYmIHBhcmVudC4kcGFyZW50KSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnQuJHBhcmVudDtcbiAgICB9XG4gICAgcGFyZW50LiRjaGlsZHJlbi5wdXNoKHZtKTtcbiAgfVxuXG4gIHZtLiRwYXJlbnQgPSBwYXJlbnQ7XG4gIHZtLiRyb290ID0gcGFyZW50ID8gcGFyZW50LiRyb290IDogdm07XG5cbiAgdm0uJGNoaWxkcmVuID0gW107XG4gIHZtLiRyZWZzID0ge307XG5cbiAgdm0uX3dhdGNoZXIgPSBudWxsO1xuICB2bS5faW5hY3RpdmUgPSBudWxsO1xuICB2bS5fZGlyZWN0SW5hY3RpdmUgPSBmYWxzZTtcbiAgdm0uX2lzTW91bnRlZCA9IGZhbHNlO1xuICB2bS5faXNEZXN0cm95ZWQgPSBmYWxzZTtcbiAgdm0uX2lzQmVpbmdEZXN0cm95ZWQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gbGlmZWN5Y2xlTWl4aW4gKFZ1ZSkge1xuICBWdWUucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAodm5vZGUsIGh5ZHJhdGluZykge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdmFyIHByZXZFbCA9IHZtLiRlbDtcbiAgICB2YXIgcHJldlZub2RlID0gdm0uX3Zub2RlO1xuICAgIHZhciByZXN0b3JlQWN0aXZlSW5zdGFuY2UgPSBzZXRBY3RpdmVJbnN0YW5jZSh2bSk7XG4gICAgdm0uX3Zub2RlID0gdm5vZGU7XG4gICAgLy8gVnVlLnByb3RvdHlwZS5fX3BhdGNoX18gaXMgaW5qZWN0ZWQgaW4gZW50cnkgcG9pbnRzXG4gICAgLy8gYmFzZWQgb24gdGhlIHJlbmRlcmluZyBiYWNrZW5kIHVzZWQuXG4gICAgaWYgKCFwcmV2Vm5vZGUpIHtcbiAgICAgIC8vIGluaXRpYWwgcmVuZGVyXG4gICAgICB2bS4kZWwgPSB2bS5fX3BhdGNoX18odm0uJGVsLCB2bm9kZSwgaHlkcmF0aW5nLCBmYWxzZSAvKiByZW1vdmVPbmx5ICovKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdXBkYXRlc1xuICAgICAgdm0uJGVsID0gdm0uX19wYXRjaF9fKHByZXZWbm9kZSwgdm5vZGUpO1xuICAgIH1cbiAgICByZXN0b3JlQWN0aXZlSW5zdGFuY2UoKTtcbiAgICAvLyB1cGRhdGUgX192dWVfXyByZWZlcmVuY2VcbiAgICBpZiAocHJldkVsKSB7XG4gICAgICBwcmV2RWwuX192dWVfXyA9IG51bGw7XG4gICAgfVxuICAgIGlmICh2bS4kZWwpIHtcbiAgICAgIHZtLiRlbC5fX3Z1ZV9fID0gdm07XG4gICAgfVxuICAgIC8vIGlmIHBhcmVudCBpcyBhbiBIT0MsIHVwZGF0ZSBpdHMgJGVsIGFzIHdlbGxcbiAgICBpZiAodm0uJHZub2RlICYmIHZtLiRwYXJlbnQgJiYgdm0uJHZub2RlID09PSB2bS4kcGFyZW50Ll92bm9kZSkge1xuICAgICAgdm0uJHBhcmVudC4kZWwgPSB2bS4kZWw7XG4gICAgfVxuICAgIC8vIHVwZGF0ZWQgaG9vayBpcyBjYWxsZWQgYnkgdGhlIHNjaGVkdWxlciB0byBlbnN1cmUgdGhhdCBjaGlsZHJlbiBhcmVcbiAgICAvLyB1cGRhdGVkIGluIGEgcGFyZW50J3MgdXBkYXRlZCBob29rLlxuICB9O1xuXG4gIFZ1ZS5wcm90b3R5cGUuJGZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgaWYgKHZtLl93YXRjaGVyKSB7XG4gICAgICB2bS5fd2F0Y2hlci51cGRhdGUoKTtcbiAgICB9XG4gIH07XG5cbiAgVnVlLnByb3RvdHlwZS4kZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIGlmICh2bS5faXNCZWluZ0Rlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNhbGxIb29rKHZtLCAnYmVmb3JlRGVzdHJveScpO1xuICAgIHZtLl9pc0JlaW5nRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAvLyByZW1vdmUgc2VsZiBmcm9tIHBhcmVudFxuICAgIHZhciBwYXJlbnQgPSB2bS4kcGFyZW50O1xuICAgIGlmIChwYXJlbnQgJiYgIXBhcmVudC5faXNCZWluZ0Rlc3Ryb3llZCAmJiAhdm0uJG9wdGlvbnMuYWJzdHJhY3QpIHtcbiAgICAgIHJlbW92ZShwYXJlbnQuJGNoaWxkcmVuLCB2bSk7XG4gICAgfVxuICAgIC8vIHRlYXJkb3duIHdhdGNoZXJzXG4gICAgaWYgKHZtLl93YXRjaGVyKSB7XG4gICAgICB2bS5fd2F0Y2hlci50ZWFyZG93bigpO1xuICAgIH1cbiAgICB2YXIgaSA9IHZtLl93YXRjaGVycy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdm0uX3dhdGNoZXJzW2ldLnRlYXJkb3duKCk7XG4gICAgfVxuICAgIC8vIHJlbW92ZSByZWZlcmVuY2UgZnJvbSBkYXRhIG9iXG4gICAgLy8gZnJvemVuIG9iamVjdCBtYXkgbm90IGhhdmUgb2JzZXJ2ZXIuXG4gICAgaWYgKHZtLl9kYXRhLl9fb2JfXykge1xuICAgICAgdm0uX2RhdGEuX19vYl9fLnZtQ291bnQtLTtcbiAgICB9XG4gICAgLy8gY2FsbCB0aGUgbGFzdCBob29rLi4uXG4gICAgdm0uX2lzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAvLyBpbnZva2UgZGVzdHJveSBob29rcyBvbiBjdXJyZW50IHJlbmRlcmVkIHRyZWVcbiAgICB2bS5fX3BhdGNoX18odm0uX3Zub2RlLCBudWxsKTtcbiAgICAvLyBmaXJlIGRlc3Ryb3llZCBob29rXG4gICAgY2FsbEhvb2sodm0sICdkZXN0cm95ZWQnKTtcbiAgICAvLyB0dXJuIG9mZiBhbGwgaW5zdGFuY2UgbGlzdGVuZXJzLlxuICAgIHZtLiRvZmYoKTtcbiAgICAvLyByZW1vdmUgX192dWVfXyByZWZlcmVuY2VcbiAgICBpZiAodm0uJGVsKSB7XG4gICAgICB2bS4kZWwuX192dWVfXyA9IG51bGw7XG4gICAgfVxuICAgIC8vIHJlbGVhc2UgY2lyY3VsYXIgcmVmZXJlbmNlICgjNjc1OSlcbiAgICBpZiAodm0uJHZub2RlKSB7XG4gICAgICB2bS4kdm5vZGUucGFyZW50ID0gbnVsbDtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNoaWxkQ29tcG9uZW50IChcbiAgdm0sXG4gIHByb3BzRGF0YSxcbiAgbGlzdGVuZXJzLFxuICBwYXJlbnRWbm9kZSxcbiAgcmVuZGVyQ2hpbGRyZW5cbikge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlzVXBkYXRpbmdDaGlsZENvbXBvbmVudCA9IHRydWU7XG4gIH1cblxuICAvLyBkZXRlcm1pbmUgd2hldGhlciBjb21wb25lbnQgaGFzIHNsb3QgY2hpbGRyZW5cbiAgLy8gd2UgbmVlZCB0byBkbyB0aGlzIGJlZm9yZSBvdmVyd3JpdGluZyAkb3B0aW9ucy5fcmVuZGVyQ2hpbGRyZW4uXG5cbiAgLy8gY2hlY2sgaWYgdGhlcmUgYXJlIGR5bmFtaWMgc2NvcGVkU2xvdHMgKGhhbmQtd3JpdHRlbiBvciBjb21waWxlZCBidXQgd2l0aFxuICAvLyBkeW5hbWljIHNsb3QgbmFtZXMpLiBTdGF0aWMgc2NvcGVkIHNsb3RzIGNvbXBpbGVkIGZyb20gdGVtcGxhdGUgaGFzIHRoZVxuICAvLyBcIiRzdGFibGVcIiBtYXJrZXIuXG4gIHZhciBuZXdTY29wZWRTbG90cyA9IHBhcmVudFZub2RlLmRhdGEuc2NvcGVkU2xvdHM7XG4gIHZhciBvbGRTY29wZWRTbG90cyA9IHZtLiRzY29wZWRTbG90cztcbiAgdmFyIGhhc0R5bmFtaWNTY29wZWRTbG90ID0gISEoXG4gICAgKG5ld1Njb3BlZFNsb3RzICYmICFuZXdTY29wZWRTbG90cy4kc3RhYmxlKSB8fFxuICAgIChvbGRTY29wZWRTbG90cyAhPT0gZW1wdHlPYmplY3QgJiYgIW9sZFNjb3BlZFNsb3RzLiRzdGFibGUpIHx8XG4gICAgKG5ld1Njb3BlZFNsb3RzICYmIHZtLiRzY29wZWRTbG90cy4ka2V5ICE9PSBuZXdTY29wZWRTbG90cy4ka2V5KVxuICApO1xuXG4gIC8vIEFueSBzdGF0aWMgc2xvdCBjaGlsZHJlbiBmcm9tIHRoZSBwYXJlbnQgbWF5IGhhdmUgY2hhbmdlZCBkdXJpbmcgcGFyZW50J3NcbiAgLy8gdXBkYXRlLiBEeW5hbWljIHNjb3BlZCBzbG90cyBtYXkgYWxzbyBoYXZlIGNoYW5nZWQuIEluIHN1Y2ggY2FzZXMsIGEgZm9yY2VkXG4gIC8vIHVwZGF0ZSBpcyBuZWNlc3NhcnkgdG8gZW5zdXJlIGNvcnJlY3RuZXNzLlxuICB2YXIgbmVlZHNGb3JjZVVwZGF0ZSA9ICEhKFxuICAgIHJlbmRlckNoaWxkcmVuIHx8ICAgICAgICAgICAgICAgLy8gaGFzIG5ldyBzdGF0aWMgc2xvdHNcbiAgICB2bS4kb3B0aW9ucy5fcmVuZGVyQ2hpbGRyZW4gfHwgIC8vIGhhcyBvbGQgc3RhdGljIHNsb3RzXG4gICAgaGFzRHluYW1pY1Njb3BlZFNsb3RcbiAgKTtcblxuICB2bS4kb3B0aW9ucy5fcGFyZW50Vm5vZGUgPSBwYXJlbnRWbm9kZTtcbiAgdm0uJHZub2RlID0gcGFyZW50Vm5vZGU7IC8vIHVwZGF0ZSB2bSdzIHBsYWNlaG9sZGVyIG5vZGUgd2l0aG91dCByZS1yZW5kZXJcblxuICBpZiAodm0uX3Zub2RlKSB7IC8vIHVwZGF0ZSBjaGlsZCB0cmVlJ3MgcGFyZW50XG4gICAgdm0uX3Zub2RlLnBhcmVudCA9IHBhcmVudFZub2RlO1xuICB9XG4gIHZtLiRvcHRpb25zLl9yZW5kZXJDaGlsZHJlbiA9IHJlbmRlckNoaWxkcmVuO1xuXG4gIC8vIHVwZGF0ZSAkYXR0cnMgYW5kICRsaXN0ZW5lcnMgaGFzaFxuICAvLyB0aGVzZSBhcmUgYWxzbyByZWFjdGl2ZSBzbyB0aGV5IG1heSB0cmlnZ2VyIGNoaWxkIHVwZGF0ZSBpZiB0aGUgY2hpbGRcbiAgLy8gdXNlZCB0aGVtIGR1cmluZyByZW5kZXJcbiAgdm0uJGF0dHJzID0gcGFyZW50Vm5vZGUuZGF0YS5hdHRycyB8fCBlbXB0eU9iamVjdDtcbiAgdm0uJGxpc3RlbmVycyA9IGxpc3RlbmVycyB8fCBlbXB0eU9iamVjdDtcblxuICAvLyB1cGRhdGUgcHJvcHNcbiAgaWYgKHByb3BzRGF0YSAmJiB2bS4kb3B0aW9ucy5wcm9wcykge1xuICAgIHRvZ2dsZU9ic2VydmluZyhmYWxzZSk7XG4gICAgdmFyIHByb3BzID0gdm0uX3Byb3BzO1xuICAgIHZhciBwcm9wS2V5cyA9IHZtLiRvcHRpb25zLl9wcm9wS2V5cyB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcEtleXNbaV07XG4gICAgICB2YXIgcHJvcE9wdGlvbnMgPSB2bS4kb3B0aW9ucy5wcm9wczsgLy8gd3RmIGZsb3c/XG4gICAgICBwcm9wc1trZXldID0gdmFsaWRhdGVQcm9wKGtleSwgcHJvcE9wdGlvbnMsIHByb3BzRGF0YSwgdm0pO1xuICAgIH1cbiAgICB0b2dnbGVPYnNlcnZpbmcodHJ1ZSk7XG4gICAgLy8ga2VlcCBhIGNvcHkgb2YgcmF3IHByb3BzRGF0YVxuICAgIHZtLiRvcHRpb25zLnByb3BzRGF0YSA9IHByb3BzRGF0YTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBsaXN0ZW5lcnNcbiAgbGlzdGVuZXJzID0gbGlzdGVuZXJzIHx8IGVtcHR5T2JqZWN0O1xuICB2YXIgb2xkTGlzdGVuZXJzID0gdm0uJG9wdGlvbnMuX3BhcmVudExpc3RlbmVycztcbiAgdm0uJG9wdGlvbnMuX3BhcmVudExpc3RlbmVycyA9IGxpc3RlbmVycztcbiAgdXBkYXRlQ29tcG9uZW50TGlzdGVuZXJzKHZtLCBsaXN0ZW5lcnMsIG9sZExpc3RlbmVycyk7XG5cbiAgLy8gcmVzb2x2ZSBzbG90cyArIGZvcmNlIHVwZGF0ZSBpZiBoYXMgY2hpbGRyZW5cbiAgaWYgKG5lZWRzRm9yY2VVcGRhdGUpIHtcbiAgICB2bS4kc2xvdHMgPSByZXNvbHZlU2xvdHMocmVuZGVyQ2hpbGRyZW4sIHBhcmVudFZub2RlLmNvbnRleHQpO1xuICAgIHZtLiRmb3JjZVVwZGF0ZSgpO1xuICB9XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpc1VwZGF0aW5nQ2hpbGRDb21wb25lbnQgPSBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0luSW5hY3RpdmVUcmVlICh2bSkge1xuICB3aGlsZSAodm0gJiYgKHZtID0gdm0uJHBhcmVudCkpIHtcbiAgICBpZiAodm0uX2luYWN0aXZlKSB7IHJldHVybiB0cnVlIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGVDaGlsZENvbXBvbmVudCAodm0sIGRpcmVjdCkge1xuICBpZiAoZGlyZWN0KSB7XG4gICAgdm0uX2RpcmVjdEluYWN0aXZlID0gZmFsc2U7XG4gICAgaWYgKGlzSW5JbmFjdGl2ZVRyZWUodm0pKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gIH0gZWxzZSBpZiAodm0uX2RpcmVjdEluYWN0aXZlKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKHZtLl9pbmFjdGl2ZSB8fCB2bS5faW5hY3RpdmUgPT09IG51bGwpIHtcbiAgICB2bS5faW5hY3RpdmUgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLiRjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgYWN0aXZhdGVDaGlsZENvbXBvbmVudCh2bS4kY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgICBjYWxsSG9vayh2bSwgJ2FjdGl2YXRlZCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlYWN0aXZhdGVDaGlsZENvbXBvbmVudCAodm0sIGRpcmVjdCkge1xuICBpZiAoZGlyZWN0KSB7XG4gICAgdm0uX2RpcmVjdEluYWN0aXZlID0gdHJ1ZTtcbiAgICBpZiAoaXNJbkluYWN0aXZlVHJlZSh2bSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgfVxuICBpZiAoIXZtLl9pbmFjdGl2ZSkge1xuICAgIHZtLl9pbmFjdGl2ZSA9IHRydWU7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS4kY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRlYWN0aXZhdGVDaGlsZENvbXBvbmVudCh2bS4kY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgICBjYWxsSG9vayh2bSwgJ2RlYWN0aXZhdGVkJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsbEhvb2sgKHZtLCBob29rKSB7XG4gIC8vICM3NTczIGRpc2FibGUgZGVwIGNvbGxlY3Rpb24gd2hlbiBpbnZva2luZyBsaWZlY3ljbGUgaG9va3NcbiAgcHVzaFRhcmdldCgpO1xuICB2YXIgaGFuZGxlcnMgPSB2bS4kb3B0aW9uc1tob29rXTtcbiAgdmFyIGluZm8gPSBob29rICsgXCIgaG9va1wiO1xuICBpZiAoaGFuZGxlcnMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgaW52b2tlV2l0aEVycm9ySGFuZGxpbmcoaGFuZGxlcnNbaV0sIHZtLCBudWxsLCB2bSwgaW5mbyk7XG4gICAgfVxuICB9XG4gIGlmICh2bS5faGFzSG9va0V2ZW50KSB7XG4gICAgdm0uJGVtaXQoJ2hvb2s6JyArIGhvb2spO1xuICB9XG4gIHBvcFRhcmdldCgpO1xufVxuXG4vKiAgKi9cblxudmFyIE1BWF9VUERBVEVfQ09VTlQgPSAxMDA7XG5cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGFjdGl2YXRlZENoaWxkcmVuID0gW107XG52YXIgaGFzID0ge307XG52YXIgY2lyY3VsYXIgPSB7fTtcbnZhciB3YWl0aW5nID0gZmFsc2U7XG52YXIgZmx1c2hpbmcgPSBmYWxzZTtcbnZhciBpbmRleCA9IDA7XG5cbi8qKlxuICogUmVzZXQgdGhlIHNjaGVkdWxlcidzIHN0YXRlLlxuICovXG5mdW5jdGlvbiByZXNldFNjaGVkdWxlclN0YXRlICgpIHtcbiAgaW5kZXggPSBxdWV1ZS5sZW5ndGggPSBhY3RpdmF0ZWRDaGlsZHJlbi5sZW5ndGggPSAwO1xuICBoYXMgPSB7fTtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBjaXJjdWxhciA9IHt9O1xuICB9XG4gIHdhaXRpbmcgPSBmbHVzaGluZyA9IGZhbHNlO1xufVxuXG4vLyBBc3luYyBlZGdlIGNhc2UgIzY1NjYgcmVxdWlyZXMgc2F2aW5nIHRoZSB0aW1lc3RhbXAgd2hlbiBldmVudCBsaXN0ZW5lcnMgYXJlXG4vLyBhdHRhY2hlZC4gSG93ZXZlciwgY2FsbGluZyBwZXJmb3JtYW5jZS5ub3coKSBoYXMgYSBwZXJmIG92ZXJoZWFkIGVzcGVjaWFsbHlcbi8vIGlmIHRoZSBwYWdlIGhhcyB0aG91c2FuZHMgb2YgZXZlbnQgbGlzdGVuZXJzLiBJbnN0ZWFkLCB3ZSB0YWtlIGEgdGltZXN0YW1wXG4vLyBldmVyeSB0aW1lIHRoZSBzY2hlZHVsZXIgZmx1c2hlcyBhbmQgdXNlIHRoYXQgZm9yIGFsbCBldmVudCBsaXN0ZW5lcnNcbi8vIGF0dGFjaGVkIGR1cmluZyB0aGF0IGZsdXNoLlxudmFyIGN1cnJlbnRGbHVzaFRpbWVzdGFtcCA9IDA7XG5cbi8vIEFzeW5jIGVkZ2UgY2FzZSBmaXggcmVxdWlyZXMgc3RvcmluZyBhbiBldmVudCBsaXN0ZW5lcidzIGF0dGFjaCB0aW1lc3RhbXAuXG52YXIgZ2V0Tm93ID0gRGF0ZS5ub3c7XG5cbi8vIERldGVybWluZSB3aGF0IGV2ZW50IHRpbWVzdGFtcCB0aGUgYnJvd3NlciBpcyB1c2luZy4gQW5ub3lpbmdseSwgdGhlXG4vLyB0aW1lc3RhbXAgY2FuIGVpdGhlciBiZSBoaS1yZXMgKHJlbGF0aXZlIHRvIHBhZ2UgbG9hZCkgb3IgbG93LXJlc1xuLy8gKHJlbGF0aXZlIHRvIFVOSVggZXBvY2gpLCBzbyBpbiBvcmRlciB0byBjb21wYXJlIHRpbWUgd2UgaGF2ZSB0byB1c2UgdGhlXG4vLyBzYW1lIHRpbWVzdGFtcCB0eXBlIHdoZW4gc2F2aW5nIHRoZSBmbHVzaCB0aW1lc3RhbXAuXG4vLyBBbGwgSUUgdmVyc2lvbnMgdXNlIGxvdy1yZXMgZXZlbnQgdGltZXN0YW1wcywgYW5kIGhhdmUgcHJvYmxlbWF0aWMgY2xvY2tcbi8vIGltcGxlbWVudGF0aW9ucyAoIzk2MzIpXG5pZiAoaW5Ccm93c2VyICYmICFpc0lFKSB7XG4gIHZhciBwZXJmb3JtYW5jZSA9IHdpbmRvdy5wZXJmb3JtYW5jZTtcbiAgaWYgKFxuICAgIHBlcmZvcm1hbmNlICYmXG4gICAgdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIGdldE5vdygpID4gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50JykudGltZVN0YW1wXG4gICkge1xuICAgIC8vIGlmIHRoZSBldmVudCB0aW1lc3RhbXAsIGFsdGhvdWdoIGV2YWx1YXRlZCBBRlRFUiB0aGUgRGF0ZS5ub3coKSwgaXNcbiAgICAvLyBzbWFsbGVyIHRoYW4gaXQsIGl0IG1lYW5zIHRoZSBldmVudCBpcyB1c2luZyBhIGhpLXJlcyB0aW1lc3RhbXAsXG4gICAgLy8gYW5kIHdlIG5lZWQgdG8gdXNlIHRoZSBoaS1yZXMgdmVyc2lvbiBmb3IgZXZlbnQgbGlzdGVuZXIgdGltZXN0YW1wcyBhc1xuICAgIC8vIHdlbGwuXG4gICAgZ2V0Tm93ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCk7IH07XG4gIH1cbn1cblxuLyoqXG4gKiBGbHVzaCBib3RoIHF1ZXVlcyBhbmQgcnVuIHRoZSB3YXRjaGVycy5cbiAqL1xuZnVuY3Rpb24gZmx1c2hTY2hlZHVsZXJRdWV1ZSAoKSB7XG4gIGN1cnJlbnRGbHVzaFRpbWVzdGFtcCA9IGdldE5vdygpO1xuICBmbHVzaGluZyA9IHRydWU7XG4gIHZhciB3YXRjaGVyLCBpZDtcblxuICAvLyBTb3J0IHF1ZXVlIGJlZm9yZSBmbHVzaC5cbiAgLy8gVGhpcyBlbnN1cmVzIHRoYXQ6XG4gIC8vIDEuIENvbXBvbmVudHMgYXJlIHVwZGF0ZWQgZnJvbSBwYXJlbnQgdG8gY2hpbGQuIChiZWNhdXNlIHBhcmVudCBpcyBhbHdheXNcbiAgLy8gICAgY3JlYXRlZCBiZWZvcmUgdGhlIGNoaWxkKVxuICAvLyAyLiBBIGNvbXBvbmVudCdzIHVzZXIgd2F0Y2hlcnMgYXJlIHJ1biBiZWZvcmUgaXRzIHJlbmRlciB3YXRjaGVyIChiZWNhdXNlXG4gIC8vICAgIHVzZXIgd2F0Y2hlcnMgYXJlIGNyZWF0ZWQgYmVmb3JlIHRoZSByZW5kZXIgd2F0Y2hlcilcbiAgLy8gMy4gSWYgYSBjb21wb25lbnQgaXMgZGVzdHJveWVkIGR1cmluZyBhIHBhcmVudCBjb21wb25lbnQncyB3YXRjaGVyIHJ1bixcbiAgLy8gICAgaXRzIHdhdGNoZXJzIGNhbiBiZSBza2lwcGVkLlxuICBxdWV1ZS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmlkIC0gYi5pZDsgfSk7XG5cbiAgLy8gZG8gbm90IGNhY2hlIGxlbmd0aCBiZWNhdXNlIG1vcmUgd2F0Y2hlcnMgbWlnaHQgYmUgcHVzaGVkXG4gIC8vIGFzIHdlIHJ1biBleGlzdGluZyB3YXRjaGVyc1xuICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBxdWV1ZS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICB3YXRjaGVyID0gcXVldWVbaW5kZXhdO1xuICAgIGlmICh3YXRjaGVyLmJlZm9yZSkge1xuICAgICAgd2F0Y2hlci5iZWZvcmUoKTtcbiAgICB9XG4gICAgaWQgPSB3YXRjaGVyLmlkO1xuICAgIGhhc1tpZF0gPSBudWxsO1xuICAgIHdhdGNoZXIucnVuKCk7XG4gICAgLy8gaW4gZGV2IGJ1aWxkLCBjaGVjayBhbmQgc3RvcCBjaXJjdWxhciB1cGRhdGVzLlxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIGhhc1tpZF0gIT0gbnVsbCkge1xuICAgICAgY2lyY3VsYXJbaWRdID0gKGNpcmN1bGFyW2lkXSB8fCAwKSArIDE7XG4gICAgICBpZiAoY2lyY3VsYXJbaWRdID4gTUFYX1VQREFURV9DT1VOVCkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgICdZb3UgbWF5IGhhdmUgYW4gaW5maW5pdGUgdXBkYXRlIGxvb3AgJyArIChcbiAgICAgICAgICAgIHdhdGNoZXIudXNlclxuICAgICAgICAgICAgICA/IChcImluIHdhdGNoZXIgd2l0aCBleHByZXNzaW9uIFxcXCJcIiArICh3YXRjaGVyLmV4cHJlc3Npb24pICsgXCJcXFwiXCIpXG4gICAgICAgICAgICAgIDogXCJpbiBhIGNvbXBvbmVudCByZW5kZXIgZnVuY3Rpb24uXCJcbiAgICAgICAgICApLFxuICAgICAgICAgIHdhdGNoZXIudm1cbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBrZWVwIGNvcGllcyBvZiBwb3N0IHF1ZXVlcyBiZWZvcmUgcmVzZXR0aW5nIHN0YXRlXG4gIHZhciBhY3RpdmF0ZWRRdWV1ZSA9IGFjdGl2YXRlZENoaWxkcmVuLnNsaWNlKCk7XG4gIHZhciB1cGRhdGVkUXVldWUgPSBxdWV1ZS5zbGljZSgpO1xuXG4gIHJlc2V0U2NoZWR1bGVyU3RhdGUoKTtcblxuICAvLyBjYWxsIGNvbXBvbmVudCB1cGRhdGVkIGFuZCBhY3RpdmF0ZWQgaG9va3NcbiAgY2FsbEFjdGl2YXRlZEhvb2tzKGFjdGl2YXRlZFF1ZXVlKTtcbiAgY2FsbFVwZGF0ZWRIb29rcyh1cGRhdGVkUXVldWUpO1xuXG4gIC8vIGRldnRvb2wgaG9va1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGRldnRvb2xzICYmIGNvbmZpZy5kZXZ0b29scykge1xuICAgIGRldnRvb2xzLmVtaXQoJ2ZsdXNoJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsbFVwZGF0ZWRIb29rcyAocXVldWUpIHtcbiAgdmFyIGkgPSBxdWV1ZS5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIgd2F0Y2hlciA9IHF1ZXVlW2ldO1xuICAgIHZhciB2bSA9IHdhdGNoZXIudm07XG4gICAgaWYgKHZtLl93YXRjaGVyID09PSB3YXRjaGVyICYmIHZtLl9pc01vdW50ZWQgJiYgIXZtLl9pc0Rlc3Ryb3llZCkge1xuICAgICAgY2FsbEhvb2sodm0sICd1cGRhdGVkJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUXVldWUgYSBrZXB0LWFsaXZlIGNvbXBvbmVudCB0aGF0IHdhcyBhY3RpdmF0ZWQgZHVyaW5nIHBhdGNoLlxuICogVGhlIHF1ZXVlIHdpbGwgYmUgcHJvY2Vzc2VkIGFmdGVyIHRoZSBlbnRpcmUgdHJlZSBoYXMgYmVlbiBwYXRjaGVkLlxuICovXG5mdW5jdGlvbiBxdWV1ZUFjdGl2YXRlZENvbXBvbmVudCAodm0pIHtcbiAgLy8gc2V0dGluZyBfaW5hY3RpdmUgdG8gZmFsc2UgaGVyZSBzbyB0aGF0IGEgcmVuZGVyIGZ1bmN0aW9uIGNhblxuICAvLyByZWx5IG9uIGNoZWNraW5nIHdoZXRoZXIgaXQncyBpbiBhbiBpbmFjdGl2ZSB0cmVlIChlLmcuIHJvdXRlci12aWV3KVxuICB2bS5faW5hY3RpdmUgPSBmYWxzZTtcbiAgYWN0aXZhdGVkQ2hpbGRyZW4ucHVzaCh2bSk7XG59XG5cbmZ1bmN0aW9uIGNhbGxBY3RpdmF0ZWRIb29rcyAocXVldWUpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIHF1ZXVlW2ldLl9pbmFjdGl2ZSA9IHRydWU7XG4gICAgYWN0aXZhdGVDaGlsZENvbXBvbmVudChxdWV1ZVtpXSwgdHJ1ZSAvKiB0cnVlICovKTtcbiAgfVxufVxuXG4vKipcbiAqIFB1c2ggYSB3YXRjaGVyIGludG8gdGhlIHdhdGNoZXIgcXVldWUuXG4gKiBKb2JzIHdpdGggZHVwbGljYXRlIElEcyB3aWxsIGJlIHNraXBwZWQgdW5sZXNzIGl0J3NcbiAqIHB1c2hlZCB3aGVuIHRoZSBxdWV1ZSBpcyBiZWluZyBmbHVzaGVkLlxuICovXG5mdW5jdGlvbiBxdWV1ZVdhdGNoZXIgKHdhdGNoZXIpIHtcbiAgdmFyIGlkID0gd2F0Y2hlci5pZDtcbiAgaWYgKGhhc1tpZF0gPT0gbnVsbCkge1xuICAgIGhhc1tpZF0gPSB0cnVlO1xuICAgIGlmICghZmx1c2hpbmcpIHtcbiAgICAgIHF1ZXVlLnB1c2god2F0Y2hlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIGFscmVhZHkgZmx1c2hpbmcsIHNwbGljZSB0aGUgd2F0Y2hlciBiYXNlZCBvbiBpdHMgaWRcbiAgICAgIC8vIGlmIGFscmVhZHkgcGFzdCBpdHMgaWQsIGl0IHdpbGwgYmUgcnVuIG5leHQgaW1tZWRpYXRlbHkuXG4gICAgICB2YXIgaSA9IHF1ZXVlLmxlbmd0aCAtIDE7XG4gICAgICB3aGlsZSAoaSA+IGluZGV4ICYmIHF1ZXVlW2ldLmlkID4gd2F0Y2hlci5pZCkge1xuICAgICAgICBpLS07XG4gICAgICB9XG4gICAgICBxdWV1ZS5zcGxpY2UoaSArIDEsIDAsIHdhdGNoZXIpO1xuICAgIH1cbiAgICAvLyBxdWV1ZSB0aGUgZmx1c2hcbiAgICBpZiAoIXdhaXRpbmcpIHtcbiAgICAgIHdhaXRpbmcgPSB0cnVlO1xuXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAhY29uZmlnLmFzeW5jKSB7XG4gICAgICAgIGZsdXNoU2NoZWR1bGVyUXVldWUoKTtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBuZXh0VGljayhmbHVzaFNjaGVkdWxlclF1ZXVlKTtcbiAgICB9XG4gIH1cbn1cblxuLyogICovXG5cblxuXG52YXIgdWlkJDIgPSAwO1xuXG4vKipcbiAqIEEgd2F0Y2hlciBwYXJzZXMgYW4gZXhwcmVzc2lvbiwgY29sbGVjdHMgZGVwZW5kZW5jaWVzLFxuICogYW5kIGZpcmVzIGNhbGxiYWNrIHdoZW4gdGhlIGV4cHJlc3Npb24gdmFsdWUgY2hhbmdlcy5cbiAqIFRoaXMgaXMgdXNlZCBmb3IgYm90aCB0aGUgJHdhdGNoKCkgYXBpIGFuZCBkaXJlY3RpdmVzLlxuICovXG52YXIgV2F0Y2hlciA9IGZ1bmN0aW9uIFdhdGNoZXIgKFxuICB2bSxcbiAgZXhwT3JGbixcbiAgY2IsXG4gIG9wdGlvbnMsXG4gIGlzUmVuZGVyV2F0Y2hlclxuKSB7XG4gIHRoaXMudm0gPSB2bTtcbiAgaWYgKGlzUmVuZGVyV2F0Y2hlcikge1xuICAgIHZtLl93YXRjaGVyID0gdGhpcztcbiAgfVxuICB2bS5fd2F0Y2hlcnMucHVzaCh0aGlzKTtcbiAgLy8gb3B0aW9uc1xuICBpZiAob3B0aW9ucykge1xuICAgIHRoaXMuZGVlcCA9ICEhb3B0aW9ucy5kZWVwO1xuICAgIHRoaXMudXNlciA9ICEhb3B0aW9ucy51c2VyO1xuICAgIHRoaXMubGF6eSA9ICEhb3B0aW9ucy5sYXp5O1xuICAgIHRoaXMuc3luYyA9ICEhb3B0aW9ucy5zeW5jO1xuICAgIHRoaXMuYmVmb3JlID0gb3B0aW9ucy5iZWZvcmU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kZWVwID0gdGhpcy51c2VyID0gdGhpcy5sYXp5ID0gdGhpcy5zeW5jID0gZmFsc2U7XG4gIH1cbiAgdGhpcy5jYiA9IGNiO1xuICB0aGlzLmlkID0gKyt1aWQkMjsgLy8gdWlkIGZvciBiYXRjaGluZ1xuICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gIHRoaXMuZGlydHkgPSB0aGlzLmxhenk7IC8vIGZvciBsYXp5IHdhdGNoZXJzXG4gIHRoaXMuZGVwcyA9IFtdO1xuICB0aGlzLm5ld0RlcHMgPSBbXTtcbiAgdGhpcy5kZXBJZHMgPSBuZXcgX1NldCgpO1xuICB0aGlzLm5ld0RlcElkcyA9IG5ldyBfU2V0KCk7XG4gIHRoaXMuZXhwcmVzc2lvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbidcbiAgICA/IGV4cE9yRm4udG9TdHJpbmcoKVxuICAgIDogJyc7XG4gIC8vIHBhcnNlIGV4cHJlc3Npb24gZm9yIGdldHRlclxuICBpZiAodHlwZW9mIGV4cE9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLmdldHRlciA9IGV4cE9yRm47XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5nZXR0ZXIgPSBwYXJzZVBhdGgoZXhwT3JGbik7XG4gICAgaWYgKCF0aGlzLmdldHRlcikge1xuICAgICAgdGhpcy5nZXR0ZXIgPSBub29wO1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxuICAgICAgICBcIkZhaWxlZCB3YXRjaGluZyBwYXRoOiBcXFwiXCIgKyBleHBPckZuICsgXCJcXFwiIFwiICtcbiAgICAgICAgJ1dhdGNoZXIgb25seSBhY2NlcHRzIHNpbXBsZSBkb3QtZGVsaW1pdGVkIHBhdGhzLiAnICtcbiAgICAgICAgJ0ZvciBmdWxsIGNvbnRyb2wsIHVzZSBhIGZ1bmN0aW9uIGluc3RlYWQuJyxcbiAgICAgICAgdm1cbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHRoaXMudmFsdWUgPSB0aGlzLmxhenlcbiAgICA/IHVuZGVmaW5lZFxuICAgIDogdGhpcy5nZXQoKTtcbn07XG5cbi8qKlxuICogRXZhbHVhdGUgdGhlIGdldHRlciwgYW5kIHJlLWNvbGxlY3QgZGVwZW5kZW5jaWVzLlxuICovXG5XYXRjaGVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKCkge1xuICBwdXNoVGFyZ2V0KHRoaXMpO1xuICB2YXIgdmFsdWU7XG4gIHZhciB2bSA9IHRoaXMudm07XG4gIHRyeSB7XG4gICAgdmFsdWUgPSB0aGlzLmdldHRlci5jYWxsKHZtLCB2bSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAodGhpcy51c2VyKSB7XG4gICAgICBoYW5kbGVFcnJvcihlLCB2bSwgKFwiZ2V0dGVyIGZvciB3YXRjaGVyIFxcXCJcIiArICh0aGlzLmV4cHJlc3Npb24pICsgXCJcXFwiXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZVxuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBcInRvdWNoXCIgZXZlcnkgcHJvcGVydHkgc28gdGhleSBhcmUgYWxsIHRyYWNrZWQgYXNcbiAgICAvLyBkZXBlbmRlbmNpZXMgZm9yIGRlZXAgd2F0Y2hpbmdcbiAgICBpZiAodGhpcy5kZWVwKSB7XG4gICAgICB0cmF2ZXJzZSh2YWx1ZSk7XG4gICAgfVxuICAgIHBvcFRhcmdldCgpO1xuICAgIHRoaXMuY2xlYW51cERlcHMoKTtcbiAgfVxuICByZXR1cm4gdmFsdWVcbn07XG5cbi8qKlxuICogQWRkIGEgZGVwZW5kZW5jeSB0byB0aGlzIGRpcmVjdGl2ZS5cbiAqL1xuV2F0Y2hlci5wcm90b3R5cGUuYWRkRGVwID0gZnVuY3Rpb24gYWRkRGVwIChkZXApIHtcbiAgdmFyIGlkID0gZGVwLmlkO1xuICBpZiAoIXRoaXMubmV3RGVwSWRzLmhhcyhpZCkpIHtcbiAgICB0aGlzLm5ld0RlcElkcy5hZGQoaWQpO1xuICAgIHRoaXMubmV3RGVwcy5wdXNoKGRlcCk7XG4gICAgaWYgKCF0aGlzLmRlcElkcy5oYXMoaWQpKSB7XG4gICAgICBkZXAuYWRkU3ViKHRoaXMpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBDbGVhbiB1cCBmb3IgZGVwZW5kZW5jeSBjb2xsZWN0aW9uLlxuICovXG5XYXRjaGVyLnByb3RvdHlwZS5jbGVhbnVwRGVwcyA9IGZ1bmN0aW9uIGNsZWFudXBEZXBzICgpIHtcbiAgdmFyIGkgPSB0aGlzLmRlcHMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgdmFyIGRlcCA9IHRoaXMuZGVwc1tpXTtcbiAgICBpZiAoIXRoaXMubmV3RGVwSWRzLmhhcyhkZXAuaWQpKSB7XG4gICAgICBkZXAucmVtb3ZlU3ViKHRoaXMpO1xuICAgIH1cbiAgfVxuICB2YXIgdG1wID0gdGhpcy5kZXBJZHM7XG4gIHRoaXMuZGVwSWRzID0gdGhpcy5uZXdEZXBJZHM7XG4gIHRoaXMubmV3RGVwSWRzID0gdG1wO1xuICB0aGlzLm5ld0RlcElkcy5jbGVhcigpO1xuICB0bXAgPSB0aGlzLmRlcHM7XG4gIHRoaXMuZGVwcyA9IHRoaXMubmV3RGVwcztcbiAgdGhpcy5uZXdEZXBzID0gdG1wO1xuICB0aGlzLm5ld0RlcHMubGVuZ3RoID0gMDtcbn07XG5cbi8qKlxuICogU3Vic2NyaWJlciBpbnRlcmZhY2UuXG4gKiBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgZGVwZW5kZW5jeSBjaGFuZ2VzLlxuICovXG5XYXRjaGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKCkge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAodGhpcy5sYXp5KSB7XG4gICAgdGhpcy5kaXJ0eSA9IHRydWU7XG4gIH0gZWxzZSBpZiAodGhpcy5zeW5jKSB7XG4gICAgdGhpcy5ydW4oKTtcbiAgfSBlbHNlIHtcbiAgICBxdWV1ZVdhdGNoZXIodGhpcyk7XG4gIH1cbn07XG5cbi8qKlxuICogU2NoZWR1bGVyIGpvYiBpbnRlcmZhY2UuXG4gKiBXaWxsIGJlIGNhbGxlZCBieSB0aGUgc2NoZWR1bGVyLlxuICovXG5XYXRjaGVyLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiBydW4gKCkge1xuICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmdldCgpO1xuICAgIGlmIChcbiAgICAgIHZhbHVlICE9PSB0aGlzLnZhbHVlIHx8XG4gICAgICAvLyBEZWVwIHdhdGNoZXJzIGFuZCB3YXRjaGVycyBvbiBPYmplY3QvQXJyYXlzIHNob3VsZCBmaXJlIGV2ZW5cbiAgICAgIC8vIHdoZW4gdGhlIHZhbHVlIGlzIHRoZSBzYW1lLCBiZWNhdXNlIHRoZSB2YWx1ZSBtYXlcbiAgICAgIC8vIGhhdmUgbXV0YXRlZC5cbiAgICAgIGlzT2JqZWN0KHZhbHVlKSB8fFxuICAgICAgdGhpcy5kZWVwXG4gICAgKSB7XG4gICAgICAvLyBzZXQgbmV3IHZhbHVlXG4gICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgaWYgKHRoaXMudXNlcikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuY2IuY2FsbCh0aGlzLnZtLCB2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaGFuZGxlRXJyb3IoZSwgdGhpcy52bSwgKFwiY2FsbGJhY2sgZm9yIHdhdGNoZXIgXFxcIlwiICsgKHRoaXMuZXhwcmVzc2lvbikgKyBcIlxcXCJcIikpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNiLmNhbGwodGhpcy52bSwgdmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogRXZhbHVhdGUgdGhlIHZhbHVlIG9mIHRoZSB3YXRjaGVyLlxuICogVGhpcyBvbmx5IGdldHMgY2FsbGVkIGZvciBsYXp5IHdhdGNoZXJzLlxuICovXG5XYXRjaGVyLnByb3RvdHlwZS5ldmFsdWF0ZSA9IGZ1bmN0aW9uIGV2YWx1YXRlICgpIHtcbiAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0KCk7XG4gIHRoaXMuZGlydHkgPSBmYWxzZTtcbn07XG5cbi8qKlxuICogRGVwZW5kIG9uIGFsbCBkZXBzIGNvbGxlY3RlZCBieSB0aGlzIHdhdGNoZXIuXG4gKi9cbldhdGNoZXIucHJvdG90eXBlLmRlcGVuZCA9IGZ1bmN0aW9uIGRlcGVuZCAoKSB7XG4gIHZhciBpID0gdGhpcy5kZXBzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIHRoaXMuZGVwc1tpXS5kZXBlbmQoKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmUgc2VsZiBmcm9tIGFsbCBkZXBlbmRlbmNpZXMnIHN1YnNjcmliZXIgbGlzdC5cbiAqL1xuV2F0Y2hlci5wcm90b3R5cGUudGVhcmRvd24gPSBmdW5jdGlvbiB0ZWFyZG93biAoKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gdm0ncyB3YXRjaGVyIGxpc3RcbiAgICAvLyB0aGlzIGlzIGEgc29tZXdoYXQgZXhwZW5zaXZlIG9wZXJhdGlvbiBzbyB3ZSBza2lwIGl0XG4gICAgLy8gaWYgdGhlIHZtIGlzIGJlaW5nIGRlc3Ryb3llZC5cbiAgICBpZiAoIXRoaXMudm0uX2lzQmVpbmdEZXN0cm95ZWQpIHtcbiAgICAgIHJlbW92ZSh0aGlzLnZtLl93YXRjaGVycywgdGhpcyk7XG4gICAgfVxuICAgIHZhciBpID0gdGhpcy5kZXBzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICB0aGlzLmRlcHNbaV0ucmVtb3ZlU3ViKHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICB9XG59O1xuXG4vKiAgKi9cblxudmFyIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbiA9IHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IG5vb3AsXG4gIHNldDogbm9vcFxufTtcblxuZnVuY3Rpb24gcHJveHkgKHRhcmdldCwgc291cmNlS2V5LCBrZXkpIHtcbiAgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uLmdldCA9IGZ1bmN0aW9uIHByb3h5R2V0dGVyICgpIHtcbiAgICByZXR1cm4gdGhpc1tzb3VyY2VLZXldW2tleV1cbiAgfTtcbiAgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uLnNldCA9IGZ1bmN0aW9uIHByb3h5U2V0dGVyICh2YWwpIHtcbiAgICB0aGlzW3NvdXJjZUtleV1ba2V5XSA9IHZhbDtcbiAgfTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24pO1xufVxuXG5mdW5jdGlvbiBpbml0U3RhdGUgKHZtKSB7XG4gIHZtLl93YXRjaGVycyA9IFtdO1xuICB2YXIgb3B0cyA9IHZtLiRvcHRpb25zO1xuICBpZiAob3B0cy5wcm9wcykgeyBpbml0UHJvcHModm0sIG9wdHMucHJvcHMpOyB9XG4gIGlmIChvcHRzLm1ldGhvZHMpIHsgaW5pdE1ldGhvZHModm0sIG9wdHMubWV0aG9kcyk7IH1cbiAgaWYgKG9wdHMuZGF0YSkge1xuICAgIGluaXREYXRhKHZtKTtcbiAgfSBlbHNlIHtcbiAgICBvYnNlcnZlKHZtLl9kYXRhID0ge30sIHRydWUgLyogYXNSb290RGF0YSAqLyk7XG4gIH1cbiAgaWYgKG9wdHMuY29tcHV0ZWQpIHsgaW5pdENvbXB1dGVkKHZtLCBvcHRzLmNvbXB1dGVkKTsgfVxuICBpZiAob3B0cy53YXRjaCAmJiBvcHRzLndhdGNoICE9PSBuYXRpdmVXYXRjaCkge1xuICAgIGluaXRXYXRjaCh2bSwgb3B0cy53YXRjaCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFByb3BzICh2bSwgcHJvcHNPcHRpb25zKSB7XG4gIHZhciBwcm9wc0RhdGEgPSB2bS4kb3B0aW9ucy5wcm9wc0RhdGEgfHwge307XG4gIHZhciBwcm9wcyA9IHZtLl9wcm9wcyA9IHt9O1xuICAvLyBjYWNoZSBwcm9wIGtleXMgc28gdGhhdCBmdXR1cmUgcHJvcHMgdXBkYXRlcyBjYW4gaXRlcmF0ZSB1c2luZyBBcnJheVxuICAvLyBpbnN0ZWFkIG9mIGR5bmFtaWMgb2JqZWN0IGtleSBlbnVtZXJhdGlvbi5cbiAgdmFyIGtleXMgPSB2bS4kb3B0aW9ucy5fcHJvcEtleXMgPSBbXTtcbiAgdmFyIGlzUm9vdCA9ICF2bS4kcGFyZW50O1xuICAvLyByb290IGluc3RhbmNlIHByb3BzIHNob3VsZCBiZSBjb252ZXJ0ZWRcbiAgaWYgKCFpc1Jvb3QpIHtcbiAgICB0b2dnbGVPYnNlcnZpbmcoZmFsc2UpO1xuICB9XG4gIHZhciBsb29wID0gZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAga2V5cy5wdXNoKGtleSk7XG4gICAgdmFyIHZhbHVlID0gdmFsaWRhdGVQcm9wKGtleSwgcHJvcHNPcHRpb25zLCBwcm9wc0RhdGEsIHZtKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgaHlwaGVuYXRlZEtleSA9IGh5cGhlbmF0ZShrZXkpO1xuICAgICAgaWYgKGlzUmVzZXJ2ZWRBdHRyaWJ1dGUoaHlwaGVuYXRlZEtleSkgfHxcbiAgICAgICAgICBjb25maWcuaXNSZXNlcnZlZEF0dHIoaHlwaGVuYXRlZEtleSkpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICAoXCJcXFwiXCIgKyBoeXBoZW5hdGVkS2V5ICsgXCJcXFwiIGlzIGEgcmVzZXJ2ZWQgYXR0cmlidXRlIGFuZCBjYW5ub3QgYmUgdXNlZCBhcyBjb21wb25lbnQgcHJvcC5cIiksXG4gICAgICAgICAgdm1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGRlZmluZVJlYWN0aXZlJCQxKHByb3BzLCBrZXksIHZhbHVlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNSb290ICYmICFpc1VwZGF0aW5nQ2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZih2bS5tcEhvc3QgPT09ICdtcC1iYWlkdScpey8v55m+5bqmIG9ic2VydmVyIOWcqCBzZXREYXRhIGNhbGxiYWNrIOS5i+WQjuinpuWPke+8jOebtOaOpeW/veeVpeivpSB3YXJuXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2ZpeGVkIGJ5IHh4eHh4eCBfX25leHRfdGlja19wZW5kaW5nLHVuaTovL2Zvcm0tZmllbGQg5pe25LiN5ZGK6K2mXG4gICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICBrZXkgPT09ICd2YWx1ZScgJiYgXG4gICAgICAgICAgICAgICAgQXJyYXkuaXNBcnJheSh2bS4kb3B0aW9ucy5iZWhhdmlvcnMpICYmXG4gICAgICAgICAgICAgICAgdm0uJG9wdGlvbnMuYmVoYXZpb3JzLmluZGV4T2YoJ3VuaTovL2Zvcm0tZmllbGQnKSAhPT0gLTFcbiAgICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih2bS5fZ2V0Rm9ybURhdGEpe1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciAkcGFyZW50ID0gdm0uJHBhcmVudDtcbiAgICAgICAgICAgIHdoaWxlKCRwYXJlbnQpe1xuICAgICAgICAgICAgICBpZigkcGFyZW50Ll9fbmV4dF90aWNrX3BlbmRpbmcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAgXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgJHBhcmVudCA9ICRwYXJlbnQuJHBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgd2FybihcbiAgICAgICAgICAgIFwiQXZvaWQgbXV0YXRpbmcgYSBwcm9wIGRpcmVjdGx5IHNpbmNlIHRoZSB2YWx1ZSB3aWxsIGJlIFwiICtcbiAgICAgICAgICAgIFwib3ZlcndyaXR0ZW4gd2hlbmV2ZXIgdGhlIHBhcmVudCBjb21wb25lbnQgcmUtcmVuZGVycy4gXCIgK1xuICAgICAgICAgICAgXCJJbnN0ZWFkLCB1c2UgYSBkYXRhIG9yIGNvbXB1dGVkIHByb3BlcnR5IGJhc2VkIG9uIHRoZSBwcm9wJ3MgXCIgK1xuICAgICAgICAgICAgXCJ2YWx1ZS4gUHJvcCBiZWluZyBtdXRhdGVkOiBcXFwiXCIgKyBrZXkgKyBcIlxcXCJcIixcbiAgICAgICAgICAgIHZtXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmluZVJlYWN0aXZlJCQxKHByb3BzLCBrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgLy8gc3RhdGljIHByb3BzIGFyZSBhbHJlYWR5IHByb3hpZWQgb24gdGhlIGNvbXBvbmVudCdzIHByb3RvdHlwZVxuICAgIC8vIGR1cmluZyBWdWUuZXh0ZW5kKCkuIFdlIG9ubHkgbmVlZCB0byBwcm94eSBwcm9wcyBkZWZpbmVkIGF0XG4gICAgLy8gaW5zdGFudGlhdGlvbiBoZXJlLlxuICAgIGlmICghKGtleSBpbiB2bSkpIHtcbiAgICAgIHByb3h5KHZtLCBcIl9wcm9wc1wiLCBrZXkpO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKHZhciBrZXkgaW4gcHJvcHNPcHRpb25zKSBsb29wKCBrZXkgKTtcbiAgdG9nZ2xlT2JzZXJ2aW5nKHRydWUpO1xufVxuXG5mdW5jdGlvbiBpbml0RGF0YSAodm0pIHtcbiAgdmFyIGRhdGEgPSB2bS4kb3B0aW9ucy5kYXRhO1xuICBkYXRhID0gdm0uX2RhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gZ2V0RGF0YShkYXRhLCB2bSlcbiAgICA6IGRhdGEgfHwge307XG4gIGlmICghaXNQbGFpbk9iamVjdChkYXRhKSkge1xuICAgIGRhdGEgPSB7fTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXG4gICAgICAnZGF0YSBmdW5jdGlvbnMgc2hvdWxkIHJldHVybiBhbiBvYmplY3Q6XFxuJyArXG4gICAgICAnaHR0cHM6Ly92dWVqcy5vcmcvdjIvZ3VpZGUvY29tcG9uZW50cy5odG1sI2RhdGEtTXVzdC1CZS1hLUZ1bmN0aW9uJyxcbiAgICAgIHZtXG4gICAgKTtcbiAgfVxuICAvLyBwcm94eSBkYXRhIG9uIGluc3RhbmNlXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gIHZhciBwcm9wcyA9IHZtLiRvcHRpb25zLnByb3BzO1xuICB2YXIgbWV0aG9kcyA9IHZtLiRvcHRpb25zLm1ldGhvZHM7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgaWYgKG1ldGhvZHMgJiYgaGFzT3duKG1ldGhvZHMsIGtleSkpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICAoXCJNZXRob2QgXFxcIlwiICsga2V5ICsgXCJcXFwiIGhhcyBhbHJlYWR5IGJlZW4gZGVmaW5lZCBhcyBhIGRhdGEgcHJvcGVydHkuXCIpLFxuICAgICAgICAgIHZtXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9wcyAmJiBoYXNPd24ocHJvcHMsIGtleSkpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICAgXCJUaGUgZGF0YSBwcm9wZXJ0eSBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgaXMgYWxyZWFkeSBkZWNsYXJlZCBhcyBhIHByb3AuIFwiICtcbiAgICAgICAgXCJVc2UgcHJvcCBkZWZhdWx0IHZhbHVlIGluc3RlYWQuXCIsXG4gICAgICAgIHZtXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoIWlzUmVzZXJ2ZWQoa2V5KSkge1xuICAgICAgcHJveHkodm0sIFwiX2RhdGFcIiwga2V5KTtcbiAgICB9XG4gIH1cbiAgLy8gb2JzZXJ2ZSBkYXRhXG4gIG9ic2VydmUoZGF0YSwgdHJ1ZSAvKiBhc1Jvb3REYXRhICovKTtcbn1cblxuZnVuY3Rpb24gZ2V0RGF0YSAoZGF0YSwgdm0pIHtcbiAgLy8gIzc1NzMgZGlzYWJsZSBkZXAgY29sbGVjdGlvbiB3aGVuIGludm9raW5nIGRhdGEgZ2V0dGVyc1xuICBwdXNoVGFyZ2V0KCk7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRhdGEuY2FsbCh2bSwgdm0pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBoYW5kbGVFcnJvcihlLCB2bSwgXCJkYXRhKClcIik7XG4gICAgcmV0dXJuIHt9XG4gIH0gZmluYWxseSB7XG4gICAgcG9wVGFyZ2V0KCk7XG4gIH1cbn1cblxudmFyIGNvbXB1dGVkV2F0Y2hlck9wdGlvbnMgPSB7IGxhenk6IHRydWUgfTtcblxuZnVuY3Rpb24gaW5pdENvbXB1dGVkICh2bSwgY29tcHV0ZWQpIHtcbiAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXG4gIHZhciB3YXRjaGVycyA9IHZtLl9jb21wdXRlZFdhdGNoZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgLy8gY29tcHV0ZWQgcHJvcGVydGllcyBhcmUganVzdCBnZXR0ZXJzIGR1cmluZyBTU1JcbiAgdmFyIGlzU1NSID0gaXNTZXJ2ZXJSZW5kZXJpbmcoKTtcblxuICBmb3IgKHZhciBrZXkgaW4gY29tcHV0ZWQpIHtcbiAgICB2YXIgdXNlckRlZiA9IGNvbXB1dGVkW2tleV07XG4gICAgdmFyIGdldHRlciA9IHR5cGVvZiB1c2VyRGVmID09PSAnZnVuY3Rpb24nID8gdXNlckRlZiA6IHVzZXJEZWYuZ2V0O1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIGdldHRlciA9PSBudWxsKSB7XG4gICAgICB3YXJuKFxuICAgICAgICAoXCJHZXR0ZXIgaXMgbWlzc2luZyBmb3IgY29tcHV0ZWQgcHJvcGVydHkgXFxcIlwiICsga2V5ICsgXCJcXFwiLlwiKSxcbiAgICAgICAgdm1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFpc1NTUikge1xuICAgICAgLy8gY3JlYXRlIGludGVybmFsIHdhdGNoZXIgZm9yIHRoZSBjb21wdXRlZCBwcm9wZXJ0eS5cbiAgICAgIHdhdGNoZXJzW2tleV0gPSBuZXcgV2F0Y2hlcihcbiAgICAgICAgdm0sXG4gICAgICAgIGdldHRlciB8fCBub29wLFxuICAgICAgICBub29wLFxuICAgICAgICBjb21wdXRlZFdhdGNoZXJPcHRpb25zXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGNvbXBvbmVudC1kZWZpbmVkIGNvbXB1dGVkIHByb3BlcnRpZXMgYXJlIGFscmVhZHkgZGVmaW5lZCBvbiB0aGVcbiAgICAvLyBjb21wb25lbnQgcHJvdG90eXBlLiBXZSBvbmx5IG5lZWQgdG8gZGVmaW5lIGNvbXB1dGVkIHByb3BlcnRpZXMgZGVmaW5lZFxuICAgIC8vIGF0IGluc3RhbnRpYXRpb24gaGVyZS5cbiAgICBpZiAoIShrZXkgaW4gdm0pKSB7XG4gICAgICBkZWZpbmVDb21wdXRlZCh2bSwga2V5LCB1c2VyRGVmKTtcbiAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmIChrZXkgaW4gdm0uJGRhdGEpIHtcbiAgICAgICAgd2FybigoXCJUaGUgY29tcHV0ZWQgcHJvcGVydHkgXFxcIlwiICsga2V5ICsgXCJcXFwiIGlzIGFscmVhZHkgZGVmaW5lZCBpbiBkYXRhLlwiKSwgdm0pO1xuICAgICAgfSBlbHNlIGlmICh2bS4kb3B0aW9ucy5wcm9wcyAmJiBrZXkgaW4gdm0uJG9wdGlvbnMucHJvcHMpIHtcbiAgICAgICAgd2FybigoXCJUaGUgY29tcHV0ZWQgcHJvcGVydHkgXFxcIlwiICsga2V5ICsgXCJcXFwiIGlzIGFscmVhZHkgZGVmaW5lZCBhcyBhIHByb3AuXCIpLCB2bSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlZmluZUNvbXB1dGVkIChcbiAgdGFyZ2V0LFxuICBrZXksXG4gIHVzZXJEZWZcbikge1xuICB2YXIgc2hvdWxkQ2FjaGUgPSAhaXNTZXJ2ZXJSZW5kZXJpbmcoKTtcbiAgaWYgKHR5cGVvZiB1c2VyRGVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uLmdldCA9IHNob3VsZENhY2hlXG4gICAgICA/IGNyZWF0ZUNvbXB1dGVkR2V0dGVyKGtleSlcbiAgICAgIDogY3JlYXRlR2V0dGVySW52b2tlcih1c2VyRGVmKTtcbiAgICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uc2V0ID0gbm9vcDtcbiAgfSBlbHNlIHtcbiAgICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uZ2V0ID0gdXNlckRlZi5nZXRcbiAgICAgID8gc2hvdWxkQ2FjaGUgJiYgdXNlckRlZi5jYWNoZSAhPT0gZmFsc2VcbiAgICAgICAgPyBjcmVhdGVDb21wdXRlZEdldHRlcihrZXkpXG4gICAgICAgIDogY3JlYXRlR2V0dGVySW52b2tlcih1c2VyRGVmLmdldClcbiAgICAgIDogbm9vcDtcbiAgICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uc2V0ID0gdXNlckRlZi5zZXQgfHwgbm9vcDtcbiAgfVxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJlxuICAgICAgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uLnNldCA9PT0gbm9vcCkge1xuICAgIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbi5zZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB3YXJuKFxuICAgICAgICAoXCJDb21wdXRlZCBwcm9wZXJ0eSBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgd2FzIGFzc2lnbmVkIHRvIGJ1dCBpdCBoYXMgbm8gc2V0dGVyLlwiKSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9O1xuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tcHV0ZWRHZXR0ZXIgKGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24gY29tcHV0ZWRHZXR0ZXIgKCkge1xuICAgIHZhciB3YXRjaGVyID0gdGhpcy5fY29tcHV0ZWRXYXRjaGVycyAmJiB0aGlzLl9jb21wdXRlZFdhdGNoZXJzW2tleV07XG4gICAgaWYgKHdhdGNoZXIpIHtcbiAgICAgIGlmICh3YXRjaGVyLmRpcnR5KSB7XG4gICAgICAgIHdhdGNoZXIuZXZhbHVhdGUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChEZXAuU2hhcmVkT2JqZWN0LnRhcmdldCkgey8vIGZpeGVkIGJ5IHh4eHh4eFxuICAgICAgICB3YXRjaGVyLmRlcGVuZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHdhdGNoZXIudmFsdWVcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlR2V0dGVySW52b2tlcihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gY29tcHV0ZWRHZXR0ZXIgKCkge1xuICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIHRoaXMpXG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdE1ldGhvZHMgKHZtLCBtZXRob2RzKSB7XG4gIHZhciBwcm9wcyA9IHZtLiRvcHRpb25zLnByb3BzO1xuICBmb3IgKHZhciBrZXkgaW4gbWV0aG9kcykge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBpZiAodHlwZW9mIG1ldGhvZHNba2V5XSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgIFwiTWV0aG9kIFxcXCJcIiArIGtleSArIFwiXFxcIiBoYXMgdHlwZSBcXFwiXCIgKyAodHlwZW9mIG1ldGhvZHNba2V5XSkgKyBcIlxcXCIgaW4gdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLiBcIiArXG4gICAgICAgICAgXCJEaWQgeW91IHJlZmVyZW5jZSB0aGUgZnVuY3Rpb24gY29ycmVjdGx5P1wiLFxuICAgICAgICAgIHZtXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAocHJvcHMgJiYgaGFzT3duKHByb3BzLCBrZXkpKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgKFwiTWV0aG9kIFxcXCJcIiArIGtleSArIFwiXFxcIiBoYXMgYWxyZWFkeSBiZWVuIGRlZmluZWQgYXMgYSBwcm9wLlwiKSxcbiAgICAgICAgICB2bVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKChrZXkgaW4gdm0pICYmIGlzUmVzZXJ2ZWQoa2V5KSkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgIFwiTWV0aG9kIFxcXCJcIiArIGtleSArIFwiXFxcIiBjb25mbGljdHMgd2l0aCBhbiBleGlzdGluZyBWdWUgaW5zdGFuY2UgbWV0aG9kLiBcIiArXG4gICAgICAgICAgXCJBdm9pZCBkZWZpbmluZyBjb21wb25lbnQgbWV0aG9kcyB0aGF0IHN0YXJ0IHdpdGggXyBvciAkLlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIHZtW2tleV0gPSB0eXBlb2YgbWV0aG9kc1trZXldICE9PSAnZnVuY3Rpb24nID8gbm9vcCA6IGJpbmQobWV0aG9kc1trZXldLCB2bSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFdhdGNoICh2bSwgd2F0Y2gpIHtcbiAgZm9yICh2YXIga2V5IGluIHdhdGNoKSB7XG4gICAgdmFyIGhhbmRsZXIgPSB3YXRjaFtrZXldO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY3JlYXRlV2F0Y2hlcih2bSwga2V5LCBoYW5kbGVyW2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY3JlYXRlV2F0Y2hlcih2bSwga2V5LCBoYW5kbGVyKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlV2F0Y2hlciAoXG4gIHZtLFxuICBleHBPckZuLFxuICBoYW5kbGVyLFxuICBvcHRpb25zXG4pIHtcbiAgaWYgKGlzUGxhaW5PYmplY3QoaGFuZGxlcikpIHtcbiAgICBvcHRpb25zID0gaGFuZGxlcjtcbiAgICBoYW5kbGVyID0gaGFuZGxlci5oYW5kbGVyO1xuICB9XG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZycpIHtcbiAgICBoYW5kbGVyID0gdm1baGFuZGxlcl07XG4gIH1cbiAgcmV0dXJuIHZtLiR3YXRjaChleHBPckZuLCBoYW5kbGVyLCBvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBzdGF0ZU1peGluIChWdWUpIHtcbiAgLy8gZmxvdyBzb21laG93IGhhcyBwcm9ibGVtcyB3aXRoIGRpcmVjdGx5IGRlY2xhcmVkIGRlZmluaXRpb24gb2JqZWN0XG4gIC8vIHdoZW4gdXNpbmcgT2JqZWN0LmRlZmluZVByb3BlcnR5LCBzbyB3ZSBoYXZlIHRvIHByb2NlZHVyYWxseSBidWlsZCB1cFxuICAvLyB0aGUgb2JqZWN0IGhlcmUuXG4gIHZhciBkYXRhRGVmID0ge307XG4gIGRhdGFEZWYuZ2V0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fZGF0YSB9O1xuICB2YXIgcHJvcHNEZWYgPSB7fTtcbiAgcHJvcHNEZWYuZ2V0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fcHJvcHMgfTtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBkYXRhRGVmLnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgICdBdm9pZCByZXBsYWNpbmcgaW5zdGFuY2Ugcm9vdCAkZGF0YS4gJyArXG4gICAgICAgICdVc2UgbmVzdGVkIGRhdGEgcHJvcGVydGllcyBpbnN0ZWFkLicsXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfTtcbiAgICBwcm9wc0RlZi5zZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB3YXJuKFwiJHByb3BzIGlzIHJlYWRvbmx5LlwiLCB0aGlzKTtcbiAgICB9O1xuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShWdWUucHJvdG90eXBlLCAnJGRhdGEnLCBkYXRhRGVmKTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFZ1ZS5wcm90b3R5cGUsICckcHJvcHMnLCBwcm9wc0RlZik7XG5cbiAgVnVlLnByb3RvdHlwZS4kc2V0ID0gc2V0O1xuICBWdWUucHJvdG90eXBlLiRkZWxldGUgPSBkZWw7XG5cbiAgVnVlLnByb3RvdHlwZS4kd2F0Y2ggPSBmdW5jdGlvbiAoXG4gICAgZXhwT3JGbixcbiAgICBjYixcbiAgICBvcHRpb25zXG4gICkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QoY2IpKSB7XG4gICAgICByZXR1cm4gY3JlYXRlV2F0Y2hlcih2bSwgZXhwT3JGbiwgY2IsIG9wdGlvbnMpXG4gICAgfVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMudXNlciA9IHRydWU7XG4gICAgdmFyIHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih2bSwgZXhwT3JGbiwgY2IsIG9wdGlvbnMpO1xuICAgIGlmIChvcHRpb25zLmltbWVkaWF0ZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY2IuY2FsbCh2bSwgd2F0Y2hlci52YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBoYW5kbGVFcnJvcihlcnJvciwgdm0sIChcImNhbGxiYWNrIGZvciBpbW1lZGlhdGUgd2F0Y2hlciBcXFwiXCIgKyAod2F0Y2hlci5leHByZXNzaW9uKSArIFwiXFxcIlwiKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiB1bndhdGNoRm4gKCkge1xuICAgICAgd2F0Y2hlci50ZWFyZG93bigpO1xuICAgIH1cbiAgfTtcbn1cblxuLyogICovXG5cbnZhciB1aWQkMyA9IDA7XG5cbmZ1bmN0aW9uIGluaXRNaXhpbiAoVnVlKSB7XG4gIFZ1ZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgLy8gYSB1aWRcbiAgICB2bS5fdWlkID0gdWlkJDMrKztcblxuICAgIHZhciBzdGFydFRhZywgZW5kVGFnO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNvbmZpZy5wZXJmb3JtYW5jZSAmJiBtYXJrKSB7XG4gICAgICBzdGFydFRhZyA9IFwidnVlLXBlcmYtc3RhcnQ6XCIgKyAodm0uX3VpZCk7XG4gICAgICBlbmRUYWcgPSBcInZ1ZS1wZXJmLWVuZDpcIiArICh2bS5fdWlkKTtcbiAgICAgIG1hcmsoc3RhcnRUYWcpO1xuICAgIH1cblxuICAgIC8vIGEgZmxhZyB0byBhdm9pZCB0aGlzIGJlaW5nIG9ic2VydmVkXG4gICAgdm0uX2lzVnVlID0gdHJ1ZTtcbiAgICAvLyBtZXJnZSBvcHRpb25zXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5faXNDb21wb25lbnQpIHtcbiAgICAgIC8vIG9wdGltaXplIGludGVybmFsIGNvbXBvbmVudCBpbnN0YW50aWF0aW9uXG4gICAgICAvLyBzaW5jZSBkeW5hbWljIG9wdGlvbnMgbWVyZ2luZyBpcyBwcmV0dHkgc2xvdywgYW5kIG5vbmUgb2YgdGhlXG4gICAgICAvLyBpbnRlcm5hbCBjb21wb25lbnQgb3B0aW9ucyBuZWVkcyBzcGVjaWFsIHRyZWF0bWVudC5cbiAgICAgIGluaXRJbnRlcm5hbENvbXBvbmVudCh2bSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZtLiRvcHRpb25zID0gbWVyZ2VPcHRpb25zKFxuICAgICAgICByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zKHZtLmNvbnN0cnVjdG9yKSxcbiAgICAgICAgb3B0aW9ucyB8fCB7fSxcbiAgICAgICAgdm1cbiAgICAgICk7XG4gICAgfVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGluaXRQcm94eSh2bSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZtLl9yZW5kZXJQcm94eSA9IHZtO1xuICAgIH1cbiAgICAvLyBleHBvc2UgcmVhbCBzZWxmXG4gICAgdm0uX3NlbGYgPSB2bTtcbiAgICBpbml0TGlmZWN5Y2xlKHZtKTtcbiAgICBpbml0RXZlbnRzKHZtKTtcbiAgICBpbml0UmVuZGVyKHZtKTtcbiAgICBjYWxsSG9vayh2bSwgJ2JlZm9yZUNyZWF0ZScpO1xuICAgIHZtLm1wSG9zdCAhPT0gJ21wLXRvdXRpYW8nICYmIGluaXRJbmplY3Rpb25zKHZtKTsgLy8gcmVzb2x2ZSBpbmplY3Rpb25zIGJlZm9yZSBkYXRhL3Byb3BzICBcbiAgICBpbml0U3RhdGUodm0pO1xuICAgIHZtLm1wSG9zdCAhPT0gJ21wLXRvdXRpYW8nICYmIGluaXRQcm92aWRlKHZtKTsgLy8gcmVzb2x2ZSBwcm92aWRlIGFmdGVyIGRhdGEvcHJvcHNcbiAgICB2bS5tcEhvc3QgIT09ICdtcC10b3V0aWFvJyAmJiBjYWxsSG9vayh2bSwgJ2NyZWF0ZWQnKTsgICAgICBcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNvbmZpZy5wZXJmb3JtYW5jZSAmJiBtYXJrKSB7XG4gICAgICB2bS5fbmFtZSA9IGZvcm1hdENvbXBvbmVudE5hbWUodm0sIGZhbHNlKTtcbiAgICAgIG1hcmsoZW5kVGFnKTtcbiAgICAgIG1lYXN1cmUoKFwidnVlIFwiICsgKHZtLl9uYW1lKSArIFwiIGluaXRcIiksIHN0YXJ0VGFnLCBlbmRUYWcpO1xuICAgIH1cblxuICAgIGlmICh2bS4kb3B0aW9ucy5lbCkge1xuICAgICAgdm0uJG1vdW50KHZtLiRvcHRpb25zLmVsKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGluaXRJbnRlcm5hbENvbXBvbmVudCAodm0sIG9wdGlvbnMpIHtcbiAgdmFyIG9wdHMgPSB2bS4kb3B0aW9ucyA9IE9iamVjdC5jcmVhdGUodm0uY29uc3RydWN0b3Iub3B0aW9ucyk7XG4gIC8vIGRvaW5nIHRoaXMgYmVjYXVzZSBpdCdzIGZhc3RlciB0aGFuIGR5bmFtaWMgZW51bWVyYXRpb24uXG4gIHZhciBwYXJlbnRWbm9kZSA9IG9wdGlvbnMuX3BhcmVudFZub2RlO1xuICBvcHRzLnBhcmVudCA9IG9wdGlvbnMucGFyZW50O1xuICBvcHRzLl9wYXJlbnRWbm9kZSA9IHBhcmVudFZub2RlO1xuXG4gIHZhciB2bm9kZUNvbXBvbmVudE9wdGlvbnMgPSBwYXJlbnRWbm9kZS5jb21wb25lbnRPcHRpb25zO1xuICBvcHRzLnByb3BzRGF0YSA9IHZub2RlQ29tcG9uZW50T3B0aW9ucy5wcm9wc0RhdGE7XG4gIG9wdHMuX3BhcmVudExpc3RlbmVycyA9IHZub2RlQ29tcG9uZW50T3B0aW9ucy5saXN0ZW5lcnM7XG4gIG9wdHMuX3JlbmRlckNoaWxkcmVuID0gdm5vZGVDb21wb25lbnRPcHRpb25zLmNoaWxkcmVuO1xuICBvcHRzLl9jb21wb25lbnRUYWcgPSB2bm9kZUNvbXBvbmVudE9wdGlvbnMudGFnO1xuXG4gIGlmIChvcHRpb25zLnJlbmRlcikge1xuICAgIG9wdHMucmVuZGVyID0gb3B0aW9ucy5yZW5kZXI7XG4gICAgb3B0cy5zdGF0aWNSZW5kZXJGbnMgPSBvcHRpb25zLnN0YXRpY1JlbmRlckZucztcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zIChDdG9yKSB7XG4gIHZhciBvcHRpb25zID0gQ3Rvci5vcHRpb25zO1xuICBpZiAoQ3Rvci5zdXBlcikge1xuICAgIHZhciBzdXBlck9wdGlvbnMgPSByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zKEN0b3Iuc3VwZXIpO1xuICAgIHZhciBjYWNoZWRTdXBlck9wdGlvbnMgPSBDdG9yLnN1cGVyT3B0aW9ucztcbiAgICBpZiAoc3VwZXJPcHRpb25zICE9PSBjYWNoZWRTdXBlck9wdGlvbnMpIHtcbiAgICAgIC8vIHN1cGVyIG9wdGlvbiBjaGFuZ2VkLFxuICAgICAgLy8gbmVlZCB0byByZXNvbHZlIG5ldyBvcHRpb25zLlxuICAgICAgQ3Rvci5zdXBlck9wdGlvbnMgPSBzdXBlck9wdGlvbnM7XG4gICAgICAvLyBjaGVjayBpZiB0aGVyZSBhcmUgYW55IGxhdGUtbW9kaWZpZWQvYXR0YWNoZWQgb3B0aW9ucyAoIzQ5NzYpXG4gICAgICB2YXIgbW9kaWZpZWRPcHRpb25zID0gcmVzb2x2ZU1vZGlmaWVkT3B0aW9ucyhDdG9yKTtcbiAgICAgIC8vIHVwZGF0ZSBiYXNlIGV4dGVuZCBvcHRpb25zXG4gICAgICBpZiAobW9kaWZpZWRPcHRpb25zKSB7XG4gICAgICAgIGV4dGVuZChDdG9yLmV4dGVuZE9wdGlvbnMsIG1vZGlmaWVkT3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gQ3Rvci5vcHRpb25zID0gbWVyZ2VPcHRpb25zKHN1cGVyT3B0aW9ucywgQ3Rvci5leHRlbmRPcHRpb25zKTtcbiAgICAgIGlmIChvcHRpb25zLm5hbWUpIHtcbiAgICAgICAgb3B0aW9ucy5jb21wb25lbnRzW29wdGlvbnMubmFtZV0gPSBDdG9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb3B0aW9uc1xufVxuXG5mdW5jdGlvbiByZXNvbHZlTW9kaWZpZWRPcHRpb25zIChDdG9yKSB7XG4gIHZhciBtb2RpZmllZDtcbiAgdmFyIGxhdGVzdCA9IEN0b3Iub3B0aW9ucztcbiAgdmFyIHNlYWxlZCA9IEN0b3Iuc2VhbGVkT3B0aW9ucztcbiAgZm9yICh2YXIga2V5IGluIGxhdGVzdCkge1xuICAgIGlmIChsYXRlc3Rba2V5XSAhPT0gc2VhbGVkW2tleV0pIHtcbiAgICAgIGlmICghbW9kaWZpZWQpIHsgbW9kaWZpZWQgPSB7fTsgfVxuICAgICAgbW9kaWZpZWRba2V5XSA9IGxhdGVzdFtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbW9kaWZpZWRcbn1cblxuZnVuY3Rpb24gVnVlIChvcHRpb25zKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgISh0aGlzIGluc3RhbmNlb2YgVnVlKVxuICApIHtcbiAgICB3YXJuKCdWdWUgaXMgYSBjb25zdHJ1Y3RvciBhbmQgc2hvdWxkIGJlIGNhbGxlZCB3aXRoIHRoZSBgbmV3YCBrZXl3b3JkJyk7XG4gIH1cbiAgdGhpcy5faW5pdChvcHRpb25zKTtcbn1cblxuaW5pdE1peGluKFZ1ZSk7XG5zdGF0ZU1peGluKFZ1ZSk7XG5ldmVudHNNaXhpbihWdWUpO1xubGlmZWN5Y2xlTWl4aW4oVnVlKTtcbnJlbmRlck1peGluKFZ1ZSk7XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBpbml0VXNlIChWdWUpIHtcbiAgVnVlLnVzZSA9IGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICB2YXIgaW5zdGFsbGVkUGx1Z2lucyA9ICh0aGlzLl9pbnN0YWxsZWRQbHVnaW5zIHx8ICh0aGlzLl9pbnN0YWxsZWRQbHVnaW5zID0gW10pKTtcbiAgICBpZiAoaW5zdGFsbGVkUGx1Z2lucy5pbmRleE9mKHBsdWdpbikgPiAtMSkge1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvLyBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcbiAgICB2YXIgYXJncyA9IHRvQXJyYXkoYXJndW1lbnRzLCAxKTtcbiAgICBhcmdzLnVuc2hpZnQodGhpcyk7XG4gICAgaWYgKHR5cGVvZiBwbHVnaW4uaW5zdGFsbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcGx1Z2luLmluc3RhbGwuYXBwbHkocGx1Z2luLCBhcmdzKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHBsdWdpbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9XG4gICAgaW5zdGFsbGVkUGx1Z2lucy5wdXNoKHBsdWdpbik7XG4gICAgcmV0dXJuIHRoaXNcbiAgfTtcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGluaXRNaXhpbiQxIChWdWUpIHtcbiAgVnVlLm1peGluID0gZnVuY3Rpb24gKG1peGluKSB7XG4gICAgdGhpcy5vcHRpb25zID0gbWVyZ2VPcHRpb25zKHRoaXMub3B0aW9ucywgbWl4aW4pO1xuICAgIHJldHVybiB0aGlzXG4gIH07XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBpbml0RXh0ZW5kIChWdWUpIHtcbiAgLyoqXG4gICAqIEVhY2ggaW5zdGFuY2UgY29uc3RydWN0b3IsIGluY2x1ZGluZyBWdWUsIGhhcyBhIHVuaXF1ZVxuICAgKiBjaWQuIFRoaXMgZW5hYmxlcyB1cyB0byBjcmVhdGUgd3JhcHBlZCBcImNoaWxkXG4gICAqIGNvbnN0cnVjdG9yc1wiIGZvciBwcm90b3R5cGFsIGluaGVyaXRhbmNlIGFuZCBjYWNoZSB0aGVtLlxuICAgKi9cbiAgVnVlLmNpZCA9IDA7XG4gIHZhciBjaWQgPSAxO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBpbmhlcml0YW5jZVxuICAgKi9cbiAgVnVlLmV4dGVuZCA9IGZ1bmN0aW9uIChleHRlbmRPcHRpb25zKSB7XG4gICAgZXh0ZW5kT3B0aW9ucyA9IGV4dGVuZE9wdGlvbnMgfHwge307XG4gICAgdmFyIFN1cGVyID0gdGhpcztcbiAgICB2YXIgU3VwZXJJZCA9IFN1cGVyLmNpZDtcbiAgICB2YXIgY2FjaGVkQ3RvcnMgPSBleHRlbmRPcHRpb25zLl9DdG9yIHx8IChleHRlbmRPcHRpb25zLl9DdG9yID0ge30pO1xuICAgIGlmIChjYWNoZWRDdG9yc1tTdXBlcklkXSkge1xuICAgICAgcmV0dXJuIGNhY2hlZEN0b3JzW1N1cGVySWRdXG4gICAgfVxuXG4gICAgdmFyIG5hbWUgPSBleHRlbmRPcHRpb25zLm5hbWUgfHwgU3VwZXIub3B0aW9ucy5uYW1lO1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIG5hbWUpIHtcbiAgICAgIHZhbGlkYXRlQ29tcG9uZW50TmFtZShuYW1lKTtcbiAgICB9XG5cbiAgICB2YXIgU3ViID0gZnVuY3Rpb24gVnVlQ29tcG9uZW50IChvcHRpb25zKSB7XG4gICAgICB0aGlzLl9pbml0KG9wdGlvbnMpO1xuICAgIH07XG4gICAgU3ViLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3VwZXIucHJvdG90eXBlKTtcbiAgICBTdWIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3ViO1xuICAgIFN1Yi5jaWQgPSBjaWQrKztcbiAgICBTdWIub3B0aW9ucyA9IG1lcmdlT3B0aW9ucyhcbiAgICAgIFN1cGVyLm9wdGlvbnMsXG4gICAgICBleHRlbmRPcHRpb25zXG4gICAgKTtcbiAgICBTdWJbJ3N1cGVyJ10gPSBTdXBlcjtcblxuICAgIC8vIEZvciBwcm9wcyBhbmQgY29tcHV0ZWQgcHJvcGVydGllcywgd2UgZGVmaW5lIHRoZSBwcm94eSBnZXR0ZXJzIG9uXG4gICAgLy8gdGhlIFZ1ZSBpbnN0YW5jZXMgYXQgZXh0ZW5zaW9uIHRpbWUsIG9uIHRoZSBleHRlbmRlZCBwcm90b3R5cGUuIFRoaXNcbiAgICAvLyBhdm9pZHMgT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxzIGZvciBlYWNoIGluc3RhbmNlIGNyZWF0ZWQuXG4gICAgaWYgKFN1Yi5vcHRpb25zLnByb3BzKSB7XG4gICAgICBpbml0UHJvcHMkMShTdWIpO1xuICAgIH1cbiAgICBpZiAoU3ViLm9wdGlvbnMuY29tcHV0ZWQpIHtcbiAgICAgIGluaXRDb21wdXRlZCQxKFN1Yik7XG4gICAgfVxuXG4gICAgLy8gYWxsb3cgZnVydGhlciBleHRlbnNpb24vbWl4aW4vcGx1Z2luIHVzYWdlXG4gICAgU3ViLmV4dGVuZCA9IFN1cGVyLmV4dGVuZDtcbiAgICBTdWIubWl4aW4gPSBTdXBlci5taXhpbjtcbiAgICBTdWIudXNlID0gU3VwZXIudXNlO1xuXG4gICAgLy8gY3JlYXRlIGFzc2V0IHJlZ2lzdGVycywgc28gZXh0ZW5kZWQgY2xhc3Nlc1xuICAgIC8vIGNhbiBoYXZlIHRoZWlyIHByaXZhdGUgYXNzZXRzIHRvby5cbiAgICBBU1NFVF9UWVBFUy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICBTdWJbdHlwZV0gPSBTdXBlclt0eXBlXTtcbiAgICB9KTtcbiAgICAvLyBlbmFibGUgcmVjdXJzaXZlIHNlbGYtbG9va3VwXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIFN1Yi5vcHRpb25zLmNvbXBvbmVudHNbbmFtZV0gPSBTdWI7XG4gICAgfVxuXG4gICAgLy8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgc3VwZXIgb3B0aW9ucyBhdCBleHRlbnNpb24gdGltZS5cbiAgICAvLyBsYXRlciBhdCBpbnN0YW50aWF0aW9uIHdlIGNhbiBjaGVjayBpZiBTdXBlcidzIG9wdGlvbnMgaGF2ZVxuICAgIC8vIGJlZW4gdXBkYXRlZC5cbiAgICBTdWIuc3VwZXJPcHRpb25zID0gU3VwZXIub3B0aW9ucztcbiAgICBTdWIuZXh0ZW5kT3B0aW9ucyA9IGV4dGVuZE9wdGlvbnM7XG4gICAgU3ViLnNlYWxlZE9wdGlvbnMgPSBleHRlbmQoe30sIFN1Yi5vcHRpb25zKTtcblxuICAgIC8vIGNhY2hlIGNvbnN0cnVjdG9yXG4gICAgY2FjaGVkQ3RvcnNbU3VwZXJJZF0gPSBTdWI7XG4gICAgcmV0dXJuIFN1YlxuICB9O1xufVxuXG5mdW5jdGlvbiBpbml0UHJvcHMkMSAoQ29tcCkge1xuICB2YXIgcHJvcHMgPSBDb21wLm9wdGlvbnMucHJvcHM7XG4gIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgIHByb3h5KENvbXAucHJvdG90eXBlLCBcIl9wcm9wc1wiLCBrZXkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRDb21wdXRlZCQxIChDb21wKSB7XG4gIHZhciBjb21wdXRlZCA9IENvbXAub3B0aW9ucy5jb21wdXRlZDtcbiAgZm9yICh2YXIga2V5IGluIGNvbXB1dGVkKSB7XG4gICAgZGVmaW5lQ29tcHV0ZWQoQ29tcC5wcm90b3R5cGUsIGtleSwgY29tcHV0ZWRba2V5XSk7XG4gIH1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGluaXRBc3NldFJlZ2lzdGVycyAoVnVlKSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYXNzZXQgcmVnaXN0cmF0aW9uIG1ldGhvZHMuXG4gICAqL1xuICBBU1NFVF9UWVBFUy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgVnVlW3R5cGVdID0gZnVuY3Rpb24gKFxuICAgICAgaWQsXG4gICAgICBkZWZpbml0aW9uXG4gICAgKSB7XG4gICAgICBpZiAoIWRlZmluaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc1t0eXBlICsgJ3MnXVtpZF1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0eXBlID09PSAnY29tcG9uZW50Jykge1xuICAgICAgICAgIHZhbGlkYXRlQ29tcG9uZW50TmFtZShpZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT09ICdjb21wb25lbnQnICYmIGlzUGxhaW5PYmplY3QoZGVmaW5pdGlvbikpIHtcbiAgICAgICAgICBkZWZpbml0aW9uLm5hbWUgPSBkZWZpbml0aW9uLm5hbWUgfHwgaWQ7XG4gICAgICAgICAgZGVmaW5pdGlvbiA9IHRoaXMub3B0aW9ucy5fYmFzZS5leHRlbmQoZGVmaW5pdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT09ICdkaXJlY3RpdmUnICYmIHR5cGVvZiBkZWZpbml0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZGVmaW5pdGlvbiA9IHsgYmluZDogZGVmaW5pdGlvbiwgdXBkYXRlOiBkZWZpbml0aW9uIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXSA9IGRlZmluaXRpb247XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5cbi8qICAqL1xuXG5cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZSAob3B0cykge1xuICByZXR1cm4gb3B0cyAmJiAob3B0cy5DdG9yLm9wdGlvbnMubmFtZSB8fCBvcHRzLnRhZylcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyAocGF0dGVybiwgbmFtZSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuKSkge1xuICAgIHJldHVybiBwYXR0ZXJuLmluZGV4T2YobmFtZSkgPiAtMVxuICB9IGVsc2UgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBwYXR0ZXJuLnNwbGl0KCcsJykuaW5kZXhPZihuYW1lKSA+IC0xXG4gIH0gZWxzZSBpZiAoaXNSZWdFeHAocGF0dGVybikpIHtcbiAgICByZXR1cm4gcGF0dGVybi50ZXN0KG5hbWUpXG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIHBydW5lQ2FjaGUgKGtlZXBBbGl2ZUluc3RhbmNlLCBmaWx0ZXIpIHtcbiAgdmFyIGNhY2hlID0ga2VlcEFsaXZlSW5zdGFuY2UuY2FjaGU7XG4gIHZhciBrZXlzID0ga2VlcEFsaXZlSW5zdGFuY2Uua2V5cztcbiAgdmFyIF92bm9kZSA9IGtlZXBBbGl2ZUluc3RhbmNlLl92bm9kZTtcbiAgZm9yICh2YXIga2V5IGluIGNhY2hlKSB7XG4gICAgdmFyIGNhY2hlZE5vZGUgPSBjYWNoZVtrZXldO1xuICAgIGlmIChjYWNoZWROb2RlKSB7XG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoY2FjaGVkTm9kZS5jb21wb25lbnRPcHRpb25zKTtcbiAgICAgIGlmIChuYW1lICYmICFmaWx0ZXIobmFtZSkpIHtcbiAgICAgICAgcHJ1bmVDYWNoZUVudHJ5KGNhY2hlLCBrZXksIGtleXMsIF92bm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHBydW5lQ2FjaGVFbnRyeSAoXG4gIGNhY2hlLFxuICBrZXksXG4gIGtleXMsXG4gIGN1cnJlbnRcbikge1xuICB2YXIgY2FjaGVkJCQxID0gY2FjaGVba2V5XTtcbiAgaWYgKGNhY2hlZCQkMSAmJiAoIWN1cnJlbnQgfHwgY2FjaGVkJCQxLnRhZyAhPT0gY3VycmVudC50YWcpKSB7XG4gICAgY2FjaGVkJCQxLmNvbXBvbmVudEluc3RhbmNlLiRkZXN0cm95KCk7XG4gIH1cbiAgY2FjaGVba2V5XSA9IG51bGw7XG4gIHJlbW92ZShrZXlzLCBrZXkpO1xufVxuXG52YXIgcGF0dGVyblR5cGVzID0gW1N0cmluZywgUmVnRXhwLCBBcnJheV07XG5cbnZhciBLZWVwQWxpdmUgPSB7XG4gIG5hbWU6ICdrZWVwLWFsaXZlJyxcbiAgYWJzdHJhY3Q6IHRydWUsXG5cbiAgcHJvcHM6IHtcbiAgICBpbmNsdWRlOiBwYXR0ZXJuVHlwZXMsXG4gICAgZXhjbHVkZTogcGF0dGVyblR5cGVzLFxuICAgIG1heDogW1N0cmluZywgTnVtYmVyXVxuICB9LFxuXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uIGNyZWF0ZWQgKCkge1xuICAgIHRoaXMuY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMua2V5cyA9IFtdO1xuICB9LFxuXG4gIGRlc3Ryb3llZDogZnVuY3Rpb24gZGVzdHJveWVkICgpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5jYWNoZSkge1xuICAgICAgcHJ1bmVDYWNoZUVudHJ5KHRoaXMuY2FjaGUsIGtleSwgdGhpcy5rZXlzKTtcbiAgICB9XG4gIH0sXG5cbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCAoKSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgICB0aGlzLiR3YXRjaCgnaW5jbHVkZScsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHBydW5lQ2FjaGUodGhpcyQxLCBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gbWF0Y2hlcyh2YWwsIG5hbWUpOyB9KTtcbiAgICB9KTtcbiAgICB0aGlzLiR3YXRjaCgnZXhjbHVkZScsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHBydW5lQ2FjaGUodGhpcyQxLCBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gIW1hdGNoZXModmFsLCBuYW1lKTsgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIgKCkge1xuICAgIHZhciBzbG90ID0gdGhpcy4kc2xvdHMuZGVmYXVsdDtcbiAgICB2YXIgdm5vZGUgPSBnZXRGaXJzdENvbXBvbmVudENoaWxkKHNsb3QpO1xuICAgIHZhciBjb21wb25lbnRPcHRpb25zID0gdm5vZGUgJiYgdm5vZGUuY29tcG9uZW50T3B0aW9ucztcbiAgICBpZiAoY29tcG9uZW50T3B0aW9ucykge1xuICAgICAgLy8gY2hlY2sgcGF0dGVyblxuICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKGNvbXBvbmVudE9wdGlvbnMpO1xuICAgICAgdmFyIHJlZiA9IHRoaXM7XG4gICAgICB2YXIgaW5jbHVkZSA9IHJlZi5pbmNsdWRlO1xuICAgICAgdmFyIGV4Y2x1ZGUgPSByZWYuZXhjbHVkZTtcbiAgICAgIGlmIChcbiAgICAgICAgLy8gbm90IGluY2x1ZGVkXG4gICAgICAgIChpbmNsdWRlICYmICghbmFtZSB8fCAhbWF0Y2hlcyhpbmNsdWRlLCBuYW1lKSkpIHx8XG4gICAgICAgIC8vIGV4Y2x1ZGVkXG4gICAgICAgIChleGNsdWRlICYmIG5hbWUgJiYgbWF0Y2hlcyhleGNsdWRlLCBuYW1lKSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gdm5vZGVcbiAgICAgIH1cblxuICAgICAgdmFyIHJlZiQxID0gdGhpcztcbiAgICAgIHZhciBjYWNoZSA9IHJlZiQxLmNhY2hlO1xuICAgICAgdmFyIGtleXMgPSByZWYkMS5rZXlzO1xuICAgICAgdmFyIGtleSA9IHZub2RlLmtleSA9PSBudWxsXG4gICAgICAgIC8vIHNhbWUgY29uc3RydWN0b3IgbWF5IGdldCByZWdpc3RlcmVkIGFzIGRpZmZlcmVudCBsb2NhbCBjb21wb25lbnRzXG4gICAgICAgIC8vIHNvIGNpZCBhbG9uZSBpcyBub3QgZW5vdWdoICgjMzI2OSlcbiAgICAgICAgPyBjb21wb25lbnRPcHRpb25zLkN0b3IuY2lkICsgKGNvbXBvbmVudE9wdGlvbnMudGFnID8gKFwiOjpcIiArIChjb21wb25lbnRPcHRpb25zLnRhZykpIDogJycpXG4gICAgICAgIDogdm5vZGUua2V5O1xuICAgICAgaWYgKGNhY2hlW2tleV0pIHtcbiAgICAgICAgdm5vZGUuY29tcG9uZW50SW5zdGFuY2UgPSBjYWNoZVtrZXldLmNvbXBvbmVudEluc3RhbmNlO1xuICAgICAgICAvLyBtYWtlIGN1cnJlbnQga2V5IGZyZXNoZXN0XG4gICAgICAgIHJlbW92ZShrZXlzLCBrZXkpO1xuICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhY2hlW2tleV0gPSB2bm9kZTtcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICAgIC8vIHBydW5lIG9sZGVzdCBlbnRyeVxuICAgICAgICBpZiAodGhpcy5tYXggJiYga2V5cy5sZW5ndGggPiBwYXJzZUludCh0aGlzLm1heCkpIHtcbiAgICAgICAgICBwcnVuZUNhY2hlRW50cnkoY2FjaGUsIGtleXNbMF0sIGtleXMsIHRoaXMuX3Zub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2bm9kZS5kYXRhLmtlZXBBbGl2ZSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB2bm9kZSB8fCAoc2xvdCAmJiBzbG90WzBdKVxuICB9XG59O1xuXG52YXIgYnVpbHRJbkNvbXBvbmVudHMgPSB7XG4gIEtlZXBBbGl2ZTogS2VlcEFsaXZlXG59O1xuXG4vKiAgKi9cblxuZnVuY3Rpb24gaW5pdEdsb2JhbEFQSSAoVnVlKSB7XG4gIC8vIGNvbmZpZ1xuICB2YXIgY29uZmlnRGVmID0ge307XG4gIGNvbmZpZ0RlZi5nZXQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBjb25maWc7IH07XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgY29uZmlnRGVmLnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgICdEbyBub3QgcmVwbGFjZSB0aGUgVnVlLmNvbmZpZyBvYmplY3QsIHNldCBpbmRpdmlkdWFsIGZpZWxkcyBpbnN0ZWFkLidcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlLCAnY29uZmlnJywgY29uZmlnRGVmKTtcblxuICAvLyBleHBvc2VkIHV0aWwgbWV0aG9kcy5cbiAgLy8gTk9URTogdGhlc2UgYXJlIG5vdCBjb25zaWRlcmVkIHBhcnQgb2YgdGhlIHB1YmxpYyBBUEkgLSBhdm9pZCByZWx5aW5nIG9uXG4gIC8vIHRoZW0gdW5sZXNzIHlvdSBhcmUgYXdhcmUgb2YgdGhlIHJpc2suXG4gIFZ1ZS51dGlsID0ge1xuICAgIHdhcm46IHdhcm4sXG4gICAgZXh0ZW5kOiBleHRlbmQsXG4gICAgbWVyZ2VPcHRpb25zOiBtZXJnZU9wdGlvbnMsXG4gICAgZGVmaW5lUmVhY3RpdmU6IGRlZmluZVJlYWN0aXZlJCQxXG4gIH07XG5cbiAgVnVlLnNldCA9IHNldDtcbiAgVnVlLmRlbGV0ZSA9IGRlbDtcbiAgVnVlLm5leHRUaWNrID0gbmV4dFRpY2s7XG5cbiAgLy8gMi42IGV4cGxpY2l0IG9ic2VydmFibGUgQVBJXG4gIFZ1ZS5vYnNlcnZhYmxlID0gZnVuY3Rpb24gKG9iaikge1xuICAgIG9ic2VydmUob2JqKTtcbiAgICByZXR1cm4gb2JqXG4gIH07XG5cbiAgVnVlLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBBU1NFVF9UWVBFUy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgVnVlLm9wdGlvbnNbdHlwZSArICdzJ10gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9KTtcblxuICAvLyB0aGlzIGlzIHVzZWQgdG8gaWRlbnRpZnkgdGhlIFwiYmFzZVwiIGNvbnN0cnVjdG9yIHRvIGV4dGVuZCBhbGwgcGxhaW4tb2JqZWN0XG4gIC8vIGNvbXBvbmVudHMgd2l0aCBpbiBXZWV4J3MgbXVsdGktaW5zdGFuY2Ugc2NlbmFyaW9zLlxuICBWdWUub3B0aW9ucy5fYmFzZSA9IFZ1ZTtcblxuICBleHRlbmQoVnVlLm9wdGlvbnMuY29tcG9uZW50cywgYnVpbHRJbkNvbXBvbmVudHMpO1xuXG4gIGluaXRVc2UoVnVlKTtcbiAgaW5pdE1peGluJDEoVnVlKTtcbiAgaW5pdEV4dGVuZChWdWUpO1xuICBpbml0QXNzZXRSZWdpc3RlcnMoVnVlKTtcbn1cblxuaW5pdEdsb2JhbEFQSShWdWUpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlLnByb3RvdHlwZSwgJyRpc1NlcnZlcicsIHtcbiAgZ2V0OiBpc1NlcnZlclJlbmRlcmluZ1xufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShWdWUucHJvdG90eXBlLCAnJHNzckNvbnRleHQnLCB7XG4gIGdldDogZnVuY3Rpb24gZ2V0ICgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIHJldHVybiB0aGlzLiR2bm9kZSAmJiB0aGlzLiR2bm9kZS5zc3JDb250ZXh0XG4gIH1cbn0pO1xuXG4vLyBleHBvc2UgRnVuY3Rpb25hbFJlbmRlckNvbnRleHQgZm9yIHNzciBydW50aW1lIGhlbHBlciBpbnN0YWxsYXRpb25cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShWdWUsICdGdW5jdGlvbmFsUmVuZGVyQ29udGV4dCcsIHtcbiAgdmFsdWU6IEZ1bmN0aW9uYWxSZW5kZXJDb250ZXh0XG59KTtcblxuVnVlLnZlcnNpb24gPSAnMi42LjEwJztcblxuLyoqXG4gKiBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vVGVuY2VudC93ZXN0b3JlL21hc3Rlci9wYWNrYWdlcy93ZXN0b3JlL3V0aWxzL2RpZmYuanNcbiAqL1xudmFyIEFSUkFZVFlQRSA9ICdbb2JqZWN0IEFycmF5XSc7XG52YXIgT0JKRUNUVFlQRSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuLy8gY29uc3QgRlVOQ1RJT05UWVBFID0gJ1tvYmplY3QgRnVuY3Rpb25dJ1xuXG5mdW5jdGlvbiBkaWZmKGN1cnJlbnQsIHByZSkge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBzeW5jS2V5cyhjdXJyZW50LCBwcmUpO1xuICAgIF9kaWZmKGN1cnJlbnQsIHByZSwgJycsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiBzeW5jS2V5cyhjdXJyZW50LCBwcmUpIHtcbiAgICBpZiAoY3VycmVudCA9PT0gcHJlKSB7IHJldHVybiB9XG4gICAgdmFyIHJvb3RDdXJyZW50VHlwZSA9IHR5cGUoY3VycmVudCk7XG4gICAgdmFyIHJvb3RQcmVUeXBlID0gdHlwZShwcmUpO1xuICAgIGlmIChyb290Q3VycmVudFR5cGUgPT0gT0JKRUNUVFlQRSAmJiByb290UHJlVHlwZSA9PSBPQkpFQ1RUWVBFKSB7XG4gICAgICAgIGlmKE9iamVjdC5rZXlzKGN1cnJlbnQpLmxlbmd0aCA+PSBPYmplY3Qua2V5cyhwcmUpLmxlbmd0aCl7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFtrZXldID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzeW5jS2V5cyhjdXJyZW50VmFsdWUsIHByZVtrZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJvb3RDdXJyZW50VHlwZSA9PSBBUlJBWVRZUEUgJiYgcm9vdFByZVR5cGUgPT0gQVJSQVlUWVBFKSB7XG4gICAgICAgIGlmIChjdXJyZW50Lmxlbmd0aCA+PSBwcmUubGVuZ3RoKSB7XG4gICAgICAgICAgICBwcmUuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBzeW5jS2V5cyhjdXJyZW50W2luZGV4XSwgaXRlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gX2RpZmYoY3VycmVudCwgcHJlLCBwYXRoLCByZXN1bHQpIHtcbiAgICBpZiAoY3VycmVudCA9PT0gcHJlKSB7IHJldHVybiB9XG4gICAgdmFyIHJvb3RDdXJyZW50VHlwZSA9IHR5cGUoY3VycmVudCk7XG4gICAgdmFyIHJvb3RQcmVUeXBlID0gdHlwZShwcmUpO1xuICAgIGlmIChyb290Q3VycmVudFR5cGUgPT0gT0JKRUNUVFlQRSkge1xuICAgICAgICBpZiAocm9vdFByZVR5cGUgIT0gT0JKRUNUVFlQRSB8fCBPYmplY3Qua2V5cyhjdXJyZW50KS5sZW5ndGggPCBPYmplY3Qua2V5cyhwcmUpLmxlbmd0aCkge1xuICAgICAgICAgICAgc2V0UmVzdWx0KHJlc3VsdCwgcGF0aCwgY3VycmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbG9vcCA9IGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VmFsdWUgPSBjdXJyZW50W2tleV07XG4gICAgICAgICAgICAgICAgdmFyIHByZVZhbHVlID0gcHJlW2tleV07XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUeXBlID0gdHlwZShjdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciBwcmVUeXBlID0gdHlwZShwcmVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUeXBlICE9IEFSUkFZVFlQRSAmJiBjdXJyZW50VHlwZSAhPSBPQkpFQ1RUWVBFKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VmFsdWUgIT0gcHJlW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFJlc3VsdChyZXN1bHQsIChwYXRoID09ICcnID8gJycgOiBwYXRoICsgXCIuXCIpICsga2V5LCBjdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50VHlwZSA9PSBBUlJBWVRZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZVR5cGUgIT0gQVJSQVlUWVBFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRSZXN1bHQocmVzdWx0LCAocGF0aCA9PSAnJyA/ICcnIDogcGF0aCArIFwiLlwiKSArIGtleSwgY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VmFsdWUubGVuZ3RoIDwgcHJlVmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UmVzdWx0KHJlc3VsdCwgKHBhdGggPT0gJycgPyAnJyA6IHBhdGggKyBcIi5cIikgKyBrZXksIGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZGlmZihpdGVtLCBwcmVWYWx1ZVtpbmRleF0sIChwYXRoID09ICcnID8gJycgOiBwYXRoICsgXCIuXCIpICsga2V5ICsgJ1snICsgaW5kZXggKyAnXScsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRUeXBlID09IE9CSkVDVFRZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZVR5cGUgIT0gT0JKRUNUVFlQRSB8fCBPYmplY3Qua2V5cyhjdXJyZW50VmFsdWUpLmxlbmd0aCA8IE9iamVjdC5rZXlzKHByZVZhbHVlKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFJlc3VsdChyZXN1bHQsIChwYXRoID09ICcnID8gJycgOiBwYXRoICsgXCIuXCIpICsga2V5LCBjdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc3ViS2V5IGluIGN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kaWZmKGN1cnJlbnRWYWx1ZVtzdWJLZXldLCBwcmVWYWx1ZVtzdWJLZXldLCAocGF0aCA9PSAnJyA/ICcnIDogcGF0aCArIFwiLlwiKSArIGtleSArICcuJyArIHN1YktleSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBjdXJyZW50KSBsb29wKCBrZXkgKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAocm9vdEN1cnJlbnRUeXBlID09IEFSUkFZVFlQRSkge1xuICAgICAgICBpZiAocm9vdFByZVR5cGUgIT0gQVJSQVlUWVBFKSB7XG4gICAgICAgICAgICBzZXRSZXN1bHQocmVzdWx0LCBwYXRoLCBjdXJyZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50Lmxlbmd0aCA8IHByZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzZXRSZXN1bHQocmVzdWx0LCBwYXRoLCBjdXJyZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3VycmVudC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBfZGlmZihpdGVtLCBwcmVbaW5kZXhdLCBwYXRoICsgJ1snICsgaW5kZXggKyAnXScsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBzZXRSZXN1bHQocmVzdWx0LCBwYXRoLCBjdXJyZW50KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldFJlc3VsdChyZXN1bHQsIGssIHYpIHtcbiAgICAvLyBpZiAodHlwZSh2KSAhPSBGVU5DVElPTlRZUEUpIHtcbiAgICAgICAgcmVzdWx0W2tdID0gdjtcbiAgICAvLyB9XG59XG5cbmZ1bmN0aW9uIHR5cGUob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopXG59XG5cbi8qICAqL1xyXG5cclxuZnVuY3Rpb24gZmx1c2hDYWxsYmFja3MkMSh2bSkge1xyXG4gICAgaWYgKHZtLl9fbmV4dF90aWNrX2NhbGxiYWNrcyAmJiB2bS5fX25leHRfdGlja19jYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52LlZVRV9BUFBfREVCVUcpIHtcclxuICAgICAgICAgICAgdmFyIG1wSW5zdGFuY2UgPSB2bS4kc2NvcGU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbJyArICgrbmV3IERhdGUpICsgJ11bJyArIChtcEluc3RhbmNlLmlzIHx8IG1wSW5zdGFuY2Uucm91dGUpICsgJ11bJyArIHZtLl91aWQgK1xyXG4gICAgICAgICAgICAgICAgJ106Zmx1c2hDYWxsYmFja3NbJyArIHZtLl9fbmV4dF90aWNrX2NhbGxiYWNrcy5sZW5ndGggKyAnXScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29waWVzID0gdm0uX19uZXh0X3RpY2tfY2FsbGJhY2tzLnNsaWNlKDApO1xyXG4gICAgICAgIHZtLl9fbmV4dF90aWNrX2NhbGxiYWNrcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29waWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvcGllc1tpXSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFzUmVuZGVyV2F0Y2hlcih2bSkge1xyXG4gICAgcmV0dXJuIHF1ZXVlLmZpbmQoZnVuY3Rpb24gKHdhdGNoZXIpIHsgcmV0dXJuIHZtLl93YXRjaGVyID09PSB3YXRjaGVyOyB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBuZXh0VGljayQxKHZtLCBjYikge1xyXG4gICAgLy8xLm5leHRUaWNrIOS5i+WJjSDlt7Igc2V0RGF0YSDkuJQgc2V0RGF0YSDov5jmnKrlm57osIPlrozmiJBcclxuICAgIC8vMi5uZXh0VGljayDkuYvliY3lrZjlnKggcmVuZGVyIHdhdGNoZXJcclxuICAgIGlmICghdm0uX19uZXh0X3RpY2tfcGVuZGluZyAmJiAhaGFzUmVuZGVyV2F0Y2hlcih2bSkpIHtcbiAgICAgICAgaWYocHJvY2Vzcy5lbnYuVlVFX0FQUF9ERUJVRyl7XG4gICAgICAgICAgICB2YXIgbXBJbnN0YW5jZSA9IHZtLiRzY29wZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbJyArICgrbmV3IERhdGUpICsgJ11bJyArIChtcEluc3RhbmNlLmlzIHx8IG1wSW5zdGFuY2Uucm91dGUpICsgJ11bJyArIHZtLl91aWQgK1xuICAgICAgICAgICAgICAgICddOm5leHRWdWVUaWNrJyk7XG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV4dFRpY2soY2IsIHZtKVxyXG4gICAgfWVsc2V7XG4gICAgICAgIGlmKHByb2Nlc3MuZW52LlZVRV9BUFBfREVCVUcpe1xuICAgICAgICAgICAgdmFyIG1wSW5zdGFuY2UkMSA9IHZtLiRzY29wZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbJyArICgrbmV3IERhdGUpICsgJ11bJyArIChtcEluc3RhbmNlJDEuaXMgfHwgbXBJbnN0YW5jZSQxLnJvdXRlKSArICddWycgKyB2bS5fdWlkICtcbiAgICAgICAgICAgICAgICAnXTpuZXh0TVBUaWNrJyk7XG4gICAgICAgIH1cbiAgICB9XHJcbiAgICB2YXIgX3Jlc29sdmU7XHJcbiAgICBpZiAoIXZtLl9fbmV4dF90aWNrX2NhbGxiYWNrcykge1xyXG4gICAgICAgIHZtLl9fbmV4dF90aWNrX2NhbGxiYWNrcyA9IFtdO1xyXG4gICAgfVxyXG4gICAgdm0uX19uZXh0X3RpY2tfY2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChjYikge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY2IuY2FsbCh2bSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUVycm9yKGUsIHZtLCAnbmV4dFRpY2snKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoX3Jlc29sdmUpIHtcclxuICAgICAgICAgICAgX3Jlc29sdmUodm0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gJGZsb3ctZGlzYWJsZS1saW5lXHJcbiAgICBpZiAoIWNiICYmIHR5cGVvZiBQcm9taXNlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICBfcmVzb2x2ZSA9IHJlc29sdmU7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxuXG4vKiAgKi9cclxuXHJcbmZ1bmN0aW9uIGNsb25lV2l0aERhdGEodm0pIHtcclxuICAvLyDnoa7kv53lvZPliY0gdm0g5omA5pyJ5pWw5o2u6KKr5ZCM5q2lXHJcbiAgdmFyIHJldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgdmFyIGRhdGFLZXlzID0gW10uY29uY2F0KFxyXG4gICAgT2JqZWN0LmtleXModm0uX2RhdGEgfHwge30pLFxyXG4gICAgT2JqZWN0LmtleXModm0uX2NvbXB1dGVkV2F0Y2hlcnMgfHwge30pKTtcclxuXHJcbiAgZGF0YUtleXMucmVkdWNlKGZ1bmN0aW9uKHJldCwga2V5KSB7XHJcbiAgICByZXRba2V5XSA9IHZtW2tleV07XHJcbiAgICByZXR1cm4gcmV0XHJcbiAgfSwgcmV0KTtcclxuICAvL1RPRE8g6ZyA6KaB5oqK5peg55So5pWw5o2u5aSE55CG5o6J77yM5q+U5aaCIGxpc3Q9PmwwIOWImSBsaXN0IOmcgOimgeenu+mZpO+8jOWQpuWImeWkmuS8oOi+k+S4gOS7veaVsOaNrlxyXG4gIE9iamVjdC5hc3NpZ24ocmV0LCB2bS4kbXAuZGF0YSB8fCB7fSk7XHJcbiAgaWYgKFxyXG4gICAgQXJyYXkuaXNBcnJheSh2bS4kb3B0aW9ucy5iZWhhdmlvcnMpICYmXHJcbiAgICB2bS4kb3B0aW9ucy5iZWhhdmlvcnMuaW5kZXhPZigndW5pOi8vZm9ybS1maWVsZCcpICE9PSAtMVxyXG4gICkgeyAvL2Zvcm0tZmllbGRcclxuICAgIHJldFsnbmFtZSddID0gdm0ubmFtZTtcclxuICAgIHJldFsndmFsdWUnXSA9IHZtLnZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmV0KSlcclxufVxyXG5cclxudmFyIHBhdGNoID0gZnVuY3Rpb24ob2xkVm5vZGUsIHZub2RlKSB7XG4gIHZhciB0aGlzJDEgPSB0aGlzO1xuXHJcbiAgaWYgKHZub2RlID09PSBudWxsKSB7IC8vZGVzdHJveVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIGlmICh0aGlzLm1wVHlwZSA9PT0gJ3BhZ2UnIHx8IHRoaXMubXBUeXBlID09PSAnY29tcG9uZW50Jykge1xyXG4gICAgdmFyIG1wSW5zdGFuY2UgPSB0aGlzLiRzY29wZTtcclxuICAgIHZhciBkYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGRhdGEgPSBjbG9uZVdpdGhEYXRhKHRoaXMpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgIH1cclxuICAgIGRhdGEuX193ZWJ2aWV3SWRfXyA9IG1wSW5zdGFuY2UuZGF0YS5fX3dlYnZpZXdJZF9fO1xyXG4gICAgdmFyIG1wRGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgLy/ku4XlkIzmraUgZGF0YSDkuK3mnInnmoTmlbDmja5cclxuICAgICAgbXBEYXRhW2tleV0gPSBtcEluc3RhbmNlLmRhdGFba2V5XTtcclxuICAgIH0pO1xyXG4gICAgdmFyIGRpZmZEYXRhID0gZGlmZihkYXRhLCBtcERhdGEpO1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKGRpZmZEYXRhKS5sZW5ndGgpIHtcclxuICAgICAgaWYgKHByb2Nlc3MuZW52LlZVRV9BUFBfREVCVUcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnWycgKyAoK25ldyBEYXRlKSArICddWycgKyAobXBJbnN0YW5jZS5pcyB8fCBtcEluc3RhbmNlLnJvdXRlKSArICddWycgKyB0aGlzLl91aWQgK1xyXG4gICAgICAgICAgJ13lt67ph4/mm7TmlrAnLFxyXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGlmZkRhdGEpKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9fbmV4dF90aWNrX3BlbmRpbmcgPSB0cnVlO1xyXG4gICAgICBtcEluc3RhbmNlLnNldERhdGEoZGlmZkRhdGEsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzJDEuX19uZXh0X3RpY2tfcGVuZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIGZsdXNoQ2FsbGJhY2tzJDEodGhpcyQxKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmbHVzaENhbGxiYWNrcyQxKHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcblxuLyogICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUVtcHR5UmVuZGVyKCkge1xuXG59XG5cbmZ1bmN0aW9uIG1vdW50Q29tcG9uZW50JDEoXG4gIHZtLFxuICBlbCxcbiAgaHlkcmF0aW5nXG4pIHtcbiAgaWYgKCF2bS5tcFR5cGUpIHsvL21haW4uanMg5Lit55qEIG5ldyBWdWVcbiAgICByZXR1cm4gdm1cbiAgfVxuICBpZiAodm0ubXBUeXBlID09PSAnYXBwJykge1xuICAgIHZtLiRvcHRpb25zLnJlbmRlciA9IGNyZWF0ZUVtcHR5UmVuZGVyO1xuICB9XG4gIGlmICghdm0uJG9wdGlvbnMucmVuZGVyKSB7XG4gICAgdm0uJG9wdGlvbnMucmVuZGVyID0gY3JlYXRlRW1wdHlSZW5kZXI7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCh2bS4kb3B0aW9ucy50ZW1wbGF0ZSAmJiB2bS4kb3B0aW9ucy50ZW1wbGF0ZS5jaGFyQXQoMCkgIT09ICcjJykgfHxcbiAgICAgICAgdm0uJG9wdGlvbnMuZWwgfHwgZWwpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICAnWW91IGFyZSB1c2luZyB0aGUgcnVudGltZS1vbmx5IGJ1aWxkIG9mIFZ1ZSB3aGVyZSB0aGUgdGVtcGxhdGUgJyArXG4gICAgICAgICAgJ2NvbXBpbGVyIGlzIG5vdCBhdmFpbGFibGUuIEVpdGhlciBwcmUtY29tcGlsZSB0aGUgdGVtcGxhdGVzIGludG8gJyArXG4gICAgICAgICAgJ3JlbmRlciBmdW5jdGlvbnMsIG9yIHVzZSB0aGUgY29tcGlsZXItaW5jbHVkZWQgYnVpbGQuJyxcbiAgICAgICAgICB2bVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICAnRmFpbGVkIHRvIG1vdW50IGNvbXBvbmVudDogdGVtcGxhdGUgb3IgcmVuZGVyIGZ1bmN0aW9uIG5vdCBkZWZpbmVkLicsXG4gICAgICAgICAgdm1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHZtLm1wSG9zdCAhPT0gJ21wLXRvdXRpYW8nICYmIGNhbGxIb29rKHZtLCAnYmVmb3JlTW91bnQnKTtcblxuICB2YXIgdXBkYXRlQ29tcG9uZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZtLl91cGRhdGUodm0uX3JlbmRlcigpLCBoeWRyYXRpbmcpO1xuICB9O1xuXG4gIC8vIHdlIHNldCB0aGlzIHRvIHZtLl93YXRjaGVyIGluc2lkZSB0aGUgd2F0Y2hlcidzIGNvbnN0cnVjdG9yXG4gIC8vIHNpbmNlIHRoZSB3YXRjaGVyJ3MgaW5pdGlhbCBwYXRjaCBtYXkgY2FsbCAkZm9yY2VVcGRhdGUgKGUuZy4gaW5zaWRlIGNoaWxkXG4gIC8vIGNvbXBvbmVudCdzIG1vdW50ZWQgaG9vayksIHdoaWNoIHJlbGllcyBvbiB2bS5fd2F0Y2hlciBiZWluZyBhbHJlYWR5IGRlZmluZWRcbiAgbmV3IFdhdGNoZXIodm0sIHVwZGF0ZUNvbXBvbmVudCwgbm9vcCwge1xuICAgIGJlZm9yZTogZnVuY3Rpb24gYmVmb3JlKCkge1xuICAgICAgaWYgKHZtLl9pc01vdW50ZWQgJiYgIXZtLl9pc0Rlc3Ryb3llZCkge1xuICAgICAgICBjYWxsSG9vayh2bSwgJ2JlZm9yZVVwZGF0ZScpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgdHJ1ZSAvKiBpc1JlbmRlcldhdGNoZXIgKi8pO1xuICBoeWRyYXRpbmcgPSBmYWxzZTtcbiAgcmV0dXJuIHZtXG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiByZW5kZXJDbGFzcyAoXG4gIHN0YXRpY0NsYXNzLFxuICBkeW5hbWljQ2xhc3Ncbikge1xuICBpZiAoaXNEZWYoc3RhdGljQ2xhc3MpIHx8IGlzRGVmKGR5bmFtaWNDbGFzcykpIHtcbiAgICByZXR1cm4gY29uY2F0KHN0YXRpY0NsYXNzLCBzdHJpbmdpZnlDbGFzcyhkeW5hbWljQ2xhc3MpKVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHJldHVybiAnJ1xufVxuXG5mdW5jdGlvbiBjb25jYXQgKGEsIGIpIHtcbiAgcmV0dXJuIGEgPyBiID8gKGEgKyAnICcgKyBiKSA6IGEgOiAoYiB8fCAnJylcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5Q2xhc3MgKHZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBzdHJpbmdpZnlBcnJheSh2YWx1ZSlcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeU9iamVjdCh2YWx1ZSlcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHJldHVybiAnJ1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlBcnJheSAodmFsdWUpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICB2YXIgc3RyaW5naWZpZWQ7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGlzRGVmKHN0cmluZ2lmaWVkID0gc3RyaW5naWZ5Q2xhc3ModmFsdWVbaV0pKSAmJiBzdHJpbmdpZmllZCAhPT0gJycpIHtcbiAgICAgIGlmIChyZXMpIHsgcmVzICs9ICcgJzsgfVxuICAgICAgcmVzICs9IHN0cmluZ2lmaWVkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeU9iamVjdCAodmFsdWUpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAodmFsdWVba2V5XSkge1xuICAgICAgaWYgKHJlcykgeyByZXMgKz0gJyAnOyB9XG4gICAgICByZXMgKz0ga2V5O1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qICAqL1xuXG52YXIgcGFyc2VTdHlsZVRleHQgPSBjYWNoZWQoZnVuY3Rpb24gKGNzc1RleHQpIHtcbiAgdmFyIHJlcyA9IHt9O1xuICB2YXIgbGlzdERlbGltaXRlciA9IC87KD8hW14oXSpcXCkpL2c7XG4gIHZhciBwcm9wZXJ0eURlbGltaXRlciA9IC86KC4rKS87XG4gIGNzc1RleHQuc3BsaXQobGlzdERlbGltaXRlcikuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmIChpdGVtKSB7XG4gICAgICB2YXIgdG1wID0gaXRlbS5zcGxpdChwcm9wZXJ0eURlbGltaXRlcik7XG4gICAgICB0bXAubGVuZ3RoID4gMSAmJiAocmVzW3RtcFswXS50cmltKCldID0gdG1wWzFdLnRyaW0oKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc1xufSk7XG5cbi8vIG5vcm1hbGl6ZSBwb3NzaWJsZSBhcnJheSAvIHN0cmluZyB2YWx1ZXMgaW50byBPYmplY3RcbmZ1bmN0aW9uIG5vcm1hbGl6ZVN0eWxlQmluZGluZyAoYmluZGluZ1N0eWxlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGJpbmRpbmdTdHlsZSkpIHtcbiAgICByZXR1cm4gdG9PYmplY3QoYmluZGluZ1N0eWxlKVxuICB9XG4gIGlmICh0eXBlb2YgYmluZGluZ1N0eWxlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBwYXJzZVN0eWxlVGV4dChiaW5kaW5nU3R5bGUpXG4gIH1cbiAgcmV0dXJuIGJpbmRpbmdTdHlsZVxufVxuXG4vKiAgKi9cclxuXHJcbnZhciBNUF9NRVRIT0RTID0gWydjcmVhdGVTZWxlY3RvclF1ZXJ5JywgJ2NyZWF0ZUludGVyc2VjdGlvbk9ic2VydmVyJywgJ3NlbGVjdEFsbENvbXBvbmVudHMnLCAnc2VsZWN0Q29tcG9uZW50J107XHJcblxyXG5mdW5jdGlvbiBnZXRUYXJnZXQob2JqLCBwYXRoKSB7XHJcbiAgdmFyIHBhcnRzID0gcGF0aC5zcGxpdCgnLicpO1xyXG4gIHZhciBrZXkgPSBwYXJ0c1swXTtcclxuICBpZiAoa2V5LmluZGV4T2YoJ19fJG4nKSA9PT0gMCkgeyAvL251bWJlciBpbmRleFxyXG4gICAga2V5ID0gcGFyc2VJbnQoa2V5LnJlcGxhY2UoJ19fJG4nLCAnJykpO1xyXG4gIH1cclxuICBpZiAocGFydHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICByZXR1cm4gb2JqW2tleV1cclxuICB9XHJcbiAgcmV0dXJuIGdldFRhcmdldChvYmpba2V5XSwgcGFydHMuc2xpY2UoMSkuam9pbignLicpKVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbnRlcm5hbE1peGluKFZ1ZSkge1xyXG5cclxuICBWdWUuY29uZmlnLmVycm9ySGFuZGxlciA9IGZ1bmN0aW9uKGVycikge1xyXG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gIH07XHJcblxyXG4gIHZhciBvbGRFbWl0ID0gVnVlLnByb3RvdHlwZS4kZW1pdDtcclxuXHJcbiAgVnVlLnByb3RvdHlwZS4kZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBpZiAodGhpcy4kc2NvcGUgJiYgZXZlbnQpIHtcclxuICAgICAgdGhpcy4kc2NvcGVbJ3RyaWdnZXJFdmVudCddKGV2ZW50LCB7XHJcbiAgICAgICAgX19hcmdzX186IHRvQXJyYXkoYXJndW1lbnRzLCAxKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBvbGRFbWl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcclxuICB9O1xyXG5cclxuICBWdWUucHJvdG90eXBlLiRuZXh0VGljayA9IGZ1bmN0aW9uKGZuKSB7XHJcbiAgICByZXR1cm4gbmV4dFRpY2skMSh0aGlzLCBmbilcclxuICB9O1xyXG5cclxuICBNUF9NRVRIT0RTLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xyXG4gICAgVnVlLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJncykge1xyXG4gICAgICBpZiAodGhpcy4kc2NvcGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kc2NvcGVbbWV0aG9kXShhcmdzKVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pO1xyXG5cclxuICBWdWUucHJvdG90eXBlLl9faW5pdF9wcm92aWRlID0gaW5pdFByb3ZpZGU7XHJcblxyXG4gIFZ1ZS5wcm90b3R5cGUuX19pbml0X2luamVjdGlvbnMgPSBpbml0SW5qZWN0aW9ucztcclxuXHJcbiAgVnVlLnByb3RvdHlwZS5fX2NhbGxfaG9vayA9IGZ1bmN0aW9uKGhvb2ssIGFyZ3MpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAvLyAjNzU3MyBkaXNhYmxlIGRlcCBjb2xsZWN0aW9uIHdoZW4gaW52b2tpbmcgbGlmZWN5Y2xlIGhvb2tzXHJcbiAgICBwdXNoVGFyZ2V0KCk7XHJcbiAgICB2YXIgaGFuZGxlcnMgPSB2bS4kb3B0aW9uc1tob29rXTtcclxuICAgIHZhciBpbmZvID0gaG9vayArIFwiIGhvb2tcIjtcclxuICAgIHZhciByZXQ7XHJcbiAgICBpZiAoaGFuZGxlcnMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBoYW5kbGVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcclxuICAgICAgICByZXQgPSBpbnZva2VXaXRoRXJyb3JIYW5kbGluZyhoYW5kbGVyc1tpXSwgdm0sIGFyZ3MgPyBbYXJnc10gOiBudWxsLCB2bSwgaW5mbyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh2bS5faGFzSG9va0V2ZW50KSB7XHJcbiAgICAgIHZtLiRlbWl0KCdob29rOicgKyBob29rKTtcclxuICAgIH1cclxuICAgIHBvcFRhcmdldCgpO1xyXG4gICAgcmV0dXJuIHJldFxyXG4gIH07XHJcblxyXG4gIFZ1ZS5wcm90b3R5cGUuX19zZXRfbW9kZWwgPSBmdW5jdGlvbih0YXJnZXQsIGtleSwgdmFsdWUsIG1vZGlmaWVycykge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobW9kaWZpZXJzKSkge1xyXG4gICAgICBpZiAobW9kaWZpZXJzLmluZGV4T2YoJ3RyaW0nKSAhPT0gLTEpIHtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobW9kaWZpZXJzLmluZGV4T2YoJ251bWJlcicpICE9PSAtMSkge1xyXG4gICAgICAgIHZhbHVlID0gdGhpcy5fbih2YWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghdGFyZ2V0KSB7XHJcbiAgICAgIHRhcmdldCA9IHRoaXM7XHJcbiAgICB9XHJcbiAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xyXG4gIH07XHJcblxyXG4gIFZ1ZS5wcm90b3R5cGUuX19zZXRfc3luYyA9IGZ1bmN0aW9uKHRhcmdldCwga2V5LCB2YWx1ZSkge1xyXG4gICAgaWYgKCF0YXJnZXQpIHtcclxuICAgICAgdGFyZ2V0ID0gdGhpcztcclxuICAgIH1cclxuICAgIHRhcmdldFtrZXldID0gdmFsdWU7XHJcbiAgfTtcclxuXHJcbiAgVnVlLnByb3RvdHlwZS5fX2dldF9vcmlnID0gZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgaWYgKGlzUGxhaW5PYmplY3QoaXRlbSkpIHtcclxuICAgICAgcmV0dXJuIGl0ZW1bJyRvcmlnJ10gfHwgaXRlbVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGl0ZW1cclxuICB9O1xyXG5cclxuICBWdWUucHJvdG90eXBlLl9fZ2V0X3ZhbHVlID0gZnVuY3Rpb24oZGF0YVBhdGgsIHRhcmdldCkge1xyXG4gICAgcmV0dXJuIGdldFRhcmdldCh0YXJnZXQgfHwgdGhpcywgZGF0YVBhdGgpXHJcbiAgfTtcclxuXHJcblxyXG4gIFZ1ZS5wcm90b3R5cGUuX19nZXRfY2xhc3MgPSBmdW5jdGlvbihkeW5hbWljQ2xhc3MsIHN0YXRpY0NsYXNzKSB7XHJcbiAgICByZXR1cm4gcmVuZGVyQ2xhc3Moc3RhdGljQ2xhc3MsIGR5bmFtaWNDbGFzcylcclxuICB9O1xyXG5cclxuICBWdWUucHJvdG90eXBlLl9fZ2V0X3N0eWxlID0gZnVuY3Rpb24oZHluYW1pY1N0eWxlLCBzdGF0aWNTdHlsZSkge1xyXG4gICAgaWYgKCFkeW5hbWljU3R5bGUgJiYgIXN0YXRpY1N0eWxlKSB7XHJcbiAgICAgIHJldHVybiAnJ1xyXG4gICAgfVxyXG4gICAgdmFyIGR5bmFtaWNTdHlsZU9iaiA9IG5vcm1hbGl6ZVN0eWxlQmluZGluZyhkeW5hbWljU3R5bGUpO1xyXG4gICAgdmFyIHN0eWxlT2JqID0gc3RhdGljU3R5bGUgPyBleHRlbmQoc3RhdGljU3R5bGUsIGR5bmFtaWNTdHlsZU9iaikgOiBkeW5hbWljU3R5bGVPYmo7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc3R5bGVPYmopLm1hcChmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gKChoeXBoZW5hdGUobmFtZSkpICsgXCI6XCIgKyAoc3R5bGVPYmpbbmFtZV0pKTsgfSkuam9pbignOycpXHJcbiAgfTtcclxuXHJcbiAgVnVlLnByb3RvdHlwZS5fX21hcCA9IGZ1bmN0aW9uKHZhbCwgaXRlcmF0ZWUpIHtcclxuICAgIC8vVE9ETyDmmoLkuI3ogIPomZEgc3RyaW5nLG51bWJlclxyXG4gICAgdmFyIHJldCwgaSwgbCwga2V5cywga2V5O1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xyXG4gICAgICByZXQgPSBuZXcgQXJyYXkodmFsLmxlbmd0aCk7XHJcbiAgICAgIGZvciAoaSA9IDAsIGwgPSB2YWwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgcmV0W2ldID0gaXRlcmF0ZWUodmFsW2ldLCBpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmV0XHJcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbCkpIHtcclxuICAgICAga2V5cyA9IE9iamVjdC5rZXlzKHZhbCk7XHJcbiAgICAgIHJldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgIGZvciAoaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgcmV0W2tleV0gPSBpdGVyYXRlZSh2YWxba2V5XSwga2V5LCBpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmV0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW11cclxuICB9O1xyXG5cclxufVxuXG4vKiAgKi9cclxuXHJcbnZhciBMSUZFQ1lDTEVfSE9PS1MkMSA9IFtcclxuICAgIC8vQXBwXHJcbiAgICAnb25MYXVuY2gnLFxyXG4gICAgJ29uU2hvdycsXHJcbiAgICAnb25IaWRlJyxcclxuICAgICdvblVuaU5WaWV3TWVzc2FnZScsXG4gICAgJ29uRXJyb3InLFxyXG4gICAgLy9QYWdlXHJcbiAgICAnb25Mb2FkJyxcclxuICAgIC8vICdvblNob3cnLFxyXG4gICAgJ29uUmVhZHknLFxyXG4gICAgLy8gJ29uSGlkZScsXHJcbiAgICAnb25VbmxvYWQnLFxyXG4gICAgJ29uUHVsbERvd25SZWZyZXNoJyxcclxuICAgICdvblJlYWNoQm90dG9tJyxcclxuICAgICdvblRhYkl0ZW1UYXAnLFxyXG4gICAgJ29uU2hhcmVBcHBNZXNzYWdlJyxcbiAgICAnb25SZXNpemUnLFxyXG4gICAgJ29uUGFnZVNjcm9sbCcsXHJcbiAgICAnb25OYXZpZ2F0aW9uQmFyQnV0dG9uVGFwJyxcclxuICAgICdvbkJhY2tQcmVzcycsXHJcbiAgICAnb25OYXZpZ2F0aW9uQmFyU2VhcmNoSW5wdXRDaGFuZ2VkJyxcclxuICAgICdvbk5hdmlnYXRpb25CYXJTZWFyY2hJbnB1dENvbmZpcm1lZCcsXHJcbiAgICAnb25OYXZpZ2F0aW9uQmFyU2VhcmNoSW5wdXRDbGlja2VkJyxcclxuICAgIC8vQ29tcG9uZW50XHJcbiAgICAvLyAnb25SZWFkeScsIC8vIOWFvOWuueaXp+eJiOacrO+8jOW6lOivpeenu+mZpOivpeS6i+S7tlxyXG4gICAgJ29uUGFnZVNob3cnLFxyXG4gICAgJ29uUGFnZUhpZGUnLFxyXG4gICAgJ29uUGFnZVJlc2l6ZSdcclxuXTtcclxuZnVuY3Rpb24gbGlmZWN5Y2xlTWl4aW4kMShWdWUpIHtcclxuXHJcbiAgICAvL2ZpeGVkIHZ1ZS1jbGFzcy1jb21wb25lbnRcclxuICAgIHZhciBvbGRFeHRlbmQgPSBWdWUuZXh0ZW5kO1xyXG4gICAgVnVlLmV4dGVuZCA9IGZ1bmN0aW9uKGV4dGVuZE9wdGlvbnMpIHtcclxuICAgICAgICBleHRlbmRPcHRpb25zID0gZXh0ZW5kT3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgdmFyIG1ldGhvZHMgPSBleHRlbmRPcHRpb25zLm1ldGhvZHM7XHJcbiAgICAgICAgaWYgKG1ldGhvZHMpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMobWV0aG9kcykuZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKExJRkVDWUNMRV9IT09LUyQxLmluZGV4T2YobWV0aG9kTmFtZSkhPT0tMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZE9wdGlvbnNbbWV0aG9kTmFtZV0gPSBtZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvbGRFeHRlbmQuY2FsbCh0aGlzLCBleHRlbmRPcHRpb25zKVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgc3RyYXRlZ2llcyA9IFZ1ZS5jb25maWcub3B0aW9uTWVyZ2VTdHJhdGVnaWVzO1xyXG4gICAgdmFyIG1lcmdlSG9vayA9IHN0cmF0ZWdpZXMuY3JlYXRlZDtcclxuICAgIExJRkVDWUNMRV9IT09LUyQxLmZvckVhY2goZnVuY3Rpb24gKGhvb2spIHtcclxuICAgICAgICBzdHJhdGVnaWVzW2hvb2tdID0gbWVyZ2VIb29rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgVnVlLnByb3RvdHlwZS5fX2xpZmVjeWNsZV9ob29rc19fID0gTElGRUNZQ0xFX0hPT0tTJDE7XHJcbn1cblxuLyogICovXHJcblxuLy8gaW5zdGFsbCBwbGF0Zm9ybSBwYXRjaCBmdW5jdGlvblxyXG5WdWUucHJvdG90eXBlLl9fcGF0Y2hfXyA9IHBhdGNoO1xyXG5cclxuLy8gcHVibGljIG1vdW50IG1ldGhvZFxyXG5WdWUucHJvdG90eXBlLiRtb3VudCA9IGZ1bmN0aW9uKFxyXG4gICAgZWwgLFxyXG4gICAgaHlkcmF0aW5nIFxyXG4pIHtcclxuICAgIHJldHVybiBtb3VudENvbXBvbmVudCQxKHRoaXMsIGVsLCBoeWRyYXRpbmcpXHJcbn07XHJcblxyXG5saWZlY3ljbGVNaXhpbiQxKFZ1ZSk7XHJcbmludGVybmFsTWl4aW4oVnVlKTtcblxuLyogICovXG5cbmV4cG9ydCBkZWZhdWx0IFZ1ZTtcbiIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbn0gY2F0Y2ggKGUpIHtcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcblx0aWYgKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpIGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcbiIsImltcG9ydCB7IHZlcnNpb24gfSBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xuXG5jb25zdCBTVEFUX1ZFUlNJT04gPSB2ZXJzaW9uO1xuY29uc3QgU1RBVF9VUkwgPSAnaHR0cHM6Ly90b25namkuZGNsb3VkLmlvL3VuaS9zdGF0JztcbmNvbnN0IFNUQVRfSDVfVVJMID0gJ2h0dHBzOi8vdG9uZ2ppLmRjbG91ZC5pby91bmkvc3RhdC5naWYnOyBcbmNvbnN0IFBBR0VfUFZFUl9USU1FID0gMTgwMDtcbmNvbnN0IEFQUF9QVkVSX1RJTUUgPSAzMDA7XG5jb25zdCBPUEVSQVRJTkdfVElNRSA9IDEwO1xuXG5jb25zdCBVVUlEX0tFWSA9ICdfX0RDX1NUQVRfVVVJRCc7XG5jb25zdCBVVUlEX1ZBTFVFID0gJ19fRENfVVVJRF9WQUxVRSc7XG5cbmZ1bmN0aW9uIGdldFV1aWQoKSB7XG4gIGxldCB1dWlkID0gJyc7XG4gIGlmIChnZXRQbGF0Zm9ybU5hbWUoKSA9PT0gJ24nKSB7XG4gICAgdHJ5IHtcbiAgICAgIHV1aWQgPSBwbHVzLnJ1bnRpbWUuZ2V0RENsb3VkSWQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB1dWlkID0gJyc7XG4gICAgfVxuICAgIHJldHVybiB1dWlkXG4gIH1cblxuICB0cnkge1xuICAgIHV1aWQgPSB1bmkuZ2V0U3RvcmFnZVN5bmMoVVVJRF9LRVkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdXVpZCA9IFVVSURfVkFMVUU7XG4gIH1cblxuICBpZiAoIXV1aWQpIHtcbiAgICB1dWlkID0gRGF0ZS5ub3coKSArICcnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMWU3KTtcbiAgICB0cnkge1xuICAgICAgdW5pLnNldFN0b3JhZ2VTeW5jKFVVSURfS0VZLCB1dWlkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB1bmkuc2V0U3RvcmFnZVN5bmMoVVVJRF9LRVksIFVVSURfVkFMVUUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdXVpZDtcbn1cblxuY29uc3QgZ2V0U2dpbiA9IChzdGF0RGF0YSkgPT4ge1xuICBsZXQgYXJyID0gT2JqZWN0LmtleXMoc3RhdERhdGEpO1xuICBsZXQgc29ydEFyciA9IGFyci5zb3J0KCk7XG4gIGxldCBzZ2luID0ge307XG4gIGxldCBzZ2luU3RyID0gJyc7XG4gIGZvciAodmFyIGkgaW4gc29ydEFycikge1xuICAgIHNnaW5bc29ydEFycltpXV0gPSBzdGF0RGF0YVtzb3J0QXJyW2ldXTtcbiAgICBzZ2luU3RyICs9IHNvcnRBcnJbaV0gKyAnPScgKyBzdGF0RGF0YVtzb3J0QXJyW2ldXSArICcmJztcbiAgfVxuICAvLyBjb25zdCBvcHRpb25zID0gc2dpblN0ci5zdWJzdHIoMCwgc2dpblN0ci5sZW5ndGggLSAxKVxuICAvLyBzZ2luU3RyID0gc2dpblN0ci5zdWJzdHIoMCwgc2dpblN0ci5sZW5ndGggLSAxKSArICcma2V5PScgKyBTVEFUX0tFWTtcbiAgLy8gY29uc3Qgc2kgPSBjcnlwdG8uY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKHNnaW5TdHIpLmRpZ2VzdCgnaGV4Jyk7XG4gIHJldHVybiB7XG4gICAgc2lnbjogJycsXG4gICAgb3B0aW9uczogc2dpblN0ci5zdWJzdHIoMCwgc2dpblN0ci5sZW5ndGggLSAxKVxuICB9O1xufTtcblxuY29uc3QgZ2V0U3BsaWNpbmcgPSAoZGF0YSkgPT4ge1xuICBsZXQgc3RyID0gJyc7XG4gIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgIHN0ciArPSBpICsgJz0nICsgZGF0YVtpXSArICcmJztcbiAgfVxuICByZXR1cm4gc3RyLnN1YnN0cigwLCBzdHIubGVuZ3RoIC0gMSlcbn07XG5cbmNvbnN0IGdldFRpbWUgPSAoKSA9PiB7XG4gIHJldHVybiBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApO1xufTtcblxuY29uc3QgZ2V0UGxhdGZvcm1OYW1lID0gKCkgPT4ge1xuICBjb25zdCBwbGF0Zm9ybUxpc3QgPSB7XG4gICAgJ2FwcC1wbHVzJzogJ24nLFxuICAgICdoNSc6ICdoNScsXG4gICAgJ21wLXdlaXhpbic6ICd3eCcsXG4gICAgJ21wLWFsaXBheSc6ICdhbGknLFxuICAgICdtcC1iYWlkdSc6ICdiZCcsXG4gICAgJ21wLXRvdXRpYW8nOiAndHQnLFxuICAgICdtcC1xcSc6ICdxcSdcbiAgfTtcbiAgcmV0dXJuIHBsYXRmb3JtTGlzdFtwcm9jZXNzLmVudi5WVUVfQVBQX1BMQVRGT1JNXTtcbn07XG5cbmNvbnN0IGdldFBhY2tOYW1lID0gKCkgPT4ge1xuICBsZXQgcGFja05hbWUgPSAnJztcbiAgaWYgKGdldFBsYXRmb3JtTmFtZSgpID09PSAnd3gnIHx8IGdldFBsYXRmb3JtTmFtZSgpID09PSAncXEnKSB7XG4gICAgLy8g5YW85a655b6u5L+h5bCP56iL5bqP5L2O54mI5pys5Z+656GA5bqTXG4gICAgaWYodW5pLmNhbklVc2UoJ2dldEFjY291bnRJbmZvU3luYycpKXtcbiAgICAgIHBhY2tOYW1lID0gdW5pLmdldEFjY291bnRJbmZvU3luYygpLm1pbmlQcm9ncmFtLmFwcElkIHx8ICcnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFja05hbWVcbn07XG5cbmNvbnN0IGdldFZlcnNpb24gPSAoKSA9PiB7XG4gIHJldHVybiBnZXRQbGF0Zm9ybU5hbWUoKSA9PT0gJ24nID8gcGx1cy5ydW50aW1lLnZlcnNpb24gOiAnJztcbn07XG5cbmNvbnN0IGdldENoYW5uZWwgPSAoKSA9PiB7XG4gIGNvbnN0IHBsYXRmb3JtTmFtZSA9IGdldFBsYXRmb3JtTmFtZSgpO1xuICBsZXQgY2hhbm5lbCA9ICcnO1xuICBpZiAocGxhdGZvcm1OYW1lID09PSAnbicpIHtcbiAgICBjaGFubmVsID0gcGx1cy5ydW50aW1lLmNoYW5uZWw7XG4gIH1cbiAgcmV0dXJuIGNoYW5uZWw7XG59O1xuXG5jb25zdCBnZXRTY2VuZSA9IChvcHRpb25zKSA9PiB7XG4gIGNvbnN0IHBsYXRmb3JtTmFtZSA9IGdldFBsYXRmb3JtTmFtZSgpO1xuICBsZXQgc2NlbmUgPSAnJztcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfVxuICBpZiAocGxhdGZvcm1OYW1lID09PSAnd3gnKSB7XG4gICAgc2NlbmUgPSB1bmkuZ2V0TGF1bmNoT3B0aW9uc1N5bmMoKS5zY2VuZTtcbiAgfVxuICByZXR1cm4gc2NlbmU7XG59O1xuY29uc3QgRmlyc3RfX1Zpc2l0X19UaW1lX19LRVkgPSAnRmlyc3RfX1Zpc2l0X19UaW1lJztcbmNvbnN0IExhc3RfX1Zpc2l0X19UaW1lX19LRVkgPSAnTGFzdF9fVmlzaXRfX1RpbWUnO1xuXG5jb25zdCBnZXRGaXJzdFZpc2l0VGltZSA9ICgpID0+IHtcbiAgY29uc3QgdGltZVN0b3JnZSA9IHVuaS5nZXRTdG9yYWdlU3luYyhGaXJzdF9fVmlzaXRfX1RpbWVfX0tFWSk7XG4gIGxldCB0aW1lID0gMDtcbiAgaWYgKHRpbWVTdG9yZ2UpIHtcbiAgICB0aW1lID0gdGltZVN0b3JnZTtcbiAgfSBlbHNlIHtcbiAgICB0aW1lID0gZ2V0VGltZSgpO1xuICAgIHVuaS5zZXRTdG9yYWdlU3luYyhGaXJzdF9fVmlzaXRfX1RpbWVfX0tFWSwgdGltZSk7XG4gICAgdW5pLnJlbW92ZVN0b3JhZ2VTeW5jKExhc3RfX1Zpc2l0X19UaW1lX19LRVkpO1xuICB9XG4gIHJldHVybiB0aW1lO1xufTtcblxuY29uc3QgZ2V0TGFzdFZpc2l0VGltZSA9ICgpID0+IHtcbiAgY29uc3QgdGltZVN0b3JnZSA9IHVuaS5nZXRTdG9yYWdlU3luYyhMYXN0X19WaXNpdF9fVGltZV9fS0VZKTtcbiAgbGV0IHRpbWUgPSAwO1xuICBpZiAodGltZVN0b3JnZSkge1xuICAgIHRpbWUgPSB0aW1lU3RvcmdlO1xuICB9IGVsc2Uge1xuICAgIHRpbWUgPSAnJztcbiAgfVxuICB1bmkuc2V0U3RvcmFnZVN5bmMoTGFzdF9fVmlzaXRfX1RpbWVfX0tFWSwgZ2V0VGltZSgpKTtcbiAgcmV0dXJuIHRpbWU7XG59O1xuXG5cbmNvbnN0IFBBR0VfUkVTSURFTkNFX1RJTUUgPSAnX19wYWdlX19yZXNpZGVuY2VfX3RpbWUnO1xubGV0IEZpcnN0X1BhZ2VfcmVzaWRlbmNlX3RpbWUgPSAwO1xubGV0IExhc3RfUGFnZV9yZXNpZGVuY2VfdGltZSA9IDA7XG5cblxuY29uc3Qgc2V0UGFnZVJlc2lkZW5jZVRpbWUgPSAoKSA9PiB7XG4gIEZpcnN0X1BhZ2VfcmVzaWRlbmNlX3RpbWUgPSBnZXRUaW1lKCk7XG4gIGlmIChnZXRQbGF0Zm9ybU5hbWUoKSA9PT0gJ24nKSB7XG4gICAgdW5pLnNldFN0b3JhZ2VTeW5jKFBBR0VfUkVTSURFTkNFX1RJTUUsIGdldFRpbWUoKSk7XG4gIH1cbiAgcmV0dXJuIEZpcnN0X1BhZ2VfcmVzaWRlbmNlX3RpbWVcbn07XG5cbmNvbnN0IGdldFBhZ2VSZXNpZGVuY2VUaW1lID0gKCkgPT4ge1xuICBMYXN0X1BhZ2VfcmVzaWRlbmNlX3RpbWUgPSBnZXRUaW1lKCk7XG4gIGlmIChnZXRQbGF0Zm9ybU5hbWUoKSA9PT0gJ24nKSB7XG4gICAgRmlyc3RfUGFnZV9yZXNpZGVuY2VfdGltZSA9IHVuaS5nZXRTdG9yYWdlU3luYyhQQUdFX1JFU0lERU5DRV9USU1FKTtcbiAgfVxuICByZXR1cm4gTGFzdF9QYWdlX3Jlc2lkZW5jZV90aW1lIC0gRmlyc3RfUGFnZV9yZXNpZGVuY2VfdGltZVxufTtcbmNvbnN0IFRPVEFMX19WSVNJVF9fQ09VTlQgPSAnVG90YWxfX1Zpc2l0X19Db3VudCc7XG5jb25zdCBnZXRUb3RhbFZpc2l0Q291bnQgPSAoKSA9PiB7XG4gIGNvbnN0IHRpbWVTdG9yZ2UgPSB1bmkuZ2V0U3RvcmFnZVN5bmMoVE9UQUxfX1ZJU0lUX19DT1VOVCk7XG4gIGxldCBjb3VudCA9IDE7XG4gIGlmICh0aW1lU3RvcmdlKSB7XG4gICAgY291bnQgPSB0aW1lU3RvcmdlO1xuICAgIGNvdW50Kys7XG4gIH1cbiAgdW5pLnNldFN0b3JhZ2VTeW5jKFRPVEFMX19WSVNJVF9fQ09VTlQsIGNvdW50KTtcbiAgcmV0dXJuIGNvdW50O1xufTtcblxuY29uc3QgR2V0RW5jb2RlVVJJQ29tcG9uZW50T3B0aW9ucyA9IChzdGF0RGF0YSkgPT4ge1xuICBsZXQgZGF0YSA9IHt9O1xuICBmb3IgKGxldCBwcm9wIGluIHN0YXREYXRhKSB7XG4gICAgZGF0YVtwcm9wXSA9IGVuY29kZVVSSUNvbXBvbmVudChzdGF0RGF0YVtwcm9wXSk7XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5sZXQgU2V0X19GaXJzdF9fVGltZSA9IDA7XG5sZXQgU2V0X19MYXN0X19UaW1lID0gMDtcblxuY29uc3QgZ2V0Rmlyc3RUaW1lID0gKCkgPT4ge1xuICBsZXQgdGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICBTZXRfX0ZpcnN0X19UaW1lID0gdGltZTtcbiAgU2V0X19MYXN0X19UaW1lID0gMDtcbiAgcmV0dXJuIHRpbWU7XG59O1xuXG5cbmNvbnN0IGdldExhc3RUaW1lID0gKCkgPT4ge1xuICBsZXQgdGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICBTZXRfX0xhc3RfX1RpbWUgPSB0aW1lO1xuICByZXR1cm4gdGltZTtcbn07XG5cblxuY29uc3QgZ2V0UmVzaWRlbmNlVGltZSA9ICh0eXBlKSA9PiB7XG4gIGxldCByZXNpZGVuY2VUaW1lID0gMDtcbiAgaWYgKFNldF9fRmlyc3RfX1RpbWUgIT09IDApIHtcbiAgICByZXNpZGVuY2VUaW1lID0gU2V0X19MYXN0X19UaW1lIC0gU2V0X19GaXJzdF9fVGltZTtcbiAgfVxuXG4gIHJlc2lkZW5jZVRpbWUgPSBwYXJzZUludChyZXNpZGVuY2VUaW1lIC8gMTAwMCk7XG4gIHJlc2lkZW5jZVRpbWUgPSByZXNpZGVuY2VUaW1lIDwgMSA/IDEgOiByZXNpZGVuY2VUaW1lO1xuICBpZiAodHlwZSA9PT0gJ2FwcCcpIHtcbiAgICBsZXQgb3ZlcnRpbWUgPSByZXNpZGVuY2VUaW1lID4gQVBQX1BWRVJfVElNRSA/IHRydWUgOiBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzaWRlbmNlVGltZSxcbiAgICAgIG92ZXJ0aW1lXG4gICAgfTtcbiAgfVxuICBpZiAodHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgbGV0IG92ZXJ0aW1lID0gcmVzaWRlbmNlVGltZSA+IFBBR0VfUFZFUl9USU1FID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHJldHVybiB7XG4gICAgICByZXNpZGVuY2VUaW1lLFxuICAgICAgb3ZlcnRpbWVcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICByZXNpZGVuY2VUaW1lXG4gIH07XG5cbn07XG5cbmNvbnN0IGdldFJvdXRlID0gKCkgPT4ge1xuICB2YXIgcGFnZXMgPSBnZXRDdXJyZW50UGFnZXMoKTtcbiAgdmFyIHBhZ2UgPSBwYWdlc1twYWdlcy5sZW5ndGggLSAxXTtcbiAgbGV0IF9zZWxmID0gcGFnZS4kdm07XG5cbiAgaWYgKGdldFBsYXRmb3JtTmFtZSgpID09PSAnYmQnKSB7XG4gICAgcmV0dXJuIF9zZWxmLiRtcCAmJiBfc2VsZi4kbXAucGFnZS5pcztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKF9zZWxmLiRzY29wZSAmJiBfc2VsZi4kc2NvcGUucm91dGUpIHx8IChfc2VsZi4kbXAgJiYgX3NlbGYuJG1wLnBhZ2Uucm91dGUpO1xuICB9XG59O1xuXG5jb25zdCBnZXRQYWdlUm91dGUgPSAoc2VsZikgPT4ge1xuICB2YXIgcGFnZXMgPSBnZXRDdXJyZW50UGFnZXMoKTtcbiAgdmFyIHBhZ2UgPSBwYWdlc1twYWdlcy5sZW5ndGggLSAxXTtcbiAgbGV0IF9zZWxmID0gcGFnZS4kdm07XG4gIGxldCBxdWVyeSA9IHNlbGYuX3F1ZXJ5O1xuICBsZXQgc3RyID0gcXVlcnkgJiYgSlNPTi5zdHJpbmdpZnkocXVlcnkpICE9PSAne30nID8gJz8nICsgSlNPTi5zdHJpbmdpZnkocXVlcnkpIDogJyc7XG4gIC8vIGNsZWFyXG4gIHNlbGYuX3F1ZXJ5ID0gJyc7XG4gIGlmIChnZXRQbGF0Zm9ybU5hbWUoKSA9PT0gJ2JkJykge1xuICAgIHJldHVybiBfc2VsZi4kbXAgJiYgX3NlbGYuJG1wLnBhZ2UuaXMgKyBzdHI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIChfc2VsZi4kc2NvcGUgJiYgX3NlbGYuJHNjb3BlLnJvdXRlICsgc3RyICl8fCAoX3NlbGYuJG1wICYmIF9zZWxmLiRtcC5wYWdlLnJvdXRlICsgc3RyKTtcbiAgfVxufTtcblxuY29uc3QgZ2V0UGFnZVR5cGVzID0gKHNlbGYpID0+IHtcbiAgaWYgKHNlbGYubXBUeXBlID09PSAncGFnZScgfHwgKHNlbGYuJG1wICYmIHNlbGYuJG1wLm1wVHlwZSA9PT0gJ3BhZ2UnKSB8fCBzZWxmLiRvcHRpb25zLm1wVHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgY2FsaWJyYXRpb24gPSAoZXZlbnROYW1lLCBvcHRpb25zKSA9PiB7XG4gIC8vICBsb2dpbiDjgIEgc2hhcmUg44CBcGF5X3N1Y2Nlc3Mg44CBcGF5X2ZhaWwg44CBcmVnaXN0ZXIg44CBdGl0bGVcbiAgaWYoIWV2ZW50TmFtZSl7XG4gICAgY29uc29sZS5lcnJvcihgdW5pLnJlcG9ydCDnvLrlsJEgW2V2ZW50TmFtZV0g5Y+C5pWwYCk7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBpZiAodHlwZW9mIGV2ZW50TmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICBjb25zb2xlLmVycm9yKGB1bmkucmVwb3J0IFtldmVudE5hbWVdIOWPguaVsOexu+Wei+mUmeivryzlj6rog73kuLogU3RyaW5nIOexu+Wei2ApO1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgaWYgKGV2ZW50TmFtZS5sZW5ndGggPiAyNTUpIHtcbiAgICBjb25zb2xlLmVycm9yKGB1bmkucmVwb3J0IFtldmVudE5hbWVdIOWPguaVsOmVv+W6puS4jeiDveWkp+S6jiAyNTVgKTtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnc3RyaW5nJyAmJiB0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICBjb25zb2xlLmVycm9yKGB1bmkucmVwb3J0IFtvcHRpb25zXSDlj4LmlbDnsbvlnovplJnor68s5Y+q6IO95Li6IFN0cmluZyDmiJYgT2JqZWN0IOexu+Wei2ApO1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMubGVuZ3RoID4gMjU1KSB7XG4gICAgY29uc29sZS5lcnJvcihgdW5pLnJlcG9ydCBbb3B0aW9uc10g5Y+C5pWw6ZW/5bqm5LiN6IO95aSn5LqOIDI1NWApO1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpZiAoZXZlbnROYW1lID09PSAndGl0bGUnICYmIHR5cGVvZiBvcHRpb25zICE9PSAnc3RyaW5nJykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3VuaS5yZXBvcnQgW2V2ZW50TmFtZV0g5Y+C5pWw5Li6IHRpdGxlIOaXtu+8jFtvcHRpb25zXSDlj4LmlbDlj6rog73kuLogU3RyaW5nIOexu+WeiycpO1xuICAgIHJldHVybiB0cnVlXG4gIH1cbn07XG5cbmNvbnN0IFBhZ2VzSnNvbiA9IHJlcXVpcmUoJ3VuaS1wYWdlcz97XCJ0eXBlXCI6XCJzdHlsZVwifScpLmRlZmF1bHQ7XG5jb25zdCBzdGF0Q29uZmlnID0gcmVxdWlyZSgndW5pLXN0YXQtY29uZmlnJykuZGVmYXVsdCB8fCByZXF1aXJlKCd1bmktc3RhdC1jb25maWcnKTtcblxuY29uc3QgcmVzdWx0T3B0aW9ucyA9IHVuaS5nZXRTeXN0ZW1JbmZvU3luYygpO1xuXG5jbGFzcyBVdGlsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxmID0gJyc7XG4gICAgdGhpcy5fcmV0cnkgPSAwO1xuICAgIHRoaXMuX3BsYXRmb3JtID0gJyc7XG4gICAgdGhpcy5fcXVlcnkgPSB7fTtcbiAgICB0aGlzLl9uYXZpZ2F0aW9uQmFyVGl0bGUgPSB7XG4gICAgICBjb25maWc6ICcnLFxuICAgICAgcGFnZTogJycsXG4gICAgICByZXBvcnQ6ICcnLFxuICAgICAgbHQ6ICcnXG4gICAgfTtcbiAgICB0aGlzLl9vcGVyYXRpbmdUaW1lID0gMDtcbiAgICB0aGlzLl9yZXBvcnRpbmdSZXF1ZXN0RGF0YSA9IHtcbiAgICAgICcxJzogW10sXG4gICAgICAnMTEnOiBbXVxuICAgIH07XG4gICAgdGhpcy5fX3ByZXZlbnRfdHJpZ2dlcmluZyA9IGZhbHNlO1xuXG4gICAgdGhpcy5fX2xpY2F0aW9uSGlkZSA9IGZhbHNlO1xuICAgIHRoaXMuX19saWNhdGlvblNob3cgPSBmYWxzZTtcbiAgICB0aGlzLl9sYXN0UGFnZVJvdXRlID0gJyc7XG4gICAgdGhpcy5zdGF0RGF0YSA9IHtcbiAgICAgIHV1aWQ6IGdldFV1aWQoKSxcbiAgICAgIHV0OiBnZXRQbGF0Zm9ybU5hbWUoKSxcbiAgICAgIG1wbjogZ2V0UGFja05hbWUoKSxcbiAgICAgIGFrOiBzdGF0Q29uZmlnLmFwcGlkLFxuICAgICAgdXN2OiBTVEFUX1ZFUlNJT04sXG4gICAgICB2OiBnZXRWZXJzaW9uKCksXG4gICAgICBjaDogZ2V0Q2hhbm5lbCgpLFxuICAgICAgY246ICcnLFxuICAgICAgcG46ICcnLFxuICAgICAgY3Q6ICcnLFxuICAgICAgdDogZ2V0VGltZSgpLFxuICAgICAgdHQ6ICcnLFxuICAgICAgcDogcmVzdWx0T3B0aW9ucy5wbGF0Zm9ybSA9PT0gJ2FuZHJvaWQnID8gJ2EnIDogJ2knLFxuICAgICAgYnJhbmQ6IHJlc3VsdE9wdGlvbnMuYnJhbmQgfHwgJycsXG4gICAgICBtZDogcmVzdWx0T3B0aW9ucy5tb2RlbCxcbiAgICAgIHN2OiByZXN1bHRPcHRpb25zLnN5c3RlbS5yZXBsYWNlKC8oQW5kcm9pZHxpT1MpXFxzLywgJycpLFxuICAgICAgbXBzZGs6IHJlc3VsdE9wdGlvbnMuU0RLVmVyc2lvbiB8fCAnJyxcbiAgICAgIG1wdjogcmVzdWx0T3B0aW9ucy52ZXJzaW9uIHx8ICcnLFxuICAgICAgbGFuZzogcmVzdWx0T3B0aW9ucy5sYW5ndWFnZSxcbiAgICAgIHByOiByZXN1bHRPcHRpb25zLnBpeGVsUmF0aW8sXG4gICAgICB3dzogcmVzdWx0T3B0aW9ucy53aW5kb3dXaWR0aCxcbiAgICAgIHdoOiByZXN1bHRPcHRpb25zLndpbmRvd0hlaWdodCxcbiAgICAgIHN3OiByZXN1bHRPcHRpb25zLnNjcmVlbldpZHRoLFxuICAgICAgc2g6IHJlc3VsdE9wdGlvbnMuc2NyZWVuSGVpZ2h0XG4gICAgfTtcblxuICB9XG5cbiAgX2FwcGxpY2F0aW9uU2hvdygpIHtcbiAgICBpZiAodGhpcy5fX2xpY2F0aW9uSGlkZSkge1xuICAgICAgZ2V0TGFzdFRpbWUoKTtcbiAgICAgIGNvbnN0IHRpbWUgPSBnZXRSZXNpZGVuY2VUaW1lKCdhcHAnKTtcbiAgICAgIGlmICh0aW1lLm92ZXJ0aW1lKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgIHBhdGg6IHRoaXMuX2xhc3RQYWdlUm91dGUsXG4gICAgICAgICAgc2NlbmU6IHRoaXMuc3RhdERhdGEuc2NcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fc2VuZFJlcG9ydFJlcXVlc3Qob3B0aW9ucyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9fbGljYXRpb25IaWRlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgX2FwcGxpY2F0aW9uSGlkZShzZWxmLCB0eXBlKSB7XG5cbiAgICB0aGlzLl9fbGljYXRpb25IaWRlID0gdHJ1ZTtcbiAgICBnZXRMYXN0VGltZSgpO1xuICAgIGNvbnN0IHRpbWUgPSBnZXRSZXNpZGVuY2VUaW1lKCk7XG4gICAgZ2V0Rmlyc3RUaW1lKCk7XG4gICAgY29uc3Qgcm91dGUgPSBnZXRQYWdlUm91dGUodGhpcyk7XG4gICAgdGhpcy5fc2VuZEhpZGVSZXF1ZXN0KHtcbiAgICAgIHVybHJlZjogcm91dGUsXG4gICAgICB1cmxyZWZfdHM6IHRpbWUucmVzaWRlbmNlVGltZVxuICAgIH0sIHR5cGUpO1xuICB9XG5cbiAgX3BhZ2VTaG93KCkge1xuICAgIGNvbnN0IHJvdXRlID0gZ2V0UGFnZVJvdXRlKHRoaXMpO1xuICAgIGNvbnN0IHJvdXRlcGF0aCA9IGdldFJvdXRlKCk7XG4gICAgdGhpcy5fbmF2aWdhdGlvbkJhclRpdGxlLmNvbmZpZyA9IFBhZ2VzSnNvbiAmJlxuICAgICAgUGFnZXNKc29uLnBhZ2VzW3JvdXRlcGF0aF0gJiZcbiAgICAgIFBhZ2VzSnNvbi5wYWdlc1tyb3V0ZXBhdGhdLnRpdGxlTlZpZXcgJiZcbiAgICAgIFBhZ2VzSnNvbi5wYWdlc1tyb3V0ZXBhdGhdLnRpdGxlTlZpZXcudGl0bGVUZXh0IHx8XG4gICAgICBQYWdlc0pzb24gJiZcbiAgICAgIFBhZ2VzSnNvbi5wYWdlc1tyb3V0ZXBhdGhdICYmXG4gICAgICBQYWdlc0pzb24ucGFnZXNbcm91dGVwYXRoXS5uYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IHx8ICcnO1xuXG4gICAgaWYgKHRoaXMuX19saWNhdGlvblNob3cpIHtcbiAgICAgIGdldEZpcnN0VGltZSgpO1xuICAgICAgdGhpcy5fX2xpY2F0aW9uU2hvdyA9IGZhbHNlO1xuICAgICAgLy8gY29uc29sZS5sb2coJ+i/meaYryBvbkxhdWNoIOS5i+WQjuaJp+ihjOeahOesrOS4gOasoSBwYWdlU2hvdyDvvIzkuLrkuIvmrKHorrDlvZXml7bpl7TlgZrlh4blpIcnKTtcbiAgICAgIHRoaXMuX2xhc3RQYWdlUm91dGUgPSByb3V0ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBnZXRMYXN0VGltZSgpO1xuICAgIHRoaXMuX2xhc3RQYWdlUm91dGUgPSByb3V0ZTtcbiAgICBjb25zdCB0aW1lID0gZ2V0UmVzaWRlbmNlVGltZSgncGFnZScpO1xuICAgIGlmICh0aW1lLm92ZXJ0aW1lKSB7XG4gICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgcGF0aDogdGhpcy5fbGFzdFBhZ2VSb3V0ZSxcbiAgICAgICAgc2NlbmU6IHRoaXMuc3RhdERhdGEuc2NcbiAgICAgIH07XG4gICAgICB0aGlzLl9zZW5kUmVwb3J0UmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG4gICAgZ2V0Rmlyc3RUaW1lKCk7XG4gIH1cblxuICBfcGFnZUhpZGUoKSB7XG4gICAgaWYgKCF0aGlzLl9fbGljYXRpb25IaWRlKSB7XG4gICAgICBnZXRMYXN0VGltZSgpO1xuICAgICAgY29uc3QgdGltZSA9IGdldFJlc2lkZW5jZVRpbWUoJ3BhZ2UnKTtcbiAgICAgIHRoaXMuX3NlbmRQYWdlUmVxdWVzdCh7XG4gICAgICAgIHVybDogdGhpcy5fbGFzdFBhZ2VSb3V0ZSxcbiAgICAgICAgdXJscmVmOiB0aGlzLl9sYXN0UGFnZVJvdXRlLFxuICAgICAgICB1cmxyZWZfdHM6IHRpbWUucmVzaWRlbmNlVGltZVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9uYXZpZ2F0aW9uQmFyVGl0bGUgPSB7XG4gICAgICAgIGNvbmZpZzogJycsXG4gICAgICAgIHBhZ2U6ICcnLFxuICAgICAgICByZXBvcnQ6ICcnLFxuICAgICAgICBsdDogJydcbiAgICAgIH07XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgX2xvZ2luKCkge1xuICAgIHRoaXMuX3NlbmRFdmVudFJlcXVlc3Qoe1xuICAgICAga2V5OiAnbG9naW4nXG4gICAgfSwgMCk7XG4gIH1cblxuICBfc2hhcmUoKSB7XG4gICAgdGhpcy5fc2VuZEV2ZW50UmVxdWVzdCh7XG4gICAgICBrZXk6ICdzaGFyZSdcbiAgICB9LCAwKTtcbiAgfVxuICBfcGF5bWVudChrZXkpIHtcbiAgICB0aGlzLl9zZW5kRXZlbnRSZXF1ZXN0KHtcbiAgICAgIGtleVxuICAgIH0sIDApO1xuICB9XG4gIF9zZW5kUmVwb3J0UmVxdWVzdChvcHRpb25zKSB7XG5cbiAgICB0aGlzLl9uYXZpZ2F0aW9uQmFyVGl0bGUubHQgPSAnMSc7XG4gICAgbGV0IHF1ZXJ5ID0gb3B0aW9ucy5xdWVyeSAmJiBKU09OLnN0cmluZ2lmeShvcHRpb25zLnF1ZXJ5KSAhPT0gJ3t9JyA/ICc/JyArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMucXVlcnkpIDogJyc7XG4gICAgdGhpcy5zdGF0RGF0YS5sdCA9ICcxJztcbiAgICB0aGlzLnN0YXREYXRhLnVybCA9IChvcHRpb25zLnBhdGggKyBxdWVyeSkgfHwgJyc7XG4gICAgdGhpcy5zdGF0RGF0YS50ID0gZ2V0VGltZSgpO1xuICAgIHRoaXMuc3RhdERhdGEuc2MgPSBnZXRTY2VuZShvcHRpb25zLnNjZW5lKTtcbiAgICB0aGlzLnN0YXREYXRhLmZ2dHMgPSBnZXRGaXJzdFZpc2l0VGltZSgpO1xuICAgIHRoaXMuc3RhdERhdGEubHZ0cyA9IGdldExhc3RWaXNpdFRpbWUoKTtcbiAgICB0aGlzLnN0YXREYXRhLnR2YyA9IGdldFRvdGFsVmlzaXRDb3VudCgpO1xuICAgIGlmIChnZXRQbGF0Zm9ybU5hbWUoKSA9PT0gJ24nKSB7XG4gICAgICB0aGlzLmdldFByb3BlcnR5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZ2V0TmV0d29ya0luZm8oKTtcbiAgICB9XG4gIH1cblxuICBfc2VuZFBhZ2VSZXF1ZXN0KG9wdCkge1xuICAgIGxldCB7XG4gICAgICB1cmwsXG4gICAgICB1cmxyZWYsXG4gICAgICB1cmxyZWZfdHNcbiAgICB9ID0gb3B0O1xuICAgIHRoaXMuX25hdmlnYXRpb25CYXJUaXRsZS5sdCA9ICcxMSc7XG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICBhazogdGhpcy5zdGF0RGF0YS5hayxcbiAgICAgIHV1aWQ6IHRoaXMuc3RhdERhdGEudXVpZCxcbiAgICAgIGx0OiAnMTEnLFxuICAgICAgdXQ6IHRoaXMuc3RhdERhdGEudXQsXG4gICAgICB1cmwsXG4gICAgICB0dDogdGhpcy5zdGF0RGF0YS50dCxcbiAgICAgIHVybHJlZixcbiAgICAgIHVybHJlZl90cyxcbiAgICAgIGNoOiB0aGlzLnN0YXREYXRhLmNoLFxuICAgICAgdXN2OiB0aGlzLnN0YXREYXRhLnVzdixcbiAgICAgIHQ6IGdldFRpbWUoKSxcbiAgICAgIHA6IHRoaXMuc3RhdERhdGEucFxuICAgIH07XG4gICAgdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgX3NlbmRIaWRlUmVxdWVzdChvcHQsIHR5cGUpIHtcbiAgICBsZXQge1xuICAgICAgdXJscmVmLFxuICAgICAgdXJscmVmX3RzXG4gICAgfSA9IG9wdDtcbiAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgIGFrOiB0aGlzLnN0YXREYXRhLmFrLFxuICAgICAgdXVpZDogdGhpcy5zdGF0RGF0YS51dWlkLFxuICAgICAgbHQ6ICczJyxcbiAgICAgIHV0OiB0aGlzLnN0YXREYXRhLnV0LFxuICAgICAgdXJscmVmLFxuICAgICAgdXJscmVmX3RzLFxuICAgICAgY2g6IHRoaXMuc3RhdERhdGEuY2gsXG4gICAgICB1c3Y6IHRoaXMuc3RhdERhdGEudXN2LFxuICAgICAgdDogZ2V0VGltZSgpLFxuICAgICAgcDogdGhpcy5zdGF0RGF0YS5wXG4gICAgfTtcbiAgICB0aGlzLnJlcXVlc3Qob3B0aW9ucywgdHlwZSk7XG4gIH1cbiAgX3NlbmRFdmVudFJlcXVlc3Qoe1xuICAgIGtleSA9ICcnLFxuICAgIHZhbHVlID0gXCJcIlxuICB9ID0ge30pIHtcbiAgICBjb25zdCByb3V0ZSA9IHRoaXMuX2xhc3RQYWdlUm91dGU7XG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICBhazogdGhpcy5zdGF0RGF0YS5hayxcbiAgICAgIHV1aWQ6IHRoaXMuc3RhdERhdGEudXVpZCxcbiAgICAgIGx0OiAnMjEnLFxuICAgICAgdXQ6IHRoaXMuc3RhdERhdGEudXQsXG4gICAgICB1cmw6IHJvdXRlLFxuICAgICAgY2g6IHRoaXMuc3RhdERhdGEuY2gsXG4gICAgICBlX246IGtleSxcbiAgICAgIGVfdjogdHlwZW9mKHZhbHVlKSA9PT0gJ29iamVjdCcgPyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgOiB2YWx1ZS50b1N0cmluZygpLFxuICAgICAgdXN2OiB0aGlzLnN0YXREYXRhLnVzdixcbiAgICAgIHQ6IGdldFRpbWUoKSxcbiAgICAgIHA6IHRoaXMuc3RhdERhdGEucFxuICAgIH07XG4gICAgdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgZ2V0TmV0d29ya0luZm8oKSB7XG4gICAgdW5pLmdldE5ldHdvcmtUeXBlKHtcbiAgICAgIHN1Y2Nlc3M6IChyZXN1bHQpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0RGF0YS5uZXQgPSByZXN1bHQubmV0d29ya1R5cGU7XG4gICAgICAgIHRoaXMuZ2V0TG9jYXRpb24oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFByb3BlcnR5KCkge1xuICAgIHBsdXMucnVudGltZS5nZXRQcm9wZXJ0eShwbHVzLnJ1bnRpbWUuYXBwaWQsICh3Z3RpbmZvKSA9PiB7XG4gICAgICB0aGlzLnN0YXREYXRhLnYgPSB3Z3RpbmZvLnZlcnNpb24gfHwgJyc7XG4gICAgICB0aGlzLmdldE5ldHdvcmtJbmZvKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRMb2NhdGlvbigpIHtcbiAgICBpZiAoc3RhdENvbmZpZy5nZXRMb2NhdGlvbikge1xuICAgICAgdW5pLmdldExvY2F0aW9uKHtcbiAgICAgICAgdHlwZTogJ3dnczg0JyxcbiAgICAgICAgZ2VvY29kZTogdHJ1ZSxcbiAgICAgICAgc3VjY2VzczogKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGlmIChyZXN1bHQuYWRkcmVzcykge1xuICAgICAgICAgICAgdGhpcy5zdGF0RGF0YS5jbiA9IHJlc3VsdC5hZGRyZXNzLmNvdW50cnk7XG4gICAgICAgICAgICB0aGlzLnN0YXREYXRhLnBuID0gcmVzdWx0LmFkZHJlc3MucHJvdmluY2U7XG4gICAgICAgICAgICB0aGlzLnN0YXREYXRhLmN0ID0gcmVzdWx0LmFkZHJlc3MuY2l0eTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnN0YXREYXRhLmxhdCA9IHJlc3VsdC5sYXRpdHVkZTtcbiAgICAgICAgICB0aGlzLnN0YXREYXRhLmxuZyA9IHJlc3VsdC5sb25naXR1ZGU7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0KHRoaXMuc3RhdERhdGEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0RGF0YS5sYXQgPSAwO1xuICAgICAgdGhpcy5zdGF0RGF0YS5sbmcgPSAwO1xuICAgICAgdGhpcy5yZXF1ZXN0KHRoaXMuc3RhdERhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHJlcXVlc3QoZGF0YSwgdHlwZSkge1xuICAgIGxldCB0aW1lID0gZ2V0VGltZSgpO1xuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5fbmF2aWdhdGlvbkJhclRpdGxlO1xuICAgIGRhdGEudHRuID0gdGl0bGUucGFnZTtcbiAgICBkYXRhLnR0cGogPSB0aXRsZS5jb25maWc7XG4gICAgZGF0YS50dGMgPSB0aXRsZS5yZXBvcnQ7XG5cbiAgICBsZXQgcmVxdWVzdERhdGEgPSB0aGlzLl9yZXBvcnRpbmdSZXF1ZXN0RGF0YTtcbiAgICBpZiAoZ2V0UGxhdGZvcm1OYW1lKCkgPT09ICduJykge1xuICAgICAgcmVxdWVzdERhdGEgPSB1bmkuZ2V0U3RvcmFnZVN5bmMoJ19fVU5JX19TVEFUX19EQVRBJykgfHwge307XG4gICAgfVxuICAgIGlmICghcmVxdWVzdERhdGFbZGF0YS5sdF0pIHtcbiAgICAgIHJlcXVlc3REYXRhW2RhdGEubHRdID0gW107XG4gICAgfVxuICAgIHJlcXVlc3REYXRhW2RhdGEubHRdLnB1c2goZGF0YSk7XG5cbiAgICBpZiAoZ2V0UGxhdGZvcm1OYW1lKCkgPT09ICduJykge1xuICAgICAgdW5pLnNldFN0b3JhZ2VTeW5jKCdfX1VOSV9fU1RBVF9fREFUQScsIHJlcXVlc3REYXRhKTtcbiAgICB9XG4gICAgaWYgKGdldFBhZ2VSZXNpZGVuY2VUaW1lKCkgPCBPUEVSQVRJTkdfVElNRSAmJiAhdHlwZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxldCB1bmlTdGF0RGF0YSA9IHRoaXMuX3JlcG9ydGluZ1JlcXVlc3REYXRhO1xuICAgIGlmIChnZXRQbGF0Zm9ybU5hbWUoKSA9PT0gJ24nKSB7XG4gICAgICB1bmlTdGF0RGF0YSA9IHVuaS5nZXRTdG9yYWdlU3luYygnX19VTklfX1NUQVRfX0RBVEEnKTtcbiAgICB9XG4gICAgLy8g5pe26Ze06LaF6L+H77yM6YeN5paw6I635Y+W5pe26Ze05oizXG4gICAgc2V0UGFnZVJlc2lkZW5jZVRpbWUoKTtcbiAgICBsZXQgZmlyc3RBcnIgPSBbXTtcbiAgICBsZXQgY29udGVudEFyciA9IFtdO1xuICAgIGxldCBsYXN0QXJyID0gW107XG5cbiAgICBmb3IgKGxldCBpIGluIHVuaVN0YXREYXRhKSB7XG4gICAgICBjb25zdCByZCA9IHVuaVN0YXREYXRhW2ldO1xuICAgICAgcmQuZm9yRWFjaCgoZWxtKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGEgPSBnZXRTcGxpY2luZyhlbG0pO1xuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgIGZpcnN0QXJyLnB1c2gobmV3RGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gMykge1xuICAgICAgICAgIGxhc3RBcnIucHVzaChuZXdEYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250ZW50QXJyLnB1c2gobmV3RGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZpcnN0QXJyLnB1c2goLi4uY29udGVudEFyciwgLi4ubGFzdEFycik7XG4gICAgbGV0IG9wdGlvbnNEYXRhID0ge1xuICAgICAgdXN2OiBTVEFUX1ZFUlNJT04sIC8v57uf6K6hIFNESyDniYjmnKzlj7dcbiAgICAgIHQ6IHRpbWUsIC8v5Y+R6YCB6K+35rGC5pe255qE5pe26Ze05oiuXG4gICAgICByZXF1ZXN0czogSlNPTi5zdHJpbmdpZnkoZmlyc3RBcnIpLFxuICAgIH07XG5cbiAgICB0aGlzLl9yZXBvcnRpbmdSZXF1ZXN0RGF0YSA9IHt9O1xuICAgIGlmIChnZXRQbGF0Zm9ybU5hbWUoKSA9PT0gJ24nKSB7XG4gICAgICB1bmkucmVtb3ZlU3RvcmFnZVN5bmMoJ19fVU5JX19TVEFUX19EQVRBJyk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEudXQgPT09ICdoNScpIHtcbiAgICAgIHRoaXMuaW1hZ2VSZXF1ZXN0KG9wdGlvbnNEYXRhKTtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChnZXRQbGF0Zm9ybU5hbWUoKSA9PT0gJ24nICYmIHRoaXMuc3RhdERhdGEucCA9PT0gJ2EnKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fc2VuZFJlcXVlc3Qob3B0aW9uc0RhdGEpO1xuICAgICAgfSwgMjAwKTtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLl9zZW5kUmVxdWVzdChvcHRpb25zRGF0YSk7XG4gIH1cbiAgX3NlbmRSZXF1ZXN0KG9wdGlvbnNEYXRhKSB7XG4gICAgdW5pLnJlcXVlc3Qoe1xuICAgICAgdXJsOiBTVEFUX1VSTCxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgLy8gaGVhZGVyOiB7XG4gICAgICAvLyAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgLy8g6buY6K6k5YC8XG4gICAgICAvLyB9LFxuICAgICAgZGF0YTogb3B0aW9uc0RhdGEsXG4gICAgICBzdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgIC8vIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKCdzdGF0IHJlcXVlc3Qgc3VjY2VzcycpO1xuICAgICAgICAvLyB9XG4gICAgICB9LFxuICAgICAgZmFpbDogKGUpID0+IHtcbiAgICAgICAgaWYgKCsrdGhpcy5fcmV0cnkgPCAzKSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zZW5kUmVxdWVzdChvcHRpb25zRGF0YSk7XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogaDUg6K+35rGCXG4gICAqL1xuICBpbWFnZVJlcXVlc3QoZGF0YSkge1xuICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgIGxldCBvcHRpb25zID0gZ2V0U2dpbihHZXRFbmNvZGVVUklDb21wb25lbnRPcHRpb25zKGRhdGEpKS5vcHRpb25zO1xuICAgIGltYWdlLnNyYyA9IFNUQVRfSDVfVVJMICsgJz8nICsgb3B0aW9ucztcbiAgfVxuXG4gIHNlbmRFdmVudChrZXksIHZhbHVlKSB7XG4gICAgLy8g5qCh6aqMIHR5cGUg5Y+C5pWwXG4gICAgaWYgKGNhbGlicmF0aW9uKGtleSwgdmFsdWUpKSByZXR1cm5cblxuICAgIGlmIChrZXkgPT09ICd0aXRsZScpIHtcbiAgICAgIHRoaXMuX25hdmlnYXRpb25CYXJUaXRsZS5yZXBvcnQgPSB2YWx1ZTtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLl9zZW5kRXZlbnRSZXF1ZXN0KHtcbiAgICAgIGtleSxcbiAgICAgIHZhbHVlOiB0eXBlb2YodmFsdWUpID09PSAnb2JqZWN0JyA/IEpTT04uc3RyaW5naWZ5KHZhbHVlKSA6IHZhbHVlXG4gICAgfSwgMSk7XG4gIH1cbn1cblxuXG5jbGFzcyBTdGF0IGV4dGVuZHMgVXRpbCB7XG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgU3RhdCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfVxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuICAgIC8vIOazqOWGjOaLpuaIquWZqFxuICAgIGlmICh0eXBlb2YgdW5pLmFkZEludGVyY2VwdG9yID09PSAnZnVuY3Rpb24nICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICB0aGlzLmFkZEludGVyY2VwdG9ySW5pdCgpO1xuICAgICAgdGhpcy5pbnRlcmNlcHRMb2dpbigpO1xuICAgICAgdGhpcy5pbnRlcmNlcHRTaGFyZSh0cnVlKTtcbiAgICAgIHRoaXMuaW50ZXJjZXB0UmVxdWVzdFBheW1lbnQoKTtcbiAgICB9XG4gIH1cblxuICBhZGRJbnRlcmNlcHRvckluaXQoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIHVuaS5hZGRJbnRlcmNlcHRvcignc2V0TmF2aWdhdGlvbkJhclRpdGxlJywge1xuICAgICAgaW52b2tlKGFyZ3MpIHtcbiAgICAgICAgc2VsZi5fbmF2aWdhdGlvbkJhclRpdGxlLnBhZ2UgPSBhcmdzLnRpdGxlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaW50ZXJjZXB0TG9naW4oKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIHVuaS5hZGRJbnRlcmNlcHRvcignbG9naW4nLCB7XG4gICAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgc2VsZi5fbG9naW4oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGludGVyY2VwdFNoYXJlKHR5cGUpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCF0eXBlKSB7XG4gICAgICBzZWxmLl9zaGFyZSgpO1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHVuaS5hZGRJbnRlcmNlcHRvcignc2hhcmUnLCB7XG4gICAgICBzdWNjZXNzKCkge1xuICAgICAgICBzZWxmLl9zaGFyZSgpO1xuICAgICAgfSxcbiAgICAgIGZhaWwoKSB7XG4gICAgICAgIHNlbGYuX3NoYXJlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBpbnRlcmNlcHRSZXF1ZXN0UGF5bWVudCgpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgdW5pLmFkZEludGVyY2VwdG9yKCdyZXF1ZXN0UGF5bWVudCcsIHtcbiAgICAgIHN1Y2Nlc3MoKSB7XG4gICAgICAgIHNlbGYuX3BheW1lbnQoJ3BheV9zdWNjZXNzJyk7XG4gICAgICB9LFxuICAgICAgZmFpbCgpIHtcbiAgICAgICAgc2VsZi5fcGF5bWVudCgncGF5X2ZhaWwnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlcG9ydChvcHRpb25zLCBzZWxmKSB7XG4gICAgdGhpcy5zZWxmID0gc2VsZjtcbiAgICAvLyBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdyZXBvcnQgaW5pdCcpO1xuICAgIC8vIH1cbiAgICBzZXRQYWdlUmVzaWRlbmNlVGltZSgpO1xuICAgIHRoaXMuX19saWNhdGlvblNob3cgPSB0cnVlO1xuICAgIHRoaXMuX3NlbmRSZXBvcnRSZXF1ZXN0KG9wdGlvbnMsIHRydWUpO1xuICB9XG5cbiAgbG9hZChvcHRpb25zLCBzZWxmKSB7XG4gICAgaWYgKCFzZWxmLiRzY29wZSAmJiAhc2VsZi4kbXApIHtcbiAgICAgIGNvbnN0IHBhZ2UgPSBnZXRDdXJyZW50UGFnZXMoKTtcbiAgICAgIHNlbGYuJHNjb3BlID0gcGFnZVtwYWdlLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICB0aGlzLnNlbGYgPSBzZWxmO1xuICAgIHRoaXMuX3F1ZXJ5ID0gb3B0aW9ucztcbiAgfVxuXG4gIHNob3coc2VsZikge1xuICAgIHRoaXMuc2VsZiA9IHNlbGY7XG4gICAgaWYgKGdldFBhZ2VUeXBlcyhzZWxmKSkge1xuICAgICAgdGhpcy5fcGFnZVNob3coc2VsZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FwcGxpY2F0aW9uU2hvdyhzZWxmKTtcbiAgICB9XG4gIH1cblxuICByZWFkeShzZWxmKSB7XG4gICAgLy8gdGhpcy5zZWxmID0gc2VsZjtcbiAgICAvLyBpZiAoZ2V0UGFnZVR5cGVzKHNlbGYpKSB7XG4gICAgLy8gICB0aGlzLl9wYWdlU2hvdyhzZWxmKTtcbiAgICAvLyB9XG4gIH1cbiAgaGlkZShzZWxmKSB7XG4gICAgdGhpcy5zZWxmID0gc2VsZjtcbiAgICBpZiAoZ2V0UGFnZVR5cGVzKHNlbGYpKSB7XG4gICAgICB0aGlzLl9wYWdlSGlkZShzZWxmKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXBwbGljYXRpb25IaWRlKHNlbGYsIHRydWUpO1xuICAgIH1cbiAgfVxuICBlcnJvcihlbSkge1xuICAgIGlmICh0aGlzLl9wbGF0Zm9ybSA9PT0gJ2RldnRvb2xzJykge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygn5b2T5YmN6L+Q6KGM546v5aKD5Li65byA5Y+R6ICF5bel5YW377yM5LiN5LiK5oql5pWw5o2u44CCJyk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm47XG4gICAgfVxuICAgIGxldCBlbVZhbCA9ICcnO1xuICAgIGlmICghZW0ubWVzc2FnZSkge1xuICAgICAgZW1WYWwgPSBKU09OLnN0cmluZ2lmeShlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVtVmFsID0gZW0uc3RhY2s7XG4gICAgfVxuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgYWs6IHRoaXMuc3RhdERhdGEuYWssXG4gICAgICB1dWlkOiB0aGlzLnN0YXREYXRhLnV1aWQsXG4gICAgICBsdDogJzMxJyxcbiAgICAgIHV0OiB0aGlzLnN0YXREYXRhLnV0LFxuICAgICAgY2g6IHRoaXMuc3RhdERhdGEuY2gsXG4gICAgICBtcHNkazogdGhpcy5zdGF0RGF0YS5tcHNkayxcbiAgICAgIG1wdjogdGhpcy5zdGF0RGF0YS5tcHYsXG4gICAgICB2OiB0aGlzLnN0YXREYXRhLnYsXG4gICAgICBlbTogZW1WYWwsXG4gICAgICB1c3Y6IHRoaXMuc3RhdERhdGEudXN2LFxuICAgICAgdDogZ2V0VGltZSgpLFxuICAgICAgcDogdGhpcy5zdGF0RGF0YS5wXG4gICAgfTtcbiAgICB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cbn1cblxuY29uc3Qgc3RhdCA9IFN0YXQuZ2V0SW5zdGFuY2UoKTtcbmxldCBpc0hpZGUgPSBmYWxzZTtcbmNvbnN0IGxpZmVjeWNsZSA9IHtcbiAgb25MYXVuY2gob3B0aW9ucykge1xuICAgIHN0YXQucmVwb3J0KG9wdGlvbnMsIHRoaXMpO1xuICB9LFxuICBvblJlYWR5KCkge1xuICAgIHN0YXQucmVhZHkodGhpcyk7XG4gIH0sXG4gIG9uTG9hZChvcHRpb25zKSB7XG4gICAgc3RhdC5sb2FkKG9wdGlvbnMsIHRoaXMpO1xuICAgIC8vIOmHjeWGmeWIhuS6q++8jOiOt+WPluWIhuS6q+S4iuaKpeS6i+S7tlxuICAgIGlmICh0aGlzLiRzY29wZSAmJiB0aGlzLiRzY29wZS5vblNoYXJlQXBwTWVzc2FnZSkge1xuICAgICAgbGV0IG9sZFNoYXJlQXBwTWVzc2FnZSA9IHRoaXMuJHNjb3BlLm9uU2hhcmVBcHBNZXNzYWdlO1xuICAgICAgdGhpcy4kc2NvcGUub25TaGFyZUFwcE1lc3NhZ2UgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHN0YXQuaW50ZXJjZXB0U2hhcmUoZmFsc2UpO1xuICAgICAgICByZXR1cm4gb2xkU2hhcmVBcHBNZXNzYWdlLmNhbGwodGhpcywgb3B0aW9ucylcbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBvblNob3coKSB7XG4gICAgaXNIaWRlID0gZmFsc2U7XG4gICAgc3RhdC5zaG93KHRoaXMpO1xuICB9LFxuICBvbkhpZGUoKSB7XG4gICAgaXNIaWRlID0gdHJ1ZTtcbiAgICBzdGF0LmhpZGUodGhpcyk7XG4gIH0sXG4gIG9uVW5sb2FkKCkge1xuICAgIGlmIChpc0hpZGUpIHtcbiAgICAgIGlzSGlkZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHN0YXQuaGlkZSh0aGlzKTtcbiAgfSxcbiAgb25FcnJvcihlKSB7XG4gICAgc3RhdC5lcnJvcihlKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgdW5pLnJlcG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG9wdGlvbnMpIHt9O1xuICB9ZWxzZXtcbiAgICBjb25zdCBWdWUgPSByZXF1aXJlKCd2dWUnKTtcbiAgICAoVnVlLmRlZmF1bHQgfHwgVnVlKS5taXhpbihsaWZlY3ljbGUpO1xuICAgIHVuaS5yZXBvcnQgPSBmdW5jdGlvbih0eXBlLCBvcHRpb25zKSB7XG4gICAgICBzdGF0LnNlbmRFdmVudCh0eXBlLCBvcHRpb25zKTtcbiAgICB9O1xuICB9XG59XG5cbm1haW4oKTtcbiIsImV4cG9ydCBkZWZhdWx0IHtcImFwcGlkXCI6XCJfX1VOSV9fQzc1RjU4MVwifSIsIi8qIGdsb2JhbHMgX19WVUVfU1NSX0NPTlRFWFRfXyAqL1xuXG4vLyBJTVBPUlRBTlQ6IERvIE5PVCB1c2UgRVMyMDE1IGZlYXR1cmVzIGluIHRoaXMgZmlsZSAoZXhjZXB0IGZvciBtb2R1bGVzKS5cbi8vIFRoaXMgbW9kdWxlIGlzIGEgcnVudGltZSB1dGlsaXR5IGZvciBjbGVhbmVyIGNvbXBvbmVudCBtb2R1bGUgb3V0cHV0IGFuZCB3aWxsXG4vLyBiZSBpbmNsdWRlZCBpbiB0aGUgZmluYWwgd2VicGFjayB1c2VyIGJ1bmRsZS5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm9ybWFsaXplQ29tcG9uZW50IChcbiAgc2NyaXB0RXhwb3J0cyxcbiAgcmVuZGVyLFxuICBzdGF0aWNSZW5kZXJGbnMsXG4gIGZ1bmN0aW9uYWxUZW1wbGF0ZSxcbiAgaW5qZWN0U3R5bGVzLFxuICBzY29wZUlkLFxuICBtb2R1bGVJZGVudGlmaWVyLCAvKiBzZXJ2ZXIgb25seSAqL1xuICBzaGFkb3dNb2RlIC8qIHZ1ZS1jbGkgb25seSAqL1xuKSB7XG4gIC8vIFZ1ZS5leHRlbmQgY29uc3RydWN0b3IgZXhwb3J0IGludGVyb3BcbiAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygc2NyaXB0RXhwb3J0cyA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gc2NyaXB0RXhwb3J0cy5vcHRpb25zXG4gICAgOiBzY3JpcHRFeHBvcnRzXG5cbiAgLy8gcmVuZGVyIGZ1bmN0aW9uc1xuICBpZiAocmVuZGVyKSB7XG4gICAgb3B0aW9ucy5yZW5kZXIgPSByZW5kZXJcbiAgICBvcHRpb25zLnN0YXRpY1JlbmRlckZucyA9IHN0YXRpY1JlbmRlckZuc1xuICAgIG9wdGlvbnMuX2NvbXBpbGVkID0gdHJ1ZVxuICB9XG5cbiAgLy8gZnVuY3Rpb25hbCB0ZW1wbGF0ZVxuICBpZiAoZnVuY3Rpb25hbFRlbXBsYXRlKSB7XG4gICAgb3B0aW9ucy5mdW5jdGlvbmFsID0gdHJ1ZVxuICB9XG5cbiAgLy8gc2NvcGVkSWRcbiAgaWYgKHNjb3BlSWQpIHtcbiAgICBvcHRpb25zLl9zY29wZUlkID0gJ2RhdGEtdi0nICsgc2NvcGVJZFxuICB9XG5cbiAgdmFyIGhvb2tcbiAgaWYgKG1vZHVsZUlkZW50aWZpZXIpIHsgLy8gc2VydmVyIGJ1aWxkXG4gICAgaG9vayA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgICAvLyAyLjMgaW5qZWN0aW9uXG4gICAgICBjb250ZXh0ID1cbiAgICAgICAgY29udGV4dCB8fCAvLyBjYWNoZWQgY2FsbFxuICAgICAgICAodGhpcy4kdm5vZGUgJiYgdGhpcy4kdm5vZGUuc3NyQ29udGV4dCkgfHwgLy8gc3RhdGVmdWxcbiAgICAgICAgKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiR2bm9kZSAmJiB0aGlzLnBhcmVudC4kdm5vZGUuc3NyQ29udGV4dCkgLy8gZnVuY3Rpb25hbFxuICAgICAgLy8gMi4yIHdpdGggcnVuSW5OZXdDb250ZXh0OiB0cnVlXG4gICAgICBpZiAoIWNvbnRleHQgJiYgdHlwZW9mIF9fVlVFX1NTUl9DT05URVhUX18gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnRleHQgPSBfX1ZVRV9TU1JfQ09OVEVYVF9fXG4gICAgICB9XG4gICAgICAvLyBpbmplY3QgY29tcG9uZW50IHN0eWxlc1xuICAgICAgaWYgKGluamVjdFN0eWxlcykge1xuICAgICAgICBpbmplY3RTdHlsZXMuY2FsbCh0aGlzLCBjb250ZXh0KVxuICAgICAgfVxuICAgICAgLy8gcmVnaXN0ZXIgY29tcG9uZW50IG1vZHVsZSBpZGVudGlmaWVyIGZvciBhc3luYyBjaHVuayBpbmZlcnJlbmNlXG4gICAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0Ll9yZWdpc3RlcmVkQ29tcG9uZW50cykge1xuICAgICAgICBjb250ZXh0Ll9yZWdpc3RlcmVkQ29tcG9uZW50cy5hZGQobW9kdWxlSWRlbnRpZmllcilcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gdXNlZCBieSBzc3IgaW4gY2FzZSBjb21wb25lbnQgaXMgY2FjaGVkIGFuZCBiZWZvcmVDcmVhdGVcbiAgICAvLyBuZXZlciBnZXRzIGNhbGxlZFxuICAgIG9wdGlvbnMuX3NzclJlZ2lzdGVyID0gaG9va1xuICB9IGVsc2UgaWYgKGluamVjdFN0eWxlcykge1xuICAgIGhvb2sgPSBzaGFkb3dNb2RlXG4gICAgICA/IGZ1bmN0aW9uICgpIHsgaW5qZWN0U3R5bGVzLmNhbGwodGhpcywgdGhpcy4kcm9vdC4kb3B0aW9ucy5zaGFkb3dSb290KSB9XG4gICAgICA6IGluamVjdFN0eWxlc1xuICB9XG5cbiAgaWYgKGhvb2spIHtcbiAgICBpZiAob3B0aW9ucy5mdW5jdGlvbmFsKSB7XG4gICAgICAvLyBmb3IgdGVtcGxhdGUtb25seSBob3QtcmVsb2FkIGJlY2F1c2UgaW4gdGhhdCBjYXNlIHRoZSByZW5kZXIgZm4gZG9lc24ndFxuICAgICAgLy8gZ28gdGhyb3VnaCB0aGUgbm9ybWFsaXplclxuICAgICAgb3B0aW9ucy5faW5qZWN0U3R5bGVzID0gaG9va1xuICAgICAgLy8gcmVnaXN0ZXIgZm9yIGZ1bmN0aW9hbCBjb21wb25lbnQgaW4gdnVlIGZpbGVcbiAgICAgIHZhciBvcmlnaW5hbFJlbmRlciA9IG9wdGlvbnMucmVuZGVyXG4gICAgICBvcHRpb25zLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcldpdGhTdHlsZUluamVjdGlvbiAoaCwgY29udGV4dCkge1xuICAgICAgICBob29rLmNhbGwoY29udGV4dClcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsUmVuZGVyKGgsIGNvbnRleHQpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGluamVjdCBjb21wb25lbnQgcmVnaXN0cmF0aW9uIGFzIGJlZm9yZUNyZWF0ZSBob29rXG4gICAgICB2YXIgZXhpc3RpbmcgPSBvcHRpb25zLmJlZm9yZUNyZWF0ZVxuICAgICAgb3B0aW9ucy5iZWZvcmVDcmVhdGUgPSBleGlzdGluZ1xuICAgICAgICA/IFtdLmNvbmNhdChleGlzdGluZywgaG9vaylcbiAgICAgICAgOiBbaG9va11cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGV4cG9ydHM6IHNjcmlwdEV4cG9ydHMsXG4gICAgb3B0aW9uczogb3B0aW9uc1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9