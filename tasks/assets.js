module.exports = (gulp, config) => () => {
    const path = require('path');

    return gulp.src([path.join(config.assetsDir, '**', '*')], {base: '.'})
        .pipe(gulp.dest(config.distDir));
};
