var gulp = require('gulp');
var scss = require('gulp-ruby-sass');
var scsslint = require('gulp-scss-lint');
var plumber = require('gulp-plumber');
var cache = require('gulp-cached');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var to5 = require("gulp-6to5");
var browserify = require('gulp-browserify');
var server = require('gulp-express');
var react = require('gulp-react');
var rename = require('gulp-rename');

var paths = {
    front: {
        mainScss: 'front/styles/main.scss',
        styles: 'front/styles/**/*.scss',
        js: 'front/js/**/*.js',
        jsLibs: [
            'bower_components/lodash/dist/lodash.js',
            'bower_components/bootstrap-material-design/dist/js/ripples.js',
            'bower_components/bootstrap-material-design/dist/js/material.js',
            'bower_components/react/react-with-addons.js',
            'bower_components/flux/dist/Flux.js',
            'bower_components/react-router/dist/react-router.js'
        ],
        cssLibs: [
            'bower_components/bootstrap-material-design/dist/css/ripples.min.css',
            'bower_components/bootstrap-material-design/dist/css/material-wfont.css'
        ]
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
        .pipe(gulp.dest('dist/'));
});

gulp.task('front-material-design', function() {
    gulp.src([
        'bower_components/bootstrap-material-design/dist/fonts/*'
    ])
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('front-scss', ['scss-lint'], function() {
    gulp.src(paths.front.mainScss)
        .pipe(plumber())
        .pipe(scss())
        .pipe(gulp.dest('dist/styles/'));
});

gulp.task('scss-lint', function() {
    gulp.src(paths.front.styles)
        .pipe(cache('scss-lint'))
        .pipe(scsslint({config: 'scsslint.yml'}));
});

gulp.task('6to5', function() {
    return gulp.src(paths.front.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(to5({modules: "common", experimental:true, runtime:false}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('tmp/js/'));
});

gulp.task('front-6to5', ['6to5'], function() {
    return gulp.src('tmp/js/main.js')
        .pipe(plumber())
        .pipe(browserify({
            insertGlobals: true,
            debug: true,
            entry: 'tmp/js/'
        }))
        .pipe(rename('main.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('jslibs', function() {
    gulp.src(paths.front.jsLibs)
        .pipe(plumber())
        .pipe(concat("libs.js"))
        .pipe(gulp.dest("dist/js/"))
});

gulp.task('csslibs', function() {
    gulp.src(paths.front.cssLibs)
        .pipe(plumber())
        .pipe(concat("libs.css"))
        .pipe(gulp.dest("dist/styles/"))
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
    gulp.watch(paths.front.js, ['front-6to5']);
    gulp.watch(paths.front.styles, ['front-scss']);
    gulp.watch('front/index.html', ['front-html']);
    // Back
    gulp.watch(paths.back.js, ['back-6to5', 'back-server']);
});

gulp.task('default', ['front-material-design',
                      'front-scss',
                      'front-html',
                      'front-6to5',
                      'jslibs',
                      'csslibs',
                      'back-6to5',
                      'back-server',
                      'watch',
                      'connect']);
