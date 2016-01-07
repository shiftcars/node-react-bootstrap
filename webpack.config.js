require('babel-loader');
require('babel-preset-es2015');
require('babel-preset-react');

module.exports = {
  entry: {
    app: 'App'
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js',
    path: 'app/public/js/',
    publicPath: '/js/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015']
        }
      },
      {test: require.resolve('react'), loader: 'expose?React' }
    ]
  },
  resolve: {
    alias: {
    },
    root: [__dirname + '/app/client_src']
  }
};
