const webpack = require("webpack");
const path = require("path");

module.exports = function override(config) {
  // Add fallback for missing Node.js core modules
  config.resolve.fallback = {
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    zlib: require.resolve("browserify-zlib"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    url: require.resolve("url/"),
    assert: require.resolve("assert/"),
    fs: false,
  };

  // Enable source-map-loader to handle Web3 warnings
  config.module.rules.push({
    test: /\.js$/,
    enforce: "pre",
    use: ["source-map-loader"],
    exclude: /node_modules/, // Optional: Exclude node_modules from source-map-loader to reduce noise
  });

  // Define plugins for buffer and process polyfills
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    })
  );

  // Add resolution for src directory
  config.resolve.modules = [path.resolve(__dirname, "src"), "node_modules"];

  return config;
};
