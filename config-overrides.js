const rewireUglifyjs = require('react-app-rewire-uglifyjs');

module.exports = function override(config, env) {
  config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' }
    })

  config = rewireUglifyjs(config);
  return config;
}