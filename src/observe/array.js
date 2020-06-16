let oldArrayMethods = Array.prototype// 获取数组原型方法
// 创建一个全新得对象，可以找到数组原型上得方法，而且修改对象是不会影响原有得数组原型方法
export let arrMethods = Object.create(oldArrayMethods)

let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice'
]

methods.forEach(method => {
  arrMethods[method] = function (...args) { //函数劫持
    //当用户调用数组方法是，会先执行我定义得逻辑，再执行原有数组默认得逻辑
    const ob = this.__ob__
    const result = oldArrayMethods[method].apply(this, args)
    // push pop splice  都可以新增属性 （新增得属性可能是一个对象类型）
    // 内部对数组中应用类型也做了一次劫持
    let inserted
    switch (method) {
      case 'push':
      case'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }
    // console.log(inserted)
    inserted && ob.observeArray(inserted)
    return result
  }
})
