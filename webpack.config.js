require('dotenv').config();
const path = require('path');
// const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.jsx',
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        // options: { presets: ["@babel/env"] },
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
  resolve: { extensions: ['*', '.js', '.jsx'] },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    devMiddleware: {
      publicPath: 'http://localhost:3000/dist/',
    },
    port: 3000,
    hot: true,
  },
  // plugins: [new webpack.HotModuleReplacementPlugin()],
};
