var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

require('css-loader');
require('style-loader');
require('autoprefixer-loader');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

gulp.task("default", ["build-dev"]);

gulp.task("build-dev", function() {
  gulp.start('webpack:dev-server');
});

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'source-map';
  myConfig.module.loaders.push({ test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?sourceMap!autoprefixer') });
  myConfig.output.sourceMapFilename = 'blargh_[file]_[id]_[hash].map',
  myConfig.plugins = (myConfig.plugins || []).concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('styles.css')
    // new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("webpack:dev-server", function(callback) {
  var WebpackDevServer = require("webpack-dev-server");

  // modify some webpack config options
  var myDevConfig = Object.create(webpackConfig);
  myDevConfig.devtool = "sourcemap";
  myDevConfig.debug = true;
  myDevConfig.output.path = "/" + myDevConfig.output.path;
  myDevConfig.output.publicPath = 'http://localhost:8090' + myDevConfig.output.publicPath;
  myDevConfig.module.loaders.push({test: /\.css/, loader: 'style!css?sourceMap!autoprefixer'});

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myDevConfig), {
    publicPath: myDevConfig.output.publicPath,
    stats: {
      colors: true,
      chunkModules: false
    }
  }).listen(8090, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
  });
});
