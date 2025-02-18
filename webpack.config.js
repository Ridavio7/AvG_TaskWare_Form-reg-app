const path                      = require('path');
const HtmlWebpackPlugin         = require('html-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin       = require('terser-webpack-plugin');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
//const CopyWebpackPlugin         = require("copy-webpack-plugin");
const {CleanWebpackPlugin}      = require('clean-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
  const configObj = {
    splitChunks: {
      chunks: 'all'
    }
  };

  if(isProd){
    configObj.minimizer = [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
    ]
  }

  return configObj;
};

const pages = ['index'];

const plugins = () => {
  const basePlugins = [
    new MiniCssExtractPlugin({
      filename: `styles/${filename('css')}`,
    }),
    /*new CopyWebpackPlugin({
      patterns: [],
    }),*/
    new CleanWebpackPlugin(),

  ].concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `src/pages/${page}.html`,
          filename: `${page}.html`,
          chunks: [page],
        })
    )
  );

  return basePlugins;
}

module.exports = {
  mode: 'development',
  entry: pages.reduce((config, page) => {
    config[page] = `./src/js/${page}.js`;
    return config;
  }, {}),
  
  output: {
    filename: `js/${filename('js')}`,
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: 'assets/images/[name][ext]'
  },

  stats: 'errors-warnings',

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(s*)css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  devtool: isProd ? false : 'source-map',
  optimization: optimization(),
  plugins: plugins(),

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true,
  },
};