// craco.config.js
const { whenDev, whenProd, whenTest } = require('@craco/craco');

module.exports = {
  // Configuration for CRACO
  babel: {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
    ],
  },
  webpack: {
    // Add fallbacks for Node.js core modules
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
        fs: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
      },
    },
    // Additional webpack configuration if needed
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
      ],
    },
  },
  // Configuration for different environments
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-runtime',
  ],
};
