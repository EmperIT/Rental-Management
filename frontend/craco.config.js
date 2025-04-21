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

      // Log thử rules để kiểm tra
      console.log(
        '📦 Webpack rules:',
        JSON.stringify(webpackConfig.module.rules, null, 2)
      );

      // Kiểm tra và exclude source-map-loader nếu có
      webpackConfig.module.rules.forEach(rule => {
        // Nếu rule có `oneOf`, xử lý các rule trong đó
        if (Array.isArray(rule.oneOf)) {
          rule.oneOf.forEach(oneOfRule => {
            if (
              oneOfRule.loader &&
              oneOfRule.loader.includes('source-map-loader')
            ) {
              console.log('👉 Found source-map-loader:', oneOfRule);
              // Thêm exclude cho docx-preview
              oneOfRule.exclude = [
                ...(oneOfRule.exclude || []),
                /node_modules\/docx-preview/
              ];
            }
          });
        }
        // Kiểm tra trực tiếp rule nếu không phải `oneOf`
        if (rule.loader && rule.loader.includes('source-map-loader')) {
          console.log('👉 Found source-map-loader:', rule);
          rule.exclude = [
            ...(rule.exclude || []),
            /node_modules\/docx-preview/
          ];
        }
      });

      return webpackConfig;
    }
  }
};
