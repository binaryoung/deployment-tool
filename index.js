//Bootstrap .env
require('dotenv').config()

//Bootstrap ESM loader.Long ES Modules Live!
require = require('@std/esm')(module)
module.exports = require('./app.js').default
