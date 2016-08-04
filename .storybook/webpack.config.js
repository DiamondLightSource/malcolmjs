const path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass'),
        //loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
        //loaders: ['style', 'css', 'sass'],
        //include: path.resolve(__dirname, '../../')

        //loader: 'style!css!sass?outputStyle=expanded&' +
        //'includePaths[]=' +
        //(encodeURIComponent(path.resolve('./node_modules')))
      },
      {
        test: /\.css?$/,
        loaders: ['style', 'raw'],
        include: path.resolve(__dirname, '../')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css")
  ],

  sassLoader: {
    includePaths: [path.resolve(__dirname, "./")]
  }
};

module.exports = config;
