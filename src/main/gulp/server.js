'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

var paths = {
  dist: 'dist',
  test: '.tmp'
};

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  browserSync.instance = browserSync.init(files, {
    startPath: '/index.html',
    server: {
      baseDir: baseDir,
      middleware: middleware
    },
    browser: browser
  });

}

gulp.task('serve', ['build', 'watch'], function () {
  browserSyncInit(paths.test,
    [
      paths.test + '/**/*.html',
      paths.test + '/**/*.css',
      paths.test + '/**/*.js'
    ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(paths.dist);
});
