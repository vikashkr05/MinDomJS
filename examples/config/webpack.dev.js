const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: [
        './examples/src/index.js'
    ],
    output: {
        path: path.join(__dirname, "../../dist"),
        filename: "index.js",
    },
    mode: "development",
    devServer: {
        contentBase: path.join(__dirname, "../dist"),
        compress: true,
        port: 3000,
        overlay: true
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader" // transpiling our JavaScript files using Babel and webpack
                }
            },
            {
                test: /\.(less|css)$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "less-loader" // compiles less to CSS
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [{
                    loader: "file-loader", // This will resolves import/require() on a file into a url and emits the file into the output directory.
                    options: {
                        name: "[name].[ext]",
                        outputPath: "assets/"
                    }
                }, ]
            },
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader",
                    options: {
                        attrs: ["img:src", ":data-src"],
                        minimize: true
                    }
                }
            }
        ]
    },
    plugins: [
        // CleanWebpackPlugin will do some clean up/remove folder before build
        // In this case, this plugin will remove 'dist' and 'build' folder before re-build again
        new CleanWebpackPlugin(),
        // The plugin will generate an HTML5 file for you that includes all your webpack bundles in the body using script tags
        new HtmlWebpackPlugin({
            template: "./examples/src/index.html",
            filename: "index.html"
        })
    ]
};