// Karma configuration
// Generated on Tue Jul 12 2016 08:41:02 GMT+0100 (BST)

var webpack = require('webpack');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'chai-as-promised', 'fixture'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'js/__tests__/fixtures/**/*'},
      '*.html',
      'tests.webpack.js'
    ],


    // list of files to exclude
    exclude: [ ],


    plugins: [ 'karma-firefox-launcher', 'karma-chai', 'karma-chai-plugins','karma-mocha',
      'karma-sourcemap-loader', 'karma-webpack', 'karma-coverage',
      'karma-mocha-reporter',
      'karma-fixture',
      'karma-html2js-preprocessor',
      'karma-json-fixtures-preprocessor'],
    preprocessors: {
      'js/**/*.js': ['coverage'],
      'tests.webpack.js': [ 'webpack', 'sourcemap' ], //preprocess with webpack and our sourcemap loader
      '**/*.html'   : ['html2js'],
      '**/*.json'   : ['json_fixtures']
    },
    coverageReporter: {
      type: 'html', //produces a html document after code is run
      dir: 'coverage/' //path to created html doc
    },
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },
    reporters: [ 'mocha', 'coverage' ], //report results in this format
    webpack: { //kind of a copy of your webpack config
      devtool: 'inline-source-map', //just do inline source maps instead of the default
      module: {
        loaders: [
          //{ test: /\.js$/,  loader: 'babel', query: {presets:['es2015','stage-0', 'react']}},

          { test: /\.js$/,  loader: 'babel', exclude: /node_modules/},
          { test: /\.json$/, loader: 'json' }
        ],
        postLoaders: [ { //delays coverage til after tests are run, fixing transpiled source coverage error
          test: /\.js$/,
          exclude: /(test|node_modules)\//,
          loader: 'istanbul-instrumenter' } ]
      }
    },
    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
