const fs = require('fs')

const fileToCheck = "/.dockerenv"
const inDocker    = fs.existsSync(fileToCheck)

module.exports = inDocker
