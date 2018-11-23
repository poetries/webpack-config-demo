/**
 * 多页面多配置
 * @type {[type]}
 */

const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpack = require('clean-webpack-plugin')
const ExtractTextwebpack = require('extract-text-webpack-plugin')

const path = require('path')

const baseConfig = {
    mode: 'development',
    entry: {
        react: 'react'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextwebpack.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        }
      ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[chunkhash].js'
    },
    plugins: [
        new ExtractTextwebpack({
          filename: 'css/[name].[hash].css'
        }),
        new CleanWebpack(['./dist'])
    ],
    optimization: {
      splitChunks: {
          cacheGroups: {
              commons: {
                  // commons里面的name就是生成的共享模块bundle的名字
                  name: "react",
                  // chunks 有三个可选值，”initial”, “async” 和 “all”. 分别对应优化时只选择初始的chunks，所需要的chunks 还是所有chunks
                  chunks: "initial",
                  minChunks: Infinity
              }
          }
      }
    }
}

//生成每个页面配置
const generatePage = function({
    title = '',
    entry = '',
    template = './src/index.html',
    name = '',
    chunks = []
} = {}){
    return {
        entry,
        plugins: [
            new HtmlWebpackPlugin({
                chunks,
                template:`!!html-loader!${template}`,
                filename: name + '.html'
            })
        ]
    }
}

const pages = [
  generatePage({
      title: 'page A',
      entry: {
        a: './src/pages/a'
      },
      name: 'a',
      chunks: ['react','a']
  }),
  generatePage({
      title: 'page B',
      entry: {
        b: './src/pages/b'
      },
      name: 'b',
      chunks: ['react','b']
  }),
  generatePage({
      title: 'page C',
      entry: {
        c: './src/pages/c'
      },
      name: 'c',
      chunks: ['react','c']
  })
]

module.exports = pages.map(page=>merge(baseConfig, page))
