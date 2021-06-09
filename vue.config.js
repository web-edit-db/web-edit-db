const path = require('path')

module.exports = {
  chainWebpack: config => {
    config.plugin('copy').tap((args) => [[...args[0], {
      from: path.resolve(__dirname, 'node_modules/sql.js/dist/sql-wasm.wasm'),
      to: path.resolve(args[0][0].to, 'js')
    }]])
    // no parse sql.js because it is already built for browser
    config.module.noParse(/sql\.js/)
  }
}
