module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.module.rules.push({
          test: /\.(eot|woff|woff2|ttf|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[name][ext][query]'
          }
        });
        return webpackConfig;
      }
    }
  };