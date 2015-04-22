'use strict';

var gulp = require('gulp');

gulp.task('watch' ,function () {
  gulp.watch('src/main/webapp/**/*.less', ['styles']);
  gulp.watch('src/main/webapp/**/*.js', ['scripts']);
  gulp.watch('src/main/webapp/**/*.html', ['partials']);
  gulp.watch('src/main/assets/images/**/*', ['images']);
});
