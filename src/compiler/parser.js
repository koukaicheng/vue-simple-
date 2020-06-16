//字母a-zA-Z_ - . 数组小写字母 大写字母
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 标签名
// ?:匹配不捕获   <aaa:aaa>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// startTagOpen 可以匹配到开始标签 正则捕获到的内容是 (标签名)
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名
// 闭合标签 </xxxxxxx>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的 </div>
// <div aa   =   "123"  bb=123  cc='123'
// 捕获到的是 属性名 和 属性值 arguments[1] || arguments[2] || arguments[2]
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性的
// <div >   <br/>
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的 >
// 匹配动态变量的  +? 尽可能少匹配
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseHTML(html) {
  let root; //树根
  let currentParent; //当前父级
  let stack = [] // 判断标签是否闭合

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      attrs,
      children: [],
      parent: null,
      type: 1 // 1普通元素 3文本
    }
  }

  //开始标签，每次开始解析标签都会执行此方法
  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }

  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        console.log(endTagMatch)
        advance(endTagMatch[0].length)
      }
    }
    let text;

    if (textEnd > 0) {
      // console.log(textEnd)
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
    }
  }

  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute)) || (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
}
