const path = require('path');

module.exports = {
  entry: {
    background: './src/background/index.js',
    content: './src/content/index.js',
    devtools: './src/devtools/index.js',
    'devtools-panel': './src/devtools-panel/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devtool: 'cheap-module-source-map'
};
