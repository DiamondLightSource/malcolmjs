/**
 * Created by Ian Gillingham on 23/06/17.
 */
const config = {
  plugins: {
    'postcss-import': {
      root: __dirname,
    },
    'postcss-mixins': {},
    'postcss-each': {},
    'postcss-cssnext': {}
  },
};

module.exports = config;
