/* eslint-disable no-param-reassign */
const jsStringify = require('javascript-stringify')
const clone = require('clone')

const STRIP_START = '___9kBwmuyimFJMIiFk___'
const STRIP_END = '___grOtJROUE6955mGv___'

const replacer = (value, indent, stringify) => {
  if (value.$ !== undefined) {
    value[`${STRIP_START}toString${STRIP_END}`] = `${STRIP_START}() => "${value.$}"${STRIP_END}`
    delete value.$
  }
  return stringify(value)
}

const transform = (parent, key, o) => {
  const n = Object.keys(o).length
  if (o.$) {
    if (n === 1) {
      if (parent) {
        parent[key] = o.$
      }
    }
  }
  Object.keys(o).forEach(k => (typeof o[k] === 'object') && transform(o, k, o[k]))
}

const toJs = (input) => {
  const obj = clone(input)
  transform(null, null, obj)
  let jsStr = jsStringify(obj, replacer, 2)
  const startPatternWithQuote = new RegExp(`'${STRIP_START}`, 'g')
  const endPatternWithQuote = new RegExp(`${STRIP_END}'`, 'g')
  const startPattern = new RegExp(STRIP_START, 'g')
  const endPattern = new RegExp(STRIP_END, 'g')
  jsStr = jsStr.replace(startPatternWithQuote, '')
  jsStr = jsStr.replace(endPatternWithQuote, '')
  jsStr = jsStr.replace(startPattern, '')
  jsStr = jsStr.replace(endPattern, '')
  jsStr = `module.exports = ${jsStr}`

  return jsStr
}

module.exports = toJs
