//把data中的数据，都是用Object.defineProperty重新定义
//Object.defineProperty 不能兼容ie8
import { isObject, isArray } from '../utils/index'
import { arrMethods } from './array'

class Observer {
  constructor (data) {
    //对数组索引进行拦截 性能差
    //相当于在数据上增加__ob__这个属性，指向得是Observe
    this.value = data;
    Object.defineProperty(data, '__ob__', {
      enumerable: false, //不可枚举
      configurable: false, // 不可配置
      value: this
    })
    if (isArray(data)) {
      data.__proto__ = arrMethods
      this.observeArray(data)
    } else {
      this.walk(data) //
    }
  }

  walk (data) {
    Object.keys(data).forEach(key => {
      let value = data[key]
      defineReactive(data, key, value)
    })
  }

  observeArray (data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i])
    }
  }

}

function defineReactive (data, key, value) {
  observe(value) //递归实现深度检测
  Object.defineProperty(data, key, {
    get () {
      return value
    },
    set (newValue) {
      console.log(newValue)
      if (newValue === value) return
      observe(newValue)
      value = newValue
    }
  })
}

export function observe (data) {
  if (!isObject(data)) {
    return
  }
  if(data.__ob__ instanceof Observer){ // 防止对象被重复观测
    return ;
  }
  return new Observer(data)
}
