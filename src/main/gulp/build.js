'use strict';

var gulp = require('gulp');

var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del', 'q', 'run-sequence']
});

var paths = {
  scripts: 'src/main/webapp/**/*.js',
  styles: 'src/main/webapp/management-console.less',
  images: 'src/main/assets/images/**/*',
  fonts: '/fonts/',
  languages: 'src/main/assets/languages/*',
  index: 'src/main/webapp/index.html',
  partials: ['src/main/webapp/**/*.html', '!src/main/webapp/index.html'],
  test: '.tmp',
  dist: 'dist',
  components: '/built_components',
  componentsDeep: '/built_components/**'
};

var filters = {
  fonts: plugins.filter(['**/*.{eot,svg,ttf,woff,woff2}'])
};

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(plugins.less({
      paths: [
        paths.dist + paths.components
      ],
      relativeUrls: true
    }))
    .on('error', handleError)
    .pipe(plugins.autoprefixer('last 1 version'))
    .pipe(gulp.dest(paths.test))
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest(paths.dist))
    .pipe(plugins.size());
});

gulp.task('partials', function () {
  return gulp.src(paths.partials)
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.dest(paths.test))
    .pipe(plugins.size());
});

gulp.task('index', function () {
  return gulp.src(paths.index)
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.dest(paths.test))
    .pipe(plugins.size());
});

gulp.task('languages', function () {
  var destPath = paths.dist + '/assets/languages';
  var buildPath = paths.test + '/assets/languages';

  return gulp.src(paths.languages)
    .pipe(gulp.dest(destPath))
    .pipe(gulp.dest(buildPath))
    .pipe(plugins.size());
});

gulp.task('images', function () {
  var destPath = paths.dist + '/assets/images';
  var buildPath = paths.test + '/assets/images';

  return gulp.src(paths.images)
    .pipe(plugins.cache(plugins.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(destPath))
    .pipe(gulp.dest(buildPath))
    .pipe(plugins.size());
});

gulp.task('fonts', function () {
  //grab everything in built_components dir, find all filtered files and copy them
  return gulp.src(paths.dist + paths.componentsDeep)
    .pipe(filters.fonts)
    .pipe(plugins.flatten())
    .pipe(gulp.dest(paths.dist + paths.fonts))
    .pipe(plugins.size());
});

gulp.task('components', function () {
  return gulp.src(plugins.npmFiles(), {base: './node_modules'})
    .pipe(gulp.dest(paths.test + paths.components))
    .pipe(gulp.dest(paths.dist + paths.components))
    .pipe(plugins.size());
});

gulp.task('test-dir', function () {
  return gulp.src(paths.scripts)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(paths.test))
    .pipe(plugins.size());
});

gulp.task('dist', function () {
  return gulp.src('src/main/webapp/*.html')
    .pipe(plugins.useref())
    .pipe(plugins.if('*.js', plugins.ngAnnotate()))
    .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.cleanCss()))
    .pipe(plugins.if('*.html', plugins.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest(paths.dist))
    .pipe(plugins.size());
});

gulp.task('clean-up', function () {
  return plugins.del(paths.dist + paths.components);
});

gulp.task('clean', function () {
  return plugins.del([paths.test, paths.dist]);
});

gulp.task('build', ['clean'], function (cb) {
  plugins.runSequence('components', [
    'fonts',
    'images',
    'index',
    'languages',
    'partials',
    'styles',
    'test-dir'
  ], 'dist', 'clean-up', cb);
});

