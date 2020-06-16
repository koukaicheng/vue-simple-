import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

console.log(process.env.ENV)
export default {
  input: './src/index.js',  //打包入口
  output: {
    file: 'dist/umd/vue.js', // 出口
    name: 'Vue', //指定打包后全局变量得名字
    format: 'umd', //统一模块规范
    sourcemap: true, //es6-es5,开启源码调试，可以找到源代码得报错位置
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.ENV === 'development' ? serve({
      open: true,
      openPage: '/public/index.html',// 默认打开html得路径
      port: 8000,
      contentBase: ''
    }) : null
  ]
}
