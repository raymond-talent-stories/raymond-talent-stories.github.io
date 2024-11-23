const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');

async function buildLess(cb) {
  return gulp.src('less/[^_]*.less')
    .pipe(less())
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./css'));
}

exports.less = buildLess;