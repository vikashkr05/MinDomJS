const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");

module.exports = {
    entry: [
        './library/src/index.js'
    ],
    output: {
        path: path.join(__dirname, "../../lib"),
        filename: "index.js",
        library: "LightJS",
        libraryTarget: "window"
    },
    mode: "production",
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader" // transpile our JavaScript files using Babel and webpack
            }
        }]
    },
    optimization: {
        minimizer: [new TerserJSPlugin()]
    },
    plugins: [
        // CleanWebpackPlugin will do some clean up/remove folder before build
        // In this case, this plugin will remove lib folder before re-build again
        new CleanWebpackPlugin(),
        // CompressionPlugin will Prepare compressed versions of assets to serve them with Content-Encoding.
        // In this case we use gzip
        // But, you can also use the newest algorithm like Brotli, and it's superior than gzip
        new CompressionPlugin({
            algorithm: "gzip"
        }),
        new BrotliPlugin()
    ]
};