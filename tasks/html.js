module.exports = (gulp, config) => () => {
  const path = require('path');

  return gulp.src([path.join(config.srcDir, '/**/*.html'), '!src/index.html', '!src/index_tmp.html'])
      .pipe(gulp.dest(config.distDir));

};
