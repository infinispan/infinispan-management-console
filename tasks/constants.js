module.exports = (gulp, cfg) =>() => {

  const path = require('path');
  const rename = require('gulp-rename');
  const ngConstant = require('gulp-ng-constant');
  var config = require('../project.json');

  return ngConstant({
    constants: config,
    templatePath: path.join(cfg.srcDir, 'constants.tpl.ejs'),
    stream: true
  }).pipe(rename('Constants.ts'))
    .pipe(gulp.dest(cfg.srcDir));
}
