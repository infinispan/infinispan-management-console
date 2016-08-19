module.exports = (gulp, config) => () => {
  const path = require('path');
  const filter = require('gulp-filter');
  const flatten = require('gulp-flatten');
  const fs = require('fs');
  const input = path.join(config.npmDir, '**/*');
  const output = path.join(config.distDir, config.fonts);

  // If fonts dir already exists, do nothing. TODO make this overridable
  try {
    fs.lstatSync(output).isDirectory();
    return;
  } catch (e) {
    // ignore
  }

  return gulp.src(input)
    .pipe(filter(['**/*.{eot,svg,ttf,woff,woff2}']))
    .pipe(flatten())
    .pipe(gulp.dest(output));
};
