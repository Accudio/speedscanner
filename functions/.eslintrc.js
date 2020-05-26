module.exports = {
  env: {
    browser: false,
    node: true,
    es6: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'indent': [2, 2],
    'no-tabs': 2,
    'no-new': 0,
    'space-before-function-paren': [2, 'never'],
    'no-console': 0
  }
}
