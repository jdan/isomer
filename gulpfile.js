var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

/* Main gulp task to minify and concat assets */
gulp.task('build', function () {
  var bundleStream = browserify('./index.js').bundle();

  bundleStream
    .pipe(source('isomer.js'))
    .pipe(gulp.dest('./build'));
});

/* Task to create a release by minifying the build */
gulp.task('release', ['build'], function () {
  gulp.src('./build/isomer.js')
    .pipe(uglify())
    .pipe(rename('isomer.min.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('default', ['build']);
