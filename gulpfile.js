const gulp = require('gulp');
const path = require('path');

const config = {
    projectDir: __dirname,
    assetsDir: path.join(__dirname, 'assets'),
    taskDir: path.join(__dirname, 'tasks'),
    configDir: path.join(__dirname, 'config'),
    srcDir: path.join(__dirname, 'src'),
    lessFile: path.join(__dirname, 'src/ManagementConsole.less'),
    cssDir: path.join(__dirname, 'src'),
    docsDir: path.join(__dirname, 'docs'),
    distDir: path.join(__dirname, 'dist'),
    scriptsDir: path.join(__dirname, 'dist/scripts'),
    tsLintSrcConf: path.join(__dirname, 'tslint.json'),
    watchDir: path.join(__dirname, 'src'),
    npmDir: path.join(__dirname, 'node_modules'),
    jspmDir: path.join(__dirname, 'vendor'),
    typingsDir: path.join(__dirname, 'typings'),
    targetDir: path.join(__dirname, 'target'),
    fonts: path.join('fonts'),
    moduleName: 'app'
};

gulp.task('clean:all', require('./tasks/clean')(gulp, config.srcDir, config, true));
gulp.task('clean:src', require('./tasks/clean')(gulp, config.srcDir, config));
gulp.task('clean:dist', require('./tasks/clean')(gulp, config.distDir, config));
gulp.task('clean', ['clean:src', 'clean:dist']);

gulp.task('less', require('./tasks/less')(gulp, config));
gulp.task('fonts', require('./tasks/fonts')(gulp, config));
gulp.task('html', require('./tasks/html')(gulp, config));
gulp.task('assets', require('./tasks/assets')(gulp, config));

gulp.task('compile:src', ['clean:src'], require('./tasks/compile')(gulp, config.srcDir));
gulp.task('compile', ['compile:src']);

gulp.task('serve:dist', ['build:dist'], require('./tasks/server')(gulp, config.distDir, false, true));
gulp.task('serve', ['compile:src', 'less', 'fonts', 'html', 'assets'],
    require('./tasks/server')(gulp, config.srcDir, config.watchDir, true, config.projectDir, config));

gulp.task('check:eslint', require('./tasks/check-eslint')(gulp, config));
gulp.task('check:tslint', ['check:tslint:src']);
gulp.task('check:tslint:src', require('./tasks/check-tslint')(gulp, config.srcDir, config.tsLintSrcConf));
gulp.task('check', require('./tasks/check')());

gulp.task('ng:directives', ['compile:src'], require('./tasks/ng-directives')(gulp, config));
gulp.task('ng:annotate', ['ng:directives'], require('./tasks/ng-annotate')(gulp, config));

gulp.task('build:dist', ['ng:annotate', 'less', 'fonts', 'html', 'assets'], require('./tasks/build-dist')(gulp, config));
gulp.task('build', require('./tasks/build')());

gulp.task('default', require('./tasks/default')());

