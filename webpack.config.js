const MinifyPlugin = require("babel-minify-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  entry: "./lib/index.ts",
  output: {
    filename: "./dist/bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  plugins: [
    new MinifyPlugin(),
    new CompressionPlugin(),
  ],
  devtool: process.env.NODE_ENV === "production" ? "source-map" : "inline-source-map"
};