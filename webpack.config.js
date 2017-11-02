const MinifyPlugin = require("babel-minify-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

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
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.css$/, use: [
        { "loader": "css-loader", options: { minimize: true } },
        { "loader": "postcss-loader", options: { 
          plugins: (loader) => [
            require("autoprefixer")(),
            require("cssnano")()
          ]
        } }
      ] }
    ]
  },
  plugins: [
    new MinifyPlugin(),
    new CompressionPlugin(),
    new CopyPlugin([ { context: "lib/demo", from: "**/*", to: "dist" } ])
  ],
  devtool: process.env.NODE_ENV === "production" ? "source-map" : "inline-source-map"
};