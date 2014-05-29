var gulp = require('gulp');
var jshint = require('gulp-jshint');

var src = ['index.js', 'test.js', 'gulpfile.js'];

gulp.task('lint', function () {
    return gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function () {
    gulp.watch(src, ['lint']);
});