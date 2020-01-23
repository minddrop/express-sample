const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/bin/index.js'),
  output: {
    filename: 'www',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin(['MONGO_URI'])
  ]
}
