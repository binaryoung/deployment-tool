//Bootstrap .env
let envPath = require('path').join(__dirname, '../')
require('dotenv').config({ path: envPath })

//Bootstrap ESM loader.Long ES Modules Live!
require = require('@std/esm')(module)
module.exports = require('./app.js').default
