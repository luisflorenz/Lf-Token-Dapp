const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve("process/browser"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert/"),
    os: require.resolve("os-browserify/browser"),
    path: require.resolve("path-browserify"),
    fs: false,  // fs is not available in the browser, so set it to false
  };

  // Adding ProvidePlugin for process and Buffer polyfills
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};
