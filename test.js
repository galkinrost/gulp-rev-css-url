var rev = require('gulp-rev');
var fs = require('fs');
var gulp = require('gulp');
var fse = require('fs-extra');
var override = require('./index');

describe('gulp-rev-css-url', function () {
    beforeEach(function (done) {
        fse.remove('./results', done);
    })

    it('Should override urls in css', function (done) {
        var expectedCSS = '.background-image {\n    background-image: url(\'../images/dummy-7051c65f.jpg\');\n}';
        gulp.src('./fixtures/**/*')
            .pipe(rev())
            .pipe(override())
            .pipe(gulp.dest('./results/'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./results/'))
            .on('end', function () {
                var css = fs.readFileSync('./results/styles/styles-6a09860b.css', 'utf-8');
                css.should.be.equal(expectedCSS);
                var manifest = require('./results/rev-manifest.json', 'utf-8');
                manifest['images/dummy.jpg'].should.be.equal('images/dummy-7051c65f.jpg');
                manifest['styles/styles.css'].should.be.equal('styles/styles-6a09860b.css');
                done();
            });
    });

});

