(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(obj) {
    return obj !== null && _typeof(obj) === 'object';
  }
  function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
  }
  function query(el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);

      if (!selected) {
        return document.createElement('div');
      }

      return selected;
    }

    return el;
  }
  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML;
    }

    var container = document.createElement('div');
    container.appendChild(el.clone());
    return container.innerHTML;
  }

  var oldArrayMethods = Array.prototype; // 获取数组原型方法
  // 创建一个全新得对象，可以找到数组原型上得方法，而且修改对象是不会影响原有得数组原型方法

  var arrMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
  methods.forEach(function (method) {
    arrMethods[method] = function () {
      //函数劫持
      //当用户调用数组方法是，会先执行我定义得逻辑，再执行原有数组默认得逻辑
      var ob = this.__ob__;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); // push pop splice  都可以新增属性 （新增得属性可能是一个对象类型）
      // 内部对数组中应用类型也做了一次劫持

      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      } // console.log(inserted)


      inserted && ob.observeArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      //对数组索引进行拦截 性能差
      //相当于在数据上增加__ob__这个属性，指向得是Observe
      this.value = data;
      Object.defineProperty(data, '__ob__', {
        enumerable: false,
        //不可枚举
        configurable: false,
        // 不可配置
        value: this
      });

      if (isArray(data)) {
        data.__proto__ = arrMethods;
        this.observeArray(data);
      } else {
        this.walk(data); //
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          var value = data[key];
          defineReactive(data, key, value);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        for (var i = 0; i < data.length; i++) {
          observe(data[i]);
        }
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); //递归实现深度检测

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        console.log(newValue);
        if (newValue === value) return;
        observe(newValue);
        value = newValue;
      }
    });
  }

  function observe(data) {
    if (!isObject(data)) {
      return;
    }

    if (data.__ob__ instanceof Observer) {
      // 防止对象被重复观测
      return;
    }

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; //vue的数据来源: 属性 方法 数据 计算属性  watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    //数据初始化工作
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; //对象劫持，用户改变了数据，可以得到通知 =》 刷新页面
    //Object.defineProperty() 给属性增加get 和set方法

    observe(data);
  }

  //字母a-zA-Z_ - . 数组小写字母 大写字母
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名
  // ?:匹配不捕获   <aaa:aaa>

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // startTagOpen 可以匹配到开始标签 正则捕获到的内容是 (标签名)

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名
  // 闭合标签 </xxxxxxx>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>
  // <div aa   =   "123"  bb=123  cc='123'
  // 捕获到的是 属性名 和 属性值 arguments[1] || arguments[2] || arguments[2]

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
  // <div >   <br/>

  var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  function parseHTML(html) {


    function start(tagName, attrs) {
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          console.log(endTagMatch);
          advance(endTagMatch[0].length);
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        // console.log(textEnd)
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        var end, attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute)) || (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (end) {
          advance(end[0].length);
          return match;
        }
      }
    }
  }

  function compilerToFunctions(template) {
    var ast = parseHTML(template);
    return '';
  }

  function initMixin(Vue) {
    //初始化流程
    Vue.prototype._init = function (options) {
      var vm = this; //Vue中使用this.$options  指代的就是用户传递的属性

      vm.$options = options; //初始化状态 数据劫持得开始

      initState(vm);

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      el = el && query(el);

      if (el === document.body || el === document.documentElement) {
        console.log("\u4E0D\u8981\u5C06vue\u5F97\u5B9E\u4F8B\u6302\u8F7D\u5230 <html> \u548C <body>\u4E0A \u800C\u662F\u6302\u8F7D\u5230\u666E\u901A\u5143\u7D20\u4E0A");
        return;
      }

      var options = this.$options; // 无论是单文件开发或者是写了el或者template字符串，最终都会走render方法
      // 如果用户没有传入render 使用template

      if (!options.render) {
        var template = options.template; //如果没有传入template 则使用外部模板 id="app"

        if (!template && el) {
          template = getOuterHTML(el);
        }

        options.render = compilerToFunctions(template);
      }
    };
  }

  // Vue 声明

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); //给vue原型上添加一个_init方法

  return Vue;

})));
//# sourceMappingURL=vue.js.map
