/* https://raw.githubusercontent.com/css-modules/postcss-modules/master/src/saveJson.js */
const fs = require('fs')

const saveJson = (cssFile, json) => new Promise((resolve, reject) => {
  fs.writeFile(
    `${cssFile}.json`,
    JSON.stringify(json, null, 2),
    e => (e ? reject(e) : resolve(json)),
  )
})

module.exports = saveJson
