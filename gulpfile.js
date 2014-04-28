var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

/* Main gulp task to minify and concat assets */
gulp.task('build', function () {
  gulp.src(['./js/isomer.js', './js/!(isomer)*.js'])
    .pipe(uglify())
    .pipe(concat('isomer.min.js'))
    .pipe(gulp.dest('./build'));
});

/* Task for testing purposes - concat without minifying */
gulp.task('concat', function () {
  gulp.src(['./js/isomer.js', './js/!(isomer)*.js'])
    .pipe(concat('isomer.min.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('default', ['build']);
