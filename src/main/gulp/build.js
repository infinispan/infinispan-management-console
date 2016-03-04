'use strict';

var gulp = require('gulp');
var gnf = require('gulp-npm-files');
var filter = require('gulp-filter');
var runSequence = require('run-sequence');

var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del', 'q']
});

var es = require('event-stream');

var paths = {
  scripts: 'src/main/webapp/**/*.js',
  styles: ['src/main/webapp/**/*.less','src/main/webapp/**/*.css'],
  images: 'src/main/assets/images/**/*',
  index: 'src/main/webapp/index.html',
  partials: ['src/main/webapp/**/*.html', '!src/main/webapp/index.html'],
  distDev: 'dist',
  distDevComps: 'dist/built_components',
  distDevCompsDeep: 'dist/built_components/**'
};


function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

var pipes = {};

pipes.copyComps = function (){
  return gulp.src(gnf(), { base: './node_modules' })
    .pipe(filter([
        '*/*.{js,css,map}',
        '*/{dist,css,less,js,fonts,release,components/font-awesome}/**']))
    .pipe(gulp.dest(paths.distDevComps))
    .pipe(plugins.size());
};

pipes.buildStyles = function(srcPath, destPath) {
  srcPath = srcPath || paths.styles;
  destPath = destPath || paths.distDev;

  return gulp.src(srcPath)
    .pipe(plugins.less({
      paths: [
        paths.distDevComps
      ]
    }))
    .on('error', handleError)
    .pipe(plugins.autoprefixer('last 1 version'))
    .pipe(gulp.dest(destPath))
    .pipe(plugins.size());
};

pipes.buildScripts = function() {
  var srcPath = paths.scripts;
  var destPath = paths.distDev;
  return gulp.src(srcPath)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(destPath))
    .pipe(plugins.size());
};

pipes.buildPartials = function() {
  var srcPath = paths.partials;
  var destPath = paths.distDev;
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
  //grab everything in built_components dir, find all filtered files and copy them
  return gulp.src(paths.distDevCompsDeep)
    .pipe(plugins.filter('**/*.{eot,svg,ttf,woff}'))
//    .pipe(plugins.flatten())
//    .pipe(gulp.dest(paths.distDev + '/fonts'))
    .pipe(gulp.dest(paths.distDevComps))
    .pipe(plugins.size());
};

pipes.buildApp = function () {
  return es.merge(pipes.buildStyles(), pipes.buildScripts(),
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

gulp.task('copy-comps', pipes.copyComps);
gulp.task('styles', pipes.buildStyles);
gulp.task('scripts',pipes.buildScripts);
gulp.task('partials', pipes.buildPartials);
gulp.task('index', pipes.buildIndex);
gulp.task('images', pipes.buildImages);
gulp.task('fonts', pipes.buildFonts);
gulp.task('buildApp', pipes.buildApp);
gulp.task('build', ['clean'], function (cb) {
  runSequence('copy-comps', 'buildApp', cb);
});

