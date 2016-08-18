module.exports = (gulp, config) => () => {
  const less = require('gulp-less');
  const prefixer = require('gulp-autoprefixer');
  const path = require('path');

  return gulp.src(config.lessFile)
    .pipe(less({
      paths: [path.join(config.npmDir)],
      relativeUrls: true
    }).on('error', handleError))
    .pipe(prefixer('last 1 version'))
    .pipe(gulp.dest(config.cssDir));

  function handleError(err) {
    console.error(err.toString());
    this.emit('end');
  }
};
