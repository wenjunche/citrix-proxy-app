const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, './out'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                // use: 'ts-loader',
                // exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            logLevel: "info"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ 
            title: 'Virtual App Proxy',
            template: 'index.html',
            filename: 'index.html'
        })
    ]
};
