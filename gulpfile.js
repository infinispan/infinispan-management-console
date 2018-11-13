const gulp = require('gulp');
const path = require('path');

const minimist = require('minimist');
var cmdOptions = minimist(process.argv.slice(2));


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
    moduleName: 'app',
    cmdParams: cmdOptions
};

gulp.task('clean:all', require('./tasks/clean')(gulp, config.srcDir, config, true));
gulp.task('clean:src', require('./tasks/clean')(gulp, config.srcDir, config));
gulp.task('clean:dist', require('./tasks/clean')(gulp, config.distDir, config));
gulp.task('clean', ['clean:src', 'clean:dist']);

gulp.task('less', require('./tasks/less')(gulp, config));
gulp.task('constants', require('./tasks/constants')(gulp, config));
gulp.task('fonts', require('./tasks/fonts')(gulp, config));
gulp.task('html', require('./tasks/html')(gulp, config));
gulp.task('json', require('./tasks/json')(gulp, config));
gulp.task('assets', require('./tasks/assets')(gulp, config));

gulp.task('compile:src', ['clean:src'], require('./tasks/compile')(gulp, config.srcDir));
gulp.task('compile', ['constants', 'compile:src']);

gulp.task('serve:dist', ['build:dist'], require('./tasks/server')(gulp, config.distDir, false, true));
gulp.task('serve', ['constants', 'compile:src', 'less', 'fonts', 'html', 'json', 'assets'],
    require('./tasks/server')(gulp, config.srcDir, config.watchDir, true, config.projectDir, config));

gulp.task('typedoc',require('./tasks/typedoc')(gulp, 'src/services/**/*.ts'));

gulp.task('check:eslint', require('./tasks/check-eslint')(gulp, config));
gulp.task('check:tslint', ['check:tslint:src']);
gulp.task('check:tslint:src', require('./tasks/check-tslint')(gulp, config.srcDir, config.tsLintSrcConf));
gulp.task('check', require('./tasks/check')());

gulp.task('ng:directives', ['compile:src'], require('./tasks/ng-directives')(gulp, config));
gulp.task('ng:annotate', ['ng:directives'], require('./tasks/ng-annotate')(gulp, config));

gulp.task('build:dist', ['constants', 'ng:annotate', 'less', 'fonts', 'html', 'json', 'assets'], require('./tasks/build-dist')(gulp, config));
gulp.task('build', require('./tasks/build')());

gulp.task('default', require('./tasks/default')());

