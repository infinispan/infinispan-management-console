module.exports = (gulp, config) => () => {
  const path = require('path');
  const filter = require('gulp-filter');
  const flatten = require('gulp-flatten');
  const fs = require('fs');
  const input = path.join(config.npmDir, '**/*');
  const output = path.join(config.distDir, config.fonts);

  // If fonts dir already exists, do nothing. TODO make this overridable
  if (fs.lstatSync(output).isDirectory()) {
    return;
  }

  return gulp.src(input)
    // .pipe(debug({title: 'beforeFilter'}))
    .pipe(filter(['**/*.{eot,svg,ttf,woff,woff2}']))
    // .pipe(debug({title: 'afterFilter'}))
    .pipe(flatten())
    .pipe(gulp.dest(output));
};
