export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isArray (val) {
  return Object.prototype.toString.call(val) === '[object Array]'
}

export function query (el) {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      return document.createElement('div')
    }
    return selected
  }
  return el
}

export function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  }
  const container = document.createElement('div')
  container.appendChild(el.clone())
  return container.innerHTML
}
