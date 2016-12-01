var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var size   = require('gulp-size');
var concat = require('gulp-concat');
var config = require('../../config').optimize.js;
var fs     = require('fs');

/**
 * Copy and minimize JS files
 */
gulp.task('optimize:js', function() {
    var version = fs.readFileSync('.version', 'utf8');
    return gulp.src(config.src)
        .pipe(uglify(config.options))
        .pipe(concat('build.min-' + version + '.js'))
        .pipe(gulp.dest(config.dest))
        .pipe(size());
});
