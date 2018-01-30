/* eslint-disable no-unused-vars */
const postcss = require('postcss')
const parser = require('postcss-selector-parser')
const objectPath = require('object-path')
const fs = require('fs')
const util = require('./util')

const DEFAULT_ELEMENT = '__'
const DEFAULT_MODIFIER = '--'

const beginsWith = (haystack, needle) => haystack.indexOf(needle) === 0

module.exports = postcss.plugin('postcss-bemit-to-json', (o) => {
  const opts = o || {}
  const optPrefixMap = opts.prefixMap
  const optReplace = opts.replace || {}
  const prefixKeys = optPrefixMap && Object.keys(optPrefixMap)

  const edel = DEFAULT_ELEMENT
  const mdel = DEFAULT_MODIFIER

  const ejsdel = '_'
  const mjsdel = '$'

  return (root, result) => {
    const output = {
    }

    const classNames = {}

    const processReplace = (str) => {
      let out = str
      Object.keys(optReplace).forEach((key) => {
        out = out.replace(key, optReplace[key])
      })
      return out
    }

    const elementKeyTransform = str => processReplace(util.toCamelCase(str))
    const blockKeyTransform = str => processReplace(util.toUpperCamelCase(str))

    const unescape = str => str.replace(/\\/g, '')

    const sanitise = str => str.replace('-', '')

    const setOutput = (inputPath, value) => {
      const path = inputPath
      let prefix = ''
      if (optPrefixMap && path && path.length > 0) {
        prefixKeys.forEach((key) => {
          if (beginsWith(path[0], key)) {
            path[0] = path[0].substr(key.length)
            prefix = optPrefixMap[key]
          }
        })
      }
      const transformedPath = path.map((p, i) =>
        sanitise(i === 0 ?
          `${prefix}${blockKeyTransform(p)}` :
          elementKeyTransform(p)))

      objectPath.set(output, transformedPath, unescape(value))
    }

    const processClassNode = (classNode) => {
      const className = classNode.value

      if (!classNames[className]) {
        classNames[className] = className

        const eloc = className.indexOf(edel)
        const mloc = className.indexOf(mdel)

        if (eloc > 0) {
          if (mloc > eloc) {
            // Element with modifier
            const [block, element, modifier] = [
              className.substr(0, eloc),
              className.substr(
                eloc + edel.length,
                mloc - eloc - edel.length,
              ),
              className.substr(mloc + mdel.length),
            ]
            setOutput(
              [block, element, `$${modifier}`],
              `${block}${edel}${element} ${className}`,
            )
          } else {
            // Element with no modifier
            const [block, element] = className.split(edel)
            setOutput(
              [block, element, '$'],
              className,
            )
          }
        } else {
          /* eslint-disable no-lonely-if */
          if (mloc > 0) {
            // Block with modifier
            const [block, modifier] = className.split(mdel)
            setOutput(
              [block, `$${modifier}`],
              `${block} ${className}`,
            )
          } else {
            // Block with no modifier
            const bkey = className
            setOutput(
              [className, '$'],
              className,
            )
          }
          /* eslint-enable no-lonely-if */
        }
      }
    }

    const processor = selectors =>
      selectors.walkClasses(processClassNode)

    const selectorProcessor = parser(processor)

    root.walkRules(rule => selectorProcessor.process(rule))

    console.log(JSON.stringify(output, null, 2))
    // fs.writeFileSync('output.json', JSON.stringify(output, null, 2));

    if (opts.getJson) {
      opts.getJson(output)
    }
  }
})
