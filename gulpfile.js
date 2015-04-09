var es = require('event-stream');
var fs = require('fs');
var open = require('open');
var strftime = require('strftime');

var buffer = require('gulp-buffer');
var gulpWebpack = require('gulp-webpack');
var gulp = require('gulp');
var gutil = require('gulp-util');
var header = require('gulp-header');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');

var date = strftime('%F');
var port = 2992;
var version = require('./package.json').version;
var webpackConfig = require('./webpack.config.base.js');

gulp.task('dist', function() {
  var banner = fs.readFileSync('./js/banner/copyright.js');
  var bannerMin = fs.readFileSync('./js/banner/copyright.min.js');
  var opts = {
    date: date,
    version: version
  };

  var uncompressed = gulp.src('./index.js')
    .pipe(gulpWebpack(webpackConfig()))
    .pipe(buffer())
    .pipe(header(banner, opts))
    .pipe(gulp.dest('./'));

  var minified = gulp.src('./index.js')
    .pipe(gulpWebpack(webpackConfig({minify: true})))
    .pipe(buffer())
    .pipe(header(bannerMin, opts))
    .pipe(gulp.dest('./'));

  return es.concat(uncompressed, minified);
});

gulp.task('test', function() {
  var devWebpackConfig = webpackConfig({dev: true});

  new webpackDevServer(webpack(devWebpackConfig), {
    contentBase: 'test/',
    stats: {
      color: true
    }
  }).listen(port, 'localhost', function(err) {
    if(err) throw new gutil.PluginError("Isomer", err);
  });

  open('http://localhost:' + port + '/webpack-dev-server/')
  gutil.log('[Isomer]', 'listening on http://localhost:' + port);
});

gulp.task('default', ['dist'])
