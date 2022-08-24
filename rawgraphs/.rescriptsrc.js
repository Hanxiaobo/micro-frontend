const path = require('path')
const { name } = require('./package')

module.exports = {
  webpack: (config) => {
    config.output.library = `${name}`
    config.output.libraryTarget = 'umd'
    config.output.jsonpFunction = `webpackJsonp_${name}`
    config.output.globalObject = 'window'
    config.output.path = path.resolve(__dirname, './dist')
    config.entry = path.resolve(__dirname, './src/index.js')

    return config
  },

  devServer: (_) => {
    const config = _

    config.headers = {
      'Access-Control-Allow-Origin': '*',
    }
    config.historyApiFallback = true
    config.hot = false
    config.watchContentBase = false
    config.liveReload = false
    config.publicPath = `//localhost:3000/`

    return config
  },
}
