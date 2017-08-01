/*
 * Created by ig43 on 12/07/16.
 */
const webpack           = require('webpack');
const path              = require('path');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeModulesDir= path.resolve(__dirname, 'node_modules');
const BUILD_DIR     = path.resolve(__dirname, 'build');
const APP_DIR       = path.resolve(__dirname, 'js');
const env           = process.env.NODE_ENV || 'development';

const config = {
  /*entry  : ['babel-polyfill', path.join(APP_DIR, '/app.js')],*/
  entry  : [path.join(APP_DIR, '/app.js')],
  output :
    {
    path    : BUILD_DIR,
    filename: 'bundle.js'
    },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".css", ".scss", ".less"],
  },
  devtool: 'eval-source-map',
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
        test   : /\.js?/,
        exclude: /node_modules/,
        include: [APP_DIR, path.resolve(__dirname, 'components')],
        use : [
          {loader : 'react-hot-loader'},
          {loader : 'babel-loader',
            query  :
              {
                presets: ['es2015', "stage-2",'react'],
                //presets: ['es2015', {modules:false},'react'],
                //presets: ['es2015','react'],
              plugins: ["transform-node-env-inline",'transform-object-rest-spread']
              }
          }
      ]
      },
      { // === To satisfy react-icons imports. See https://github.com/gorangajic/react-icons/issues/34
        test: /react-icons\/(.)*(.js)$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      { test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      },
      {test: /\.css$/,
        include: [APP_DIR, path.resolve(APP_DIR, 'styles'), path.resolve(__dirname, 'src/toolbox')],
        exclude: /node_modules/,
        use : [
          { loader: 'style-loader', options: { sourceMap: true } },
          {loader: "css-loader",
            options:
              {
              modules       : true,
              sourceMap     : false,
              importLoaders : 1,
                //localIdentName: '[name]--[local]--[hash:base64:5]'
              localIdentName: '[local]'
              }
          },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader'}
        ]
      },

      {
        // For all .css files in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use : [
          {
            loader: "style-loader"
          },
          {
            loader : "css-loader",
            options:
            {
              sourceMap     : true,
            }

          },
          {
            loader : "sass-loader",
            options:
            {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {loader: "style-loader"},
          {loader : "css-loader"},
          {loader: "less-loader"}
        ]
      },
      {test: /\.jpg$/, loader: "file-loader"},
      {
        test   : /\.tsx?$/,
        loader : 'ts-loader',
        //loader: 'webpack-typescript?target=ES5&jsx=react',
        exclude: /node_modules/
      },
      {
        test  : /\.(png|woff|woff2|eot|ttf|svg)$/,
        use:[
            {loader: 'url-loader?limit=100000'}
            ]
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
    // The following recommended for react-toolbox
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    //new ExtractTextPlugin('style.css')
    ////if you want to pass in options, you can do so:
    ////new ExtractTextPlugin({
    ////  filename: 'style.css'
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
