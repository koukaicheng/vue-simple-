// Vue 声明
import { initMixin } from './init'

function Vue (options) {
  this._init(options)
}

initMixin(Vue) //给vue原型上添加一个_init方法

export default Vue
