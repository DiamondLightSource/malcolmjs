/*
 * Created by ig43 on 12/07/16.
 */
var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'js');

var config = {
  entry: path.join(APP_DIR, '/app.js'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    alias: { // In case of multiple copies of React flying around
      'react.js': path.join(__dirname, 'node_modules/react/react.js'),
      'react/lib/CSSPropertyOperations': path.join(__dirname, 'node_modules/react-dom/lib/CSSPropertyOperations.js'),
      'react/lib/ReactDOM': path.join(__dirname, 'node_modules/react-dom/lib/ReactDOM.js')
    }
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.js?/,
        include: [APP_DIR, path.resolve(__dirname, 'components')],
        loader: 'babel-loader',
        query:
        {
          presets:['es2015', 'react'],
          plugins: ['transform-object-rest-spread']
        }
      },
      {test: /\.json$/, loader: 'json-loader'},
      {
        test: /\.css?$/,
        loaders: ['style-loader', 'raw-loader'],
        include: [path.resolve(__dirname, './'), path.resolve(__dirname, './components/styles')]
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader','css-loader','sass-loader'],
        include: [path.resolve(__dirname, './'), path.resolve(__dirname, './components/styles')]
      },
      {test: /\.png$/, loader: "url-loader?limit=100000"},
      {test: /\.jpg$/, loader: "file-loader"}]
  },

  plugins:[
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    /*
     new webpack.optimize.UglifyJsPlugin({
     compress:{
     warnings: true
     }
     })
     */
  ],
};

/**
config.node = {
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
}
 */


module.exports = config;
