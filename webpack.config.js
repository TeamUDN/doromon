const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

module.exports = {
  mode: 'development',
  //mode: 'production',
  entry: {
    'top': './src/entry/js/pages/top.js',
    'battle': './src/entry/js/pages/battle.js',
    'top.css': './src/entry/style/pages/top.scss',
    'draw.css': './src/entry/style/pages/draw.scss',
    'battle.css': './src/entry/style/pages/battle.scss',
  },
  output: {
    path: path.resolve(__dirname, 'src/static/webpack/'),
    filename: '[name].js'
  },
  module: {
    rules: [
      // TypeScript
      {
        test: /.(ts|tsx)?$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, 'src/entry')],
        exclude: [/node_modules/]
      },
      // Sass
      {
        test: /\.scss$/, // 対象となるファイルの拡張子
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // CSSをバンドルするための機能
          {
            loader: "css-loader",
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2,
              sourceMap: true
              //sourceMap: false
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
              //sourceMap: false
            },
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ["node_modules"]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 出力ファイル名
      filename: "[name]",
    }),
    new FixStyleOnlyEntriesPlugin(),
  ]
}
