module.exports = (gulp, dir, config, cleanAll) => () => {
  const del = require('del');
  const path = require('path');

  var cleanSrc = function (directory) {
    return del([
      path.join(directory, '**', '*.js'),
      '!' + path.join(directory, '*.conf.js'),
      path.join(directory, '**', '*.js.map'),
      path.join(directory, '**', '*.css')
    ]);
  };

  var cleanDist = function (directory) {
    return del([
      path.join(directory, '**', '*'),
      '!' + path.join(directory, 'index.html')
    ]);
  };

  if (cleanAll) {
    cleanDist(config.distDir);
    cleanSrc(config.srcDir);
    return del([
      config.npmDir,
      config.jspmDir,
      config.typingsDir,
      config.targetDir
    ]);
  }

  if (dir === config.distDir) {
    return cleanDist(dir);
  } else {
    return cleanSrc(dir);
  }
};
