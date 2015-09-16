'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

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
  browserSyncInit('dist',
    ['dist/**/*.html',
      'dist/**/*.css',
      'dist/**/*.js',
    ]);
});

gulp.task('serve:e2e', function () {
    browserSyncInit(['src/main', 'target/tmp'], null, []);
});

gulp.task('serve:e2e-dist', ['watch'], function () {
    browserSyncInit('dist', null, []);
});

