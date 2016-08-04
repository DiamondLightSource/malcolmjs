/*
 * Created by ig43 on 12/07/16.
 */
var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'js');

var config = {
  entry: APP_DIR + '/app.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    alias: { // In case of multiple copies of React flying around
      react: path.resolve('./node_modules/react')
    }
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.js?/,
        include: APP_DIR,
        loader: 'babel'
      },
      {test: /\.json$/, loader: 'json'},
      {
        test: /\.css?$/,
        loaders: ['style', 'raw'],
        include: path.resolve(__dirname, './')
      },
      {
        test: /\.scss$/,
        loaders: ['style','css','sass'],
        include: path.resolve(__dirname, './')
      },
      {test: /\.png$/, loader: "url-loader?limit=100000"},
      {test: /\.jpg$/, loader: "file-loader"}]
  }
};

module.exports = config;
