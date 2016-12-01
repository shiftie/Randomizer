var gulp           = require('gulp');
var size           = require('gulp-size');
var nano           = require('gulp-cssnano');
var concat         = require('gulp-concat');
var config         = require('../../config').optimize.css;
var path           = require('path');
var fs             = require('fs');
var postcss        = require('gulp-postcss');
var autoprefixer   = require('autoprefixer');
var mqpacker       = require('css-mqpacker');
var mqpackerConfig = require('../../config').styles.options.mqpacker;
/**
 * Copy CSS files
 */
gulp.task('optimize:css', function() {
    /* Copies pimcore.css to prod css folder */
    gulp.src(['./static/dist/css/pimcore.css'])
        .pipe(nano())
        .pipe(gulp.dest(config.dest));

    /* Imports stylesheets from $styles array from layout (standard.php) */
    fs.readFile(path.resolve(__dirname + '/../../..' + '/website/views/layouts/standard.php'), 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        /* Gets values from $styles array as string */
        var re = /\/\*importstyle:start\*\/(.*)\/\*importstyle:end\*\//i;
        data = data.replace(/\s*/g, '').match(re);
        if(data[1]){
            // Removes commented entries
            data = data[1].replace(/\s*/g, '')
                            .replace(/\/\*.*?\*\//g, '')
                            .replace(/\/\/.*?,/g, '')
                            .split(',')
                            .map(function(item){
                                // Removes quotes from each entry
                                return item.replace(/\'/g, '');
                            })
                            .filter(
                                function(item){
                                    // Keeps only valid entries
                                    return item.length > 0;
                                }
                            );
        }

        config.src = data;

        // Resolves all paths against the development css folder
        for (var i = 0; i < config.src.length; i++) {
            config.src[i] = path.resolve(__dirname + '/../../..' + config.src[i]).replace(/[\\|\/]+prod/, '');
        }

        var version = fs.readFileSync('.version', 'utf8');
        var processors = [
            mqpacker(mqpackerConfig)
        ];

        return gulp.src(config.src)
            .pipe(concat('build.min-' + version + '.css'))
            .pipe(nano())
            .pipe(postcss(processors))
            .pipe(gulp.dest(config.dest))
            .pipe(size());
    });
});
