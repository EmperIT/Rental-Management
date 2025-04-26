module.exports = function override(config) {
  // Tìm tất cả các rule có dùng source-map-loader
  config.module.rules.forEach(rule => {
    if (
      rule.use === 'source-map-loader' ||
      (Array.isArray(rule.use) && rule.use.includes('source-map-loader'))
    ) {
      // Loại bỏ thư viện docx-preview khỏi việc load source map
      rule.exclude = rule.exclude || [];
      rule.exclude.push(/docx-preview/);
    }
  });

  return config;
};
