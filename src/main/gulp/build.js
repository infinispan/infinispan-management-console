'use strict';

var gulp = require('gulp');

var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del', 'q']
});

var es = require('event-stream');
var bowerFiles = require('main-bower-files');

var paths = {
  bower_comps: 'src/main/bower_components',
  bower_comps_deep: 'src/main/bower_components/**',
  scripts: 'src/main/webapp/**/*.js',
  styles: ['src/main/webapp/**/*.less','src/main/webapp/**/*.css'],
  images: 'src/main/assets/images/**/*',
  index: 'src/main/webapp/index.html',
  partials: ['src/main/webapp/**/*.html', '!src/main/webapp/index.html'],
  distDev: 'dist',
  distDevBower: 'dist/bower_components'
};


function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

var pipes = {};

pipes.buildStyles = function(srcPath, destPath) {
  srcPath = srcPath || paths.styles;
  destPath = destPath || paths.distDev;

  return gulp.src(srcPath)
    .pipe(plugins.less({
      paths: [
        paths.bower_comps
      ]
    }))
    .on('error', handleError)
    .pipe(plugins.autoprefixer('last 1 version'))
    .pipe(gulp.dest(destPath))
    .pipe(plugins.size());
};

pipes.copyBower = function (){
  return gulp.src(bowerFiles(), { base: paths.bower_comps })
    .pipe(gulp.dest(paths.distDevBower));
};

pipes.buildScripts = function(srcPath, destPath) {
  srcPath = srcPath || paths.scripts;
  destPath = destPath || paths.distDev;

  return gulp.src(srcPath)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(destPath))
    .pipe(plugins.size());
};

pipes.buildPartials = function(srcPath, destPath) {
  srcPath = srcPath || paths.partials;
  destPath = destPath || paths.distDev;

  return gulp.src(srcPath)
    .pipe(gulp.dest(destPath))
    .pipe(plugins.size());
};

pipes.buildIndex = function(srcPath, destPath) {
  srcPath = srcPath || paths.index;
  destPath = destPath || paths.distDev;

  return gulp.src(srcPath)
    .pipe(gulp.dest(destPath))
    .pipe(plugins.size());
};

pipes.buildImages = function(srcPath, destPath) {
  srcPath = srcPath || paths.images;
  destPath = destPath || paths.distDev + '/assets/images';

  return gulp.src(srcPath)
    .pipe(plugins.cache(plugins.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(destPath))
    .pipe(plugins.size());
};

pipes.buildFonts = function() {
  //grab everything in bower_components dir, find all filtered files and copy them
  return gulp.src(paths.bower_comps_deep)
    .pipe(plugins.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe(gulp.dest(paths.distDevBower))
    .pipe(plugins.size());
};

pipes.buildApp = function () {
  return es.merge(pipes.buildStyles(), pipes.copyBower(), pipes.buildScripts(),
    pipes.buildPartials(), pipes.buildIndex(), pipes.buildImages(), pipes.buildFonts());
};

gulp.task('clean', function () {
  var deferred = plugins.q.defer();
  plugins.del(paths.distDev, function (){
    deferred.resolve();
  });
  return deferred.promise;
});

gulp.task('clear-cache', function (done) {
  return plugins.cache.clearAll(done);
});

gulp.task('styles', pipes.buildStyles);
gulp.task('copy-bower', pipes.copyBower);
gulp.task('scripts',pipes.buildScripts);
gulp.task('partials', pipes.buildPartials);
gulp.task('index', pipes.buildIndex);
gulp.task('images', pipes.buildImages);
gulp.task('fonts', pipes.buildFonts);

gulp.task('build', ['clean'], pipes.buildApp);
