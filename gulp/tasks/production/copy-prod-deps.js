var gulp   = require('gulp');
var del = require('del');
var config = require('../../config').copyproddeps;
var fs = require('fs');
var _ = require('lodash');

/**
* Copy fonts to folder
*/
gulp.task('copy:prod:deps', function() {
    var json = JSON.parse(fs.readFileSync('./package.json'));
    var src = [];
    try{
        fs.accessSync(config.dest, fs.R_OK | fs.W_OK);
        del.sync(config.dest);
    }catch(e){}
    _.forIn(json.dependencies, function(value, key) {
        try{
            fs.accessSync('./node_modules/' + key, fs.R_OK | fs.W_OK);
            src.push('./node_modules/' + key + '/**/*');
        }catch(e){
            //code to action if file does not exist
        }
    });
    return gulp.src(src, { 'base' : './node_modules' })
        .pipe(gulp.dest(config.dest));
});
