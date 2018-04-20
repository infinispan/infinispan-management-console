module.exports = (gulp, cfg) =>() => {

  const path = require('path');
  const rename = require('gulp-rename');
  var ngConstant = require('gulp-ng-constant');
  var config = require('../src/constants.json'), envConfig = config.infinispan;


  if (cfg.branding === 'infinispan') {
    envConfig = config.infinispan;
  } else {
    envConfig = config.jdg;
  }

  return ngConstant({
    constants: envConfig,
    templatePath: path.join(cfg.srcDir, 'constants.tpl.ejs'),
    stream: true
  }).pipe(rename('constants.ts'))
    .pipe(gulp.dest(cfg.srcDir));
}
