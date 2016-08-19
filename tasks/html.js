module.exports = (gulp, config) => () => {
  const path = require('path');
  const filter = require('gulp-filter');

  return gulp.src(path.join(config.srcDir, '**/*.html'))
    .pipe(filter(['index.html']))
    .pipe(gulp.dest(config.distDir));

};
