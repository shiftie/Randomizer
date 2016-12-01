
var gulp         = require('gulp');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var watchify     = require('watchify');
var config       = require('../../config').browserify;

gulp.task('scripts', function(callback) {
    var bundleQueue = config.bundleConfigs.length;

    var browserifyThis = function(bundleConfig) {

        console.log('scripts call');
        var bundler = browserify({
            // Required watchify args
            cache: {}, packageCache: {}, fullPaths: false,
            // Specify the entry point of your app
            entries: bundleConfig.entries,
            // Add file extentions to make optional in your requires
            extensions: config.extensions,
            // Enable source maps!
            debug: config.debug
        }).transform('babelify', {plugins: ['transform-runtime'], presets: ['es2015','stage-2','react']});

        var bundle = function() {
            console.log('....Bundling');

            return bundler
                .bundle()
                // Report compile errors
                .on('error', function(err) { console.error(err); this.emit('end'); })
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specifiy the
                // desired output filename here.
                .pipe(source(bundleConfig.outputName))
                // Specify the output destination
                .pipe(gulp.dest(bundleConfig.dest))
                .on('finish', reportFinished);
        };

        if(global.isWatching) {
            // Wrap with watchify and rebundle on changes
            bundler = watchify(bundler);
            // Rebundle on update
            bundler.on('update', bundle);
        }

        var reportFinished = function() {
            // Log when bundling completes
            // bundleLogger.end(bundleConfig.outputName);
            console.log('OK');

            if(bundleQueue) {
                bundleQueue--;
                if(bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        return bundle();
    };

    config.bundleConfigs.forEach(browserifyThis);
});
