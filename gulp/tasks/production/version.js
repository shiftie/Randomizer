var gulp    = require('gulp');
var fs      = require('fs');
var crypto  = require('crypto');
var argv    = require('yargs').argv;

var current_date = (new Date()).valueOf().toString();
var random = Math.random().toString();
var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');

gulp.task('version', function() {
    if (!argv['keep-version']) {
        return fs.writeFile('.version', hash.substr(0, 8), function(err) {
            if(err) {
              return console.log(err);
            }
        });
    } else {
        return 1;
    }
});
