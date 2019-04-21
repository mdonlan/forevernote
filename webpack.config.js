const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '/dist/'),
        publicPath: '/dist/'
    },
    module: { // for react
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        }]
    },
    devServer: {
        hot: true,
        historyApiFallback: true // why is this needed? w/out manual routes fail on dev mode!
    },
};