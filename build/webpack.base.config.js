const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");

let htmlPlugins = [];
const files = fs.readdirSync(path.resolve(__dirname, "../src/views"));
htmlPlugins = files.map((item) => {
  return new HtmlWebpackPlugin({
    filename: item + ".html",
    template: `./src/views/${item}/${item}.html`,
    chunks: [item],
  });
});
module.exports = {
  entry: {
    index: "./src/views/index//index.js",
    about: "./src/views/about/about.js",
    vendor: ["jquery"],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
    }),
    // 自动清空dist目录
    new CleanWebpackPlugin(),
    // 设置html模板生成路径
    ...htmlPlugins,
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10, // 优先级
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-transform-modules-commonjs",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // css中的图片路径增加前缀
              publicPath: "../",
            },
          },
          "css-loader",
        ],

        //use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // css中的图片路径增加前缀
              publicPath: "../",
            },
          },
          "css-loader",
          "sass-loader",
        ],
        //use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif|webp)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // 图片输出的实际路径(相对于dist)
              outputPath: "images",
              // 当小于某KB时转为base64
              limit: 0,
              name: "[name].[ext]",
              esModule: false, //解决方法
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // 图片输出的实际路径(相对于dist)
              outputPath: "images",
              // 当小于某KB时转为base64
              limit: 10000,
              name: "[name].[ext]",
              esModule: false, //解决方法
            },
          },
        ],
      },
      {
        test: /\.(html)$/i,
        loader: "html-withimg-loader", //解决html中使用img标签路径找不到问题
      },
    ],
  },
  // 编译输出配置
  output: {
    filename: "js/[name].[hash].js",
    // 输出路径为dist
    path: path.resolve(__dirname, "../dist"),
  },
};
