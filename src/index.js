//Bootstrap .env
let envPath = require('path').join(__dirname, '../', '.env')
require('dotenv').config({ path: envPath })

//Bootstrap ESM loader.Long Live ES Modules !
require = require('@std/esm')(module)
module.exports = require('./app.js').default
