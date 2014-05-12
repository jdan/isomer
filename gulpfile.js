var browserify = require('browserify');
var fs = require('fs');
var gulp = require('gulp');
var buffer = require('gulp-buffer');
var header = require('gulp-header');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var strftime = require('strftime');

var version = require('./package.json').version;
var date = strftime('%F');

/* Main gulp task to minify and concat assets */
gulp.task('dist', function () {
  var bundleStream = browserify('./index.js').bundle({
    standalone: 'Isomer'
  });

  var banner = fs.readFileSync('./js/banner/copyright.js');
  var bannerMin = fs.readFileSync('./js/banner/copyright.min.js');
  var opts = {
    date: date,
    version: version
  };

  bundleStream
    /* isomer.js */
    .pipe(source('isomer.js'))
    .pipe(buffer())
    .pipe(header(banner, opts))
    .pipe(gulp.dest('./dist'))

    /* isomer.min.js */
    .pipe(uglify())
    .pipe(header(bannerMin, opts))
    .pipe(rename('isomer.min.js'))
    .pipe(gulp.dest('./dist'))

});

gulp.task('default', ['dist']);
