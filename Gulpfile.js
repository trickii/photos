const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    // jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    imageresize = require('gulp-image-resize'),
    mStream = require('merge-stream'),
    newer = require('gulp-newer'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    removeUseStrict = require('gulp-remove-use-strict'),
    uglify = require('gulp-uglify')
;

gulp.task('images', function () {

    const folders = {
        src: ['data/**/*.jpg', 'src/images/**/*'],
        dest: 'images/'
    };
    const imageminConfig = {
        optimizationLevel: 3,
        progressive: false,
        interlaced: false
    };

    return gulp.src(folders.src)
        .pipe(newer(folders.dest))
        .pipe(imagemin(imageminConfig))
        .pipe(gulp.dest(folders.dest));
});

gulp.task('favicon', function () {

    const folders = {
        src: 'src/images/favicon.png',
        sizes: [192, 180, 152, 144, 120, 114, 96, 76, 72, 60, 57, 32, 16],
        filename: 'favicon-%sx%s.png',
        dest: 'images/'
    };

    let stream = new mStream();

    for (let i = 0; i < folders.sizes.length; i++) {
        let size = folders.sizes[i];
        let fname = folders.filename.replace('%s', size).replace('%s', size);
        let st = gulp.src(folders.src)
            .pipe(imageresize({
                width: size,
                height: size,
                crop: false
            }))
            .pipe(rename(fname))
            .pipe(gulp.dest(folders.dest));

        stream.add(st);
    }

    return stream.isEmpty() ? null : stream;
});

gulp.task('scripts', function () {

    const folders = {
        src: ['data/*.js', 'src/js/**/*.js'],
        dest: 'js/app.js'
    };
    const uglifyConfig = {
        mangle: {
            'keep_fnames': true // rename variables, turn off if bugs appear
        },
        compress: {
            hoist_funs: false, // do not sort code
            unused: false
        }
    };

    return gulp.src(folders.src)
        .pipe(sourcemaps.init())
        // .pipe(removeUseStrict())
        .pipe(babel({presets: ['env']}))
        .pipe(concat(folders.dest))
        .pipe(uglify(uglifyConfig))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});

gulp.task('sass', function () {

    const folders = {
        src: 'src/sass/main.scss',
        dest: 'css/main.css'
    };
    const sassConfig = {
        outputStyle: 'compressed'
    };

    return st = gulp.src(folders.src)
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'));
});

gulp.task('default', ['sass', 'scripts', 'images']);
