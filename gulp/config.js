/* eslint-disable */

var build = 'static';
var srcAssets         = 'public/src';
var developmentAssets = 'public/dist';
var productionAssets  = 'public/dist/prod';

module.exports = {
    copyfonts: {
        development: {
            src:  [srcAssets + '/css/fonts/**/*'],
            dest: developmentAssets + '/css/fonts'
        },
        production: {
            src:  developmentAssets + '/css/fonts/**/*',
            dest: productionAssets + '/css/fonts'
        }
    },
    copyproddeps: {
        dest: './node_modules-prod'
    },
    doc: {
        src:  [
            srcAssets + '/js/**/*.js',
            '!' + srcAssets + '/js/vendor/**/*.js',
            'website/views/areas/quicksearch-react/**/*.js'
        ],
        opts: {
            destination: './docs'
        },
        plugins: ['node_modules/jsdoc-babel'],
        babel: {
            presets: ['es2015','stage-2','react']
        }
    },
    styles: {
        src: [
            srcAssets + '/**/*.scss',
            '!' + srcAssets + '/**/vendor/**/*.scss'
        ],
        dest: developmentAssets + '/css',
        options: {
            compass:{
                // config_file: './config.rb',
                css: 'public/dist/css',
                sass: 'public/src/css',
                style: 'expanded',
                comments: true
            },
            precss: {},
            autoprefixer: {
                browsers: [
                    'last 2 versions',
                    'safari 5',
                    'ie 8',
                    'ie 9',
                    'opera 12.1',
                    'ios 6',
                    'android 4'
                ],
                cascade: true
            },
            mqpacker: {}
        }
    },
    scripts: {
    },
    images: {
        src: [srcAssets + '/img/**/*'],
        dest: developmentAssets + '/img'
    },
    delete: {
        src: [developmentAssets]
    },
    base64: {
        src: developmentAssets + '/css/*.css',
        dest: developmentAssets + '/css',
        options: {
            baseDir: build,
            extensions: ['png'],
            maxImageSize: 20 * 1024, // bytes
            debug: false
        }
    },
    watch: {
        styles:  [
            srcAssets + '/**/*.scss',
            '!' + srcAssets + '/**/vendor/**/*.scss',
            'website/views/areas/**/*.scss'
        ],
        scripts: [
            srcAssets + '/js/**/*.js',
            'website/views/areas/**/*.js'
        ],
        images:  srcAssets + '/img/**/*'
    },
    browserify: {
        // Enable source maps
        debug: true,
        // Additional file extensions to make optional
        extensions: [],
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [
            {
                entries:    srcAssets + '/js/app.js',
                dest:       developmentAssets + '/js',
                outputName: 'build.js'
            }
        ]
    },
    optimize: {
        css: {
            src:  [
                /*
                Do not modify, stylesheet list is extracted from layout
                Wrap your list with \/* import style: start *\/ & \/* import style: end *\/
                Like (do not forget to unescape slashes!!!!):
                $styles = array(
                    \/* import style: start *\/
                    '/static/src/css/vendor/webshims/shim.css',
                    ....
                    '/static/dist/prod/css/main.css'
                    \/* import style: end *\/
                );
                */
            ],
            dest: productionAssets + '/css/',
            options: {
                keepSpecialComments: 0
            }
        },
        js: {
            src:  developmentAssets + '/js/*.js',
            dest: productionAssets + '/js/',
            options: {
                mangle: false
            }
        },
        images: {
            src:  developmentAssets + '/img/**/*.{jpg,jpeg,png,gif}',
            dest: productionAssets + '/img/',
            options: {
                optimizationLevel: 3,
                progessive: true,
                interlaced: true
            }
        }
    },
    webp: {
        src: productionAssets + '/img/**/*.{jpg,jpeg,png}',
        dest: productionAssets + '/img/',
        options: {}
    },
    gzip: {
        src: [productionAssets + '/**/*.{html,xml,json,css,js}', '!' + productionAssets + '/**/css/fonts/**/*.{html,xml,json,css,js}'],
        dest: productionAssets,
        options: {}
    }
};
