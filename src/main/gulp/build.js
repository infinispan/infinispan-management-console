'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('styles', ['clean'], function () {
  return gulp.src('src/main/webapp/**/*.less')
    .pipe($.less({
      paths: [
        'src/main/bower_components',
        'src/main/webapp'
      ]
    }))
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('target/tmp'))
    .pipe($.size());
});

gulp.task('scripts', function () {
  return gulp.src('src/main/webapp/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

gulp.task('partials', ['clean'], function () {
  return gulp.src('src/main/webapp/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({
      moduleName: 'managementConsole'
    }))
    .pipe(gulp.dest('target/tmp'))
    .pipe($.size());
});

gulp.task('html', ['clean', 'styles', 'scripts', 'partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('src/main/webapp/*.html')
    .pipe($.inject(gulp.src('target/tmp/webapp/**/*.js'), {
      read: false,
      starttag: '<!-- inject:partials -->',
      addRootSlash: false,
      addPrefix: '../'
    }))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('bower_components/bootstrap/fonts','fonts'))
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('images', ['clean'], function () {
  return gulp.src('src/main/assets/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('target/dist/assets/images'))
    .pipe($.size());
});

gulp.task('fonts', ['clean'], function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('target/dist/fonts'))
    .pipe($.size());
});

gulp.task('clean', function (cb) {
  $.del(['target/tmp/**', 'target/dist/**'], cb);
});

gulp.task('clear-cache', function (done) {
  return $.cache.clearAll(done);
});

gulp.task('build', ['html', 'partials', 'images', 'fonts']);

