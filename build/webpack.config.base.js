const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { resolve } = require('path')

const {
  banner,
  filename,
  version,
  vueLoaders
} = require('./utils')

const plugins = [
  new webpack.DefinePlugin({
    '__VERSION__': JSON.stringify(version),
    'process.env.NODE_ENV': '"test"'
  }),
  new webpack.BannerPlugin({ banner, raw: true, entryOnly: true }),
  new ExtractTextPlugin({
    filename: `${filename}.css`,
    // Don't extract css in test mode
    disable: /^(common|test)$/.test(process.env.NODE_ENV)
  })
]

module.exports = {
  output: {
    path: resolve(__dirname, '../dist'),
    filename: `${filename}.common.js`
  },
  entry: ['velocityjs', 'hammerjs', './src/index.js'],
  resolve: {
    extensions: ['.js', '.vue', '.jsx', 'css'],
    alias: {
      'src': resolve(__dirname, '../src')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: 'babel-loader',
        include: [
          resolve(__dirname, '../node_modules/@material'),
          resolve(__dirname, '../src'),
          resolve(__dirname, '../test')
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: vueLoaders,
          postcss: [require('postcss-cssnext')()],
          optimizeSSR: false
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"],
        include: resolve('assetsPath')
      },
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty'
  },
  plugins
}
