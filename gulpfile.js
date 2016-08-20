const gulp = require('gulp');
const path = require('path');
const sequence = require('run-sequence');

const config = {
  projectDir: __dirname,
  taskDir: path.join(__dirname, 'tasks'),
  configDir: path.join(__dirname, 'config'),
  srcDir: path.join(__dirname, 'src'),
  lessFile: path.join(__dirname, 'src/ManagementConsole.less'),
  cssDir: path.join(__dirname, 'src'),
  docsDir: path.join(__dirname, 'docs'),
  distDir: path.join(__dirname, 'dist/'),
  scriptsDir: path.join(__dirname, 'dist/scripts'),
  tsLintSrcConf: path.join(__dirname, 'tslint.json'),
  watchDir: path.join(__dirname, 'src'),
  npmDir: path.join(__dirname, 'node_modules'),
  fonts: path.join('fonts'),
  moduleName: 'app',
};

gulp.task('clean:src', require('./tasks/clean')(gulp, config.srcDir));
gulp.task('clean', ['clean:src']);

gulp.task('less', require('./tasks/less')(gulp, config));
gulp.task('fonts', require('./tasks/fonts')(gulp, config));
gulp.task('html', require('./tasks/html')(gulp, config));
gulp.task('dist', sequence(['less', 'fonts', 'html']));

// gulp.task('compile:src', sequence('dist'), require('./tasks/compile')(gulp, config.srcDir));
// gulp.task('compile', ['compile:src']);
//
// gulp.task('serve:docs', ['build:docs'], require('./tasks/server')(gulp, config.docsDir, false, true));
// gulp.task('serve:e2e', require('./tasks/server')(gulp, __dirname, false));
// gulp.task('serve:dist', ['build:dist'], require('./tasks/server')(gulp, config.distDir, config.distDir, true, false));
// gulp.task('serve', ['compile:src'], require('./tasks/server')(gulp, config.srcDir, config.watchDir, true, config.projectDir));
//
// gulp.task('check:eslint', require('./tasks/check-eslint')(gulp, config));
// gulp.task('check:tslint', ['check:tslint:src']);
// gulp.task('check:tslint:src', require('./tasks/check-tslint')(gulp, config.srcDir, config.tsLintSrcConf));
// gulp.task('check', require('./tasks/check')());
//
// gulp.task('ng:directives', ['compile:src'], require('./tasks/ng-directives')(gulp, config));
// gulp.task('ng:annotate', ['ng:directives'], require('./tasks/ng-annotate')(gulp, config));
// gulp.task('ng:annotate', [], require('./tasks/ng-annotate')(gulp, config));
//
// gulp.task('build:dist', ['ng:annotate'], require('./tasks/build-dist')(gulp, config));
// gulp.task('build:docs', require('./tasks/build-typedoc')(gulp, config));
// gulp.task('build', require('./tasks/build')());
//
// gulp.task('default', require('./tasks/default')());

gulp.task('compile:src', ['clean:src'], require('./tasks/compile')(gulp, config.srcDir));
gulp.task('compile:test', ['clean:test'], require('./tasks/compile')(gulp, config.testDir));
gulp.task('compile', ['compile:src', 'compile:test']);

gulp.task('serve:docs', ['build:docs'], require('./tasks/server')(gulp, config.docsDir, false, true));
gulp.task('serve:e2e', require('./tasks/server')(gulp, __dirname, false));
gulp.task('serve:dist', ['build:dist'], require('./tasks/server')(gulp, config.distDir, false, true));
gulp.task('serve', ['compile:src'], require('./tasks/server')(gulp, config.srcDir, config.watchDir, true, config.projectDir));

gulp.task('check:eslint', require('./tasks/check-eslint')(gulp, config));
gulp.task('check:tslint', ['check:tslint:src']);
gulp.task('check:tslint:src', require('./tasks/check-tslint')(gulp, config.srcDir, config.tsLintSrcConf));
gulp.task('check', require('./tasks/check')());

gulp.task('ng:directives', ['compile:src'], require('./tasks/ng-directives')(gulp, config));
gulp.task('ng:annotate', ['ng:directives'], require('./tasks/ng-annotate')(gulp, config));

gulp.task('build:dist', ['ng:annotate'], require('./tasks/build-dist')(gulp, config));
gulp.task('build:docs', require('./tasks/build-typedoc')(gulp, config));
gulp.task('build', require('./tasks/build')());

gulp.task('default', require('./tasks/default')());

