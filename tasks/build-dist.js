module.exports = (gulp, config) => () => {
  const path = require('path');
  const replace = require('gulp-string-replace');
  const rename = require("gulp-rename");
  const Builder = require('jspm').Builder;
  const builder = new Builder();
  const packageJson = require(path.join(config.projectDir, 'package.json'));
  const appName = packageJson.name;
  const version = packageJson.version;
  const fileName = appName.concat(version);

  return beginBuild()
    .then(buildSFX).then(changeIndexJsVersion)
    .catch((err) => {
      console.log('\n\tBuild Failed\n', err);
      process.exit(1);
    });

  function beginBuild() {
    builder.reset();
    return builder.loadConfig(path.join(config.projectDir, packageJson.jspm.configFile));
  }

  function buildSFX() {
    const appName = packageJson.name;
    const version = packageJson.version;
    const fileName = appName.concat('-').concat(version);
    const distFileName = `${fileName}.min.js`;
    const outFile = path.join(config.scriptsDir, distFileName);
    const moduleName = config.moduleName;
    const buildConfig = {
      format: 'global',
      minify: false,
      sourceMaps: true
    };
    return builder.buildStatic(moduleName, outFile, buildConfig);
  }

  function changeIndexJsVersion() {
    return gulp.src(path.join(config.srcDir, 'index_tmp.html'))
      .pipe(rename('index.html'))
      .pipe(replace(new RegExp('@appVersion@', 'g'), version))
      .pipe(gulp.dest(config.distDir));
  }

};
