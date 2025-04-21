const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.m?js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: /node_modules/
  })
);
