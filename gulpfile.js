var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var base64 = require('gulp-base64');
var css_minify = require('gulp-minify-css');
var browserify = require('gulp-browserify');

gulp.task('stylus',function(){
    gulp.src('./src/*.styl')
        .pipe(stylus())
        .pipe(css_minify())
        .pipe(base64())
        .pipe(gulp.dest('./dist/'));
});


gulp.task('stylus-min',function(){
    gulp.src('./src/*.styl')
        .pipe(stylus())
        .pipe(css_minify())
        .pipe(base64())
        .pipe(rename('zjs_markdown_editor.min.css'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js',function(){
    gulp.src('./src/*.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js-min',function(){
    gulp.src('./src/*.js')
        .pipe(browserify())
        .pipe(rename('zjs_markdown_editor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));

});

