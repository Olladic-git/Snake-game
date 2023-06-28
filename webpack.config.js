const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    }, 

    module: {
        rules: [
            {
                test:/\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{loader: 'babel-loader'}]
            },
            {
                test: /\.css$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                    {loader: 'css-loader'}
                ]
            }
        ],
    },

    resolve: {
        extensions: ['.*', '.js', '.jsx'],
    },

    plugins: [
        new MiniCssExtractPlugin({filename: 'index.css'}),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: false
        })
    ]
};