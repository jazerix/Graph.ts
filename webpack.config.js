const path = require('path')

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/Graph.ts",
    output: {
        path: __dirname + '/dist',
        filename: "bundle.js",
        library: 'Graph'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
};