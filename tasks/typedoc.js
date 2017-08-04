module.exports = (gulp, path) => () => {
  const typedoc = require('gulp-typedoc');

  gulp.task('typedoc', function() {
    return gulp
      .src([path])
      .pipe(typedoc({
        module: 'commonjs',
        target: 'es5',
        out: 'docs/',
        name: 'Infinispan management console'
      }))
      ;
  });
};
