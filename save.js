/* https://raw.githubusercontent.com/css-modules/postcss-modules/ */
const fs = require('fs')

const writeFile = (file, data) => new Promise((resolve, reject) => {
  fs.writeFile(file, data, (err) => {
    if (err) {
      reject(err)
      return
    }
    resolve()
  })
})

const save = (cssFile, json, js) => Promise.all([
  writeFile(`${cssFile}.json`, JSON.stringify(json, null, 2)),
  writeFile(`${cssFile}.js`, js)
])

module.exports = save
