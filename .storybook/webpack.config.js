const path = require('path');
var webpack = require('webpack');

const webpackConfig = {
  devtool: "source-map",
  module: {},
};

webpackConfig.plugins = [
];

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [];

webpackConfig.module.loaders.push({
    test: /\.scss$/,
    loaders: ['style', 'css', 'sass'],
    include: path.resolve(__dirname, '../')
});

webpackConfig.module.loaders.push({
    test: /\.css$/,
    loaders: ['style', 'raw'],
    include: path.resolve(__dirname, '../')
});


var config = {
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.scss$/,
        //loader: ExtractTextPlugin.extract('style', 'css!sass'),
        /*
        loader: ExtractTextPlugin.extract(
          // activate source maps via loader query
          'css?sourceMap!' +
          'sass?sourceMap'+'includePaths[]=' +
          (encodeURIComponent(
            path.resolve(options.base || process.cwd(), './node_modules')
          )) +
          '&includePaths[]=' +
          (encodeURIComponent(
              path.resolve(options.base || process.cwd(),
                './node_modules/grommet/node_modules'))
          )
        )
        */
        //loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
        loaders: ['style', 'css', 'sass'],
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
  ],

  sassLoader: {
    includePaths: [path.resolve(__dirname, "./")]
  }
};

//module.exports = config;
module.exports = webpackConfig;
