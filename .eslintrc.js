module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 禁用某个语法规则操作， 复制报错信息的，粘贴到这里，作为属性赋值为0
    //   例如 空行过多 no-multiple-empty-lines
    //  方法名与括号间的空格 space-before-function-paren
    'space-before-function-paren': 0,
    'no-new': 0
  }
}
