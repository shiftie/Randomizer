var gulp   = require('gulp');
var config = require('../../config');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

var notifyInfo = {
    title: 'Gulp'
};

gulp.task('watch', function() {
    livereload.listen();

    gulp.watch(config.watch.styles,  ['styles']);
    gulp.watch(config.watch.scripts, ['scripts']);
    gulp.watch(config.watch.images,  ['images']);

    gulp.watch(config.styles.dest + '/**/*.css', function (event) {
        gulp.src(event.path)
            .pipe(plumber())
            .pipe(livereload())
            .pipe(notify({
                title: notifyInfo.title,
                icon: notifyInfo.icon,
                message: 'Wootah!!!!' + event.path.replace(__dirname, '').replace(/\\/g, '/') + ' was ' + event.type + ' and reloaded'
            }));
    });
});
