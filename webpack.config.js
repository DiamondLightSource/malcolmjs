/*
 * Created by ig43 on 12/07/16.
 */
const webpack = require('webpack');
const path    = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR   = path.resolve(__dirname, 'js');

const config = {
  entry  : path.join(APP_DIR, '/app.js'),
  output : {
    path    : BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".css", ".scss", ".less"],
    alias     : { // In case of multiple copies of React flying around
      'react.js'                       : path.join(__dirname, 'node_modules/react/react.js'),
      'react/lib/CSSPropertyOperations': path.join(__dirname, 'node_modules/react-dom/lib/CSSPropertyOperations.js'),
      'react/lib/ReactDOM'             : path.join(__dirname, 'node_modules/react-dom/lib/ReactDOM.js')
    }
  },
  devtool: 'source-map',
  module : {

    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test  : /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      //{ enforce: "pre",
      //test: /\.js$/,
      //loader: "source-map-loader" },
      //{ enforce: "pre",
      //test: /\.tsx?$/,
      //loader: "source-map-loader" },
      {
        exclude: /node_modules/,
        test   : /\.js?/,
        include: [APP_DIR, path.resolve(__dirname, 'components')],
        loader : 'babel-loader',
        query  : {
          presets: ['es2015', 'react'],
          plugins: ['transform-object-rest-spread']
        }
      },
      {test: /\.json$/, loader: 'json-loader'},
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          }
        ]
     },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              alias: {
                "../fonts/bootstrap": "bootstrap-sass/assets/fonts/bootstrap"
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: [
                path.resolve("./node_modules/bootstrap-sass/assets/stylesheets")
              ]
            }
          }
        ]
      },
      {
        test: /\.less$/, loader: "style-loader!css-loader!less-loader"
      },
      {test: /\.png$/, loader: "url-loader?limit=100000"},
      {test: /\.jpg$/, loader: "file-loader"},
      {
        test   : /\.tsx?$/,
        loader : 'ts-loader',
        //loader: 'webpack-typescript?target=ES5&jsx=react',
        exclude: /node_modules/
      }

    ],

  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
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
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new ExtractTextPlugin('style.css')
    //if you want to pass in options, you can do so:
    //new ExtractTextPlugin({
    //  filename: 'style.css'
    //})

  ],
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  /*
   externals: {
   "react": "React",
   "react-dom": "ReactDOM"
   },
   */
};

/**
 config.node = {
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
}
 */


module.exports = config;
