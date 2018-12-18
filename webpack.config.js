const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
  devtool: 'cheap-module-source-map',
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: 'manifest.json' },
      { from: 'src/background.html', to: 'background.html' },
      { from: 'src/devtools.html', to: 'devtools.html' },
      { from: 'src/devtools-panel.html', to: 'devtools-panel.html' },
      { from: 'src/public', to: 'public', toType: 'dir' },
    ]),
  ]
};
