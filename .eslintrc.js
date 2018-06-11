module.exports = {
  'env': {
    'browser': true,
    'jest': true,
    'es6': true,
    'node': true,
    'cypress/globals': true
  },
  'extends': [
    'airbnb',
    'plugin:prettier/recommended',
  ],
  'plugins': [
    'prettier',
    'cypress'
  ],
  'rules': {
    'react/jsx-filename-extension': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'prettier/prettier': ['error', {
      'singleQuote': true,
      'trailingComma': 'es5'
    }],
  },
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    }
  }
}