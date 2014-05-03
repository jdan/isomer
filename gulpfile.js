var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

/* Main gulp task to minify and concat assets */
gulp.task('build', function () {
  var bundleStream = browserify('./index.js').bundle();

  bundleStream
    .pipe(source('isomer.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('default', ['build']);
