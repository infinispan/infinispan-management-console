'use strict';

var gulp = require('gulp');

require('require-dir')('./src/main/gulp');

gulp.task('default', ['clean', 'build']);
