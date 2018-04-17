const postcss = require('postcss')
const path = require('path')
const fs = require('fs')
const plugin = require('../')

const fixturesPath = path.resolve(__dirname, './fixtures')

const run = (name, opts) => {
  let resultJson
  let resultJs
  const sourceFile = path.join(fixturesPath, 'in', `${name}.css`)
  const expectedFile = path.join(fixturesPath, 'out', name)
  const sourceCss = fs.readFileSync(sourceFile).toString()
  const expectedJson = fs.readFileSync(`${expectedFile}.json`).toString()
  const expectedJs = fs.readFileSync(`${expectedFile}.js`).toString()

  const options = opts || {}

  options.getJs = (_, json, js) => {
    resultJson = json
    resultJs = js
  }

  const plugins = [plugin(options)]
  return postcss(plugins).process(sourceCss, { from: sourceFile })
    .then((result) => {
      // console.log(JSON.stringify(resultJson, null, 2));
      expect(result.css).toEqual(sourceCss) /* do not transform input */
      expect(resultJson).toEqual(JSON.parse(expectedJson))
      expect(resultJs).toEqual(expectedJs)
    })
}

it('should handle BEM syntax', () => run('bem'))

it('should handle BEMIT syntax using prefix mapping', () => run('bemit', {
  prefixMap: {
    'o-': 'o',
    'c-': 'c',
    'u-': 'u'
  }
}))

it('should handle replace config', () => run('replace', {
  prefixMap: {
    'ln-o-': 'o',
    'ln-c-': 'c',
    'ln-u-': 'u'
  },
  replace: {
    '@': '_',
    '\\/': 'of'
  }
}))
