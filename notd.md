1. rollup (打包工具)
2. @babel/core (babel核心模块)
3. @babel/preset-env (babel将高级语法转为低级语法)
4. rollup-plugin-babel (rollup和babel之间得桥梁)
5. rollup-plugin-serve (实现静态服务)
6. cross-env (设置环境变量)




 vue得响应原理：vue会在初始化数据得时候依次对data返回得属性进行数据劫持，核心原理就是Object,defineProperty把data返回得数据重新定义,
  对于复杂类型得数据，比如数组或者对象，会采用递归属性进行劫持。对于数组数据得劫持：重写并劫持数组得原型方法，并不会改变原有得数据原型方法，而是在每次使用特定得一些数组方法时，比如 push unshift 
  splice，对新增得每一项进行观测。这也就说明了为什么给在vue当前实例中直接用索引修改数组不会触发更新得原因
