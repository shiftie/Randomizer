var gulp   = require('gulp');
var config = require('../../config').doc;
var jsdoc = require('gulp-jsdoc3');

 gulp.task('doc', function (cb) {
    gulp.src(config.src, {read: false})
         .pipe(jsdoc(config, cb));
 });
