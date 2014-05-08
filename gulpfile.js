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
gulp.task('build', function () {
  var bundleStream = browserify('./index.js').bundle({
    standalone: 'Isomer'
  });
  var banner = fs.readFileSync('./js/banner/copyright.js');

  bundleStream
    .pipe(source('isomer.js'))
    .pipe(buffer())
    .pipe(header(banner, { date: date, version: version }))
    .pipe(gulp.dest('./build'));
});

/* Task to create a release by minifying the build */
gulp.task('release', ['build'], function () {
  var banner = fs.readFileSync('./js/banner/copyright.min.js');

  gulp.src('./build/isomer.js')
    .pipe(uglify())
    .pipe(header(banner, { version: version }))
    .pipe(rename('isomer.min.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('default', ['build']);
