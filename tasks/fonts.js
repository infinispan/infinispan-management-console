module.exports = (gulp, config) => () => {
  const path = require('path');
  const filter = require('gulp-filter');
  const output = path.join(config.distDir, 'vendor');
  const input = [
    path.join(config.jspmDir, '**/dist/fonts/*'),
    '!**/bootstrap/**',
  ];

  return gulp.src(input, {nodir: true})
    .pipe(filter(['**/*.{eot,svg,ttf,woff,woff2}']))
    .pipe(gulp.dest(output));
};
