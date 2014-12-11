'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('src/main/webapp/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('src/main'));

  gulp.src('src/main/webapp/*.html')
    .pipe(wiredep({
      exclude: ['bower_components/bootstrap']
    }))
    .pipe(gulp.dest('target/tmp'));
});
