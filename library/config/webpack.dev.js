const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

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
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader" // transpile our JavaScript files using Babel and webpack
            }
        }]
    },
    plugins: [
        // CleanWebpackPlugin will do some clean up/remove folder before build
        // In this case, this plugin will remove lib folder before re-build again
        new CleanWebpackPlugin()
    ]
};