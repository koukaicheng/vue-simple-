import { initState } from './state'
import { getOuterHTML, query } from './utils/index'
import { compilerToFunctions } from './compiler/index'

export function initMixin (Vue) {
  //初始化流程
  Vue.prototype._init = function (options) {
    const vm = this
    //Vue中使用this.$options  指代的就是用户传递的属性
    vm.$options = options
    //初始化状态 数据劫持得开始
    initState(vm)
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    el = el && query(el)
    if (el === document.body || el === document.documentElement) {
      console.log(`不要将vue得实例挂载到 <html> 和 <body>上 而是挂载到普通元素上`)
      return
    }
    const options = this.$options
    // 无论是单文件开发或者是写了el或者template字符串，最终都会走render方法
    // 如果用户没有传入render 使用template
    if (!options.render) {
      let template = options.template
      //如果没有传入template 则使用外部模板 id="app"
      if (!template && el) {
        template = getOuterHTML(el)
      }
      options.render = compilerToFunctions(template)
    }

  }
}

