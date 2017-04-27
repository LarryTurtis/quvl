import path from 'path';
import nconf from 'nconf';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import './config';

const resolve = (...args) => path.resolve(__dirname, ...args);

const config = {
  devtool: 'eval',
  displayErrorDetails: true,
  entry: {
    serverbid: [
      'webpack-hot-middleware/client', // TODO: Remove this from prod bundle
      resolve('src/client')
    ]
  },
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'react-hot!babel',
        include: resolve('src/client')
      },
      {
        test: /\.(css|styl)$/,
        loader: ExtractTextPlugin.extract('style', 'css!stylus')
      },
      {
        test: /\.(ttf|otf|eot|svg|woff|woff2)$/,
        loader: 'url?limit:5000&name=fonts/[hash].[ext]'
      },
      {
        include: /\.json$/, loaders: ['json-loader']
      },
      { test: /\.jpg$/, loader: 'file' }
    ]
  },
  plugins: [
    new ExtractTextPlugin('serverbid.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: true,
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        AUTH0_CLIENT_ID: JSON.stringify(nconf.get('AUTH0_CLIENT_ID')),
        AUTH0_DOMAIN: JSON.stringify(nconf.get('AUTH0_DOMAIN'))
      }
    })
  ],
  resolve: {
    alias: {
      react: resolve('node_modules/react')
    },
    extensions: ['', '.js', '.jsx', '.json'],
    fallback: resolve('node_modules')
  },
  resolveLoader: {
    fallback: resolve('node_modules')
  }
};

module.exports = config;
