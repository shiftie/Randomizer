var gulp           = require('gulp');
var postcss        = require('gulp-postcss');
///var precss         = require('precss');
//var nano           = require('gulp-cssnano');
var plumber        = require('gulp-plumber');
var sourcemaps     = require('gulp-sourcemaps');
var gutil          = require('gulp-util');
var compass        = require('gulp-compass');
var autoprefixer   = require('autoprefixer');
var mqpacker       = require('css-mqpacker');
var config         = require('../../config');

function onError (err) {
    gutil.beep();
    console.log(err);
    this.emit('end');
}

/**
 * Rund CSS through PostCSS and it's plugins
 * Build sourcemaps and minimize
 */
var processors = [
  // precss(config.styles.options.precss),
  autoprefixer(config.styles.options.autoprefixer),
  mqpacker(config.styles.options.mqpacker)
];

gulp.task('styles', function () {
  return gulp.src(config.styles.src, {basePath: ''})
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(sourcemaps.init())
    .pipe(compass(config.styles.options.compass))
    .pipe(postcss(processors))
    // .pipe(nano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.styles.dest));
});
