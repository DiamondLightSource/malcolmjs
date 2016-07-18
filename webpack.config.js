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
    module : {
        loaders : [
            {   exclude: /node_modules/,
                test : /\.js?/,
                include : APP_DIR,
                loader : 'babel'
            },
            { test: /\.json$/, loader: 'json' }
        ]
    }
};

module.exports = config;
