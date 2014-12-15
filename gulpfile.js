var gulp = require('gulp');
var scss = require('gulp-ruby-sass');
var scsslint = require('gulp-scss-lint');
var traceur = require('gulp-traceur');
var plumber = require('gulp-plumber');
var cache = require('gulp-cached');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    styles: 'front/styles/**/*.scss',
    js: 'front/js/**/*.js'
};

gulp.task('connect', function() {
    connect.server({
        'root': 'dist'
    });
});

gulp.task('html', function() {
    gulp.src('front/index.html')
        .pipe(gulp.dest('app/'));
});

gulp.task('scss', ['scss-lint'], function() {
    gulp.src(paths.styles)
        .pipe(plumber())
        .pipe(scss())
        .pipe(gulp.dest('dist/styles/'));
});

gulp.task('scss-lint', function() {
    gulp.src(paths.styles)
        .pipe(cache('scss-lint'))
        .pipe(scsslint({config: 'scsslint.yml'}));
});

gulp.task('traceur', function() {
    return gulp.src(paths.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(traceur({
            experimental: true
        }))
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('watch', function () {
    gulp.watch(paths.js, ['traceur']);
    gulp.watch(paths.styles, ['scss']);
    gulp.watch('front/index.html', ['html']);
});

gulp.task('default', ['scss', 'html', 'traceur', 'watch', 'connect']);
