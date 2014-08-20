CSS-URL [![Build Status](https://travis-ci.org/galkinrost/gulp-rev-css-url.svg?branch=master)](https://travis-ci.org/galkinrost/gulp-rev-css-url)
=========

The lightweight plugin to override urls in css files to hashed after <a href="https://www.npmjs.org/package/gulp-rev">gulp-rev</a>

What is the result?
--
See <a href="https://github.com/galkinrost/gulp-rev-css-url/tree/master/expected">here</a>

Install
--
```sh
npm install gulp-rev-css-url
```

Usage
--

```javascript
var gulp=require('gulp');
var rev=require('gulp-rev');
var override=require('gulp-rev-css-url');

gulp.task('rev',function(){
    return gulp.src('./app/**/*')
                .pipe(rev())
                .pipe(override())
                .pipe(gulp.dest('./build/'))
                .pipe(rev.manifest())
                .pipe(gulp.dest('./build/'));
});

```
AND
```sh
gulp rev
```

Tests
--
```sh
npm test
```

License
----

MIT
