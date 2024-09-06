const webpack = require('webpack');

module.exports = function override(config) {
  // Add fallback for missing Node.js core modules
  config.resolve.fallback = {
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    zlib: require.resolve('browserify-zlib'),
    os: require.resolve('os-browserify/browser'),
    buffer: require.resolve('buffer/'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    url: require.resolve('url/'),
    assert: require.resolve('assert/'),
    fs: false,  // Disable 'fs' since it's not available in the browser
  };

  // Enable source-map-loader to handle Web3 warnings
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: /node_modules/, // Optional: Exclude node_modules from source-map-loader to reduce noise
  });

  // Define plugins for buffer and process polyfills
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  );

  return config;
};
