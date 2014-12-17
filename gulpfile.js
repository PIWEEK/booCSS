var gulp = require('gulp');
var scss = require('gulp-ruby-sass');
var scsslint = require('gulp-scss-lint');
var traceur = require('gulp-traceur');
var plumber = require('gulp-plumber');
var cache = require('gulp-cached');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var to5 = require("gulp-6to5");
var server = require('gulp-express');


var paths = {
    front: {
        styles: 'front/styles/**/*.scss',
        js: 'front/js/**/*.js'
    },
    back: {
        js: 'back/*.js'
    }
};

gulp.task('connect', function() {
    connect.server({
        'root': 'dist'
    });
});

gulp.task('front-html', function() {
    gulp.src('front/index.html')
        .pipe(gulp.dest('app/'));
});

gulp.task('front-scss', ['scss-lint'], function() {
    gulp.src(paths.front.styles)
        .pipe(plumber())
        .pipe(scss())
        .pipe(gulp.dest('dist/styles/'));
});

gulp.task('scss-lint', function() {
    gulp.src(paths.front.styles)
        .pipe(cache('scss-lint'))
        .pipe(scsslint({config: 'scsslint.yml'}));
});

gulp.task('front-traceur', function() {
    return gulp.src(paths.front.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(traceur({
            experimental: true
        }))
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('back-6to5', function () {
    return gulp.src(paths.back.js)
        .pipe(to5())
        .pipe(gulp.dest('dist/node/back/'));
});

gulp.task('back-server', function () {
    return server.run({
        file: 'dist/node/back/server.js'
    });
});

gulp.task('watch', function () {
    // Front
    gulp.watch(paths.front.js, ['front-traceur']);
    gulp.watch(paths.front.styles, ['front-scss']);
    gulp.watch('front/index.html', ['front-html']);
    // Back
    gulp.watch(paths.back.js, ['back-6to5', 'back-server']);
});

gulp.task('default', ['front-scss',
                      'front-html',
                      'front-traceur',
                      'back-6to5',
                      'back-server',
                      'watch',
                      'connect']);
