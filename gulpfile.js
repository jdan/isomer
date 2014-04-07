var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function () {
  gulp.src(['./js/isomer.js', './js/!(isomer)*.js'])
    .pipe(uglify())
    .pipe(concat('isomer.min.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('default', ['build']);
