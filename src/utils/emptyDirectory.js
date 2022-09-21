const { readdirSync, unlinkSync } = require('fs')
const path = require('path')

const emptyDirectory = (dirName) => {
  let directory = path.join(__dirname, `./../../public/uploads/${dirName}/`)
  let files = readdirSync(directory)

  if (!files.length) return true

  files.forEach((file) => unlinkSync(`${directory}/${file}`))
}

module.exports = emptyDirectory
 