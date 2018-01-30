/* https://raw.githubusercontent.com/css-modules/postcss-modules/master/src/saveJson.js */
import { writeFile } from 'fs'

const saveJson = (cssFile, json) => new Promise((resolve, reject) => {
  writeFile(
    `${cssFile}.json`,
    JSON.stringify(json),
    e => (e ? reject(e) : resolve(json)),
  )
})

export default saveJson

