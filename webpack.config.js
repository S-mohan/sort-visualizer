const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = env => {
  const isProd = env.production || env === 'production'
  const config = {
    entry: {
      app: path.resolve(__dirname, './src/index.ts')
    },
    output: {
      publicPath: '/',
      filename: 'static/app.[hash].js',
      path: path.resolve(__dirname, './docs')
    },
    mode: isProd ? 'production' : 'development',
    resolve: {
      extensions: ['.ts', '.js']
    },
    devtool: isProd ? false : 'source-map',
    module: {
      rules: [{
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          use: [{
            loader: 'babel-loader'
          }],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ]
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, './docs/index.html'),
        template: path.resolve(__dirname, './public/index.html'),
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          minifyCSS: true,
          minifyJS: true
        },
      }),
      new MiniCssExtractPlugin({
        filename: 'static/[name].[hash].css',
        chunkFilename: 'static/[name].[hash].css'
      }),
      new OptimizeCSSPlugin({ safe: true, map: false, discardComments: { removeAll: true } }),
    ]
  }



  if (!isProd) {
    config.devServer = {
      contentBase: path.join(__dirname, './docs'),
      compress: true,
      hot: true,
      open: true,
      port: 1990,
    }
  }

  return config
}