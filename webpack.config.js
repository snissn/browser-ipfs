const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'), // 🔥 Change `dist` to `public`
    },
    mode: 'development',
    devServer: {
        static: './public', // 🔥 Serve from `public`
        port: 8080,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        fallback: {
            fs: false,
            net: false,
            tls: false,
        },
    },
};
