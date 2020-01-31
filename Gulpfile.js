const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    imageresize = require('gulp-image-resize'),
    mStream = require('merge-stream'),
    newer = require('gulp-newer'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    webp = require('gulp-webp')
;

function images() {
    const folders = {
        src: ['data/**/*.jpg', 'src/images/**/*'],
        dest: 'images/'
    };
    const imageminConfig = {
        optimizationLevel: 3,
        progressive: false,
        interlaced: false
    };

    const webpConfig = {
        preset: 'photo',
        quality: 75
    };

    return gulp.src(folders.src)
    .pipe(newer(folders.dest))
    // .pipe(imagemin(imageminConfig))
    .pipe(webp(webpConfig))
    .pipe(gulp.dest(folders.dest));
}

exports.images = images;

function favicon() {

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
}

exports.favicon = favicon;

function scripts() {

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
    .pipe(babel({presets: ['env']}))
    .pipe(concat(folders.dest))
    .pipe(uglify(uglifyConfig))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
}

exports.scripts = scripts;

function css() {

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
}

exports.css = css;

gulp.task('default', gulp.series(css, scripts, images, (done) => {
    done();
}));

