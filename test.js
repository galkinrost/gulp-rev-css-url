var rev = require('gulp-rev');
var fs = require('fs');
var gulp = require('gulp');
var fse = require('fs-extra');
var override = require('./index');
var expect = require('chai').expect;

describe('gulp-rev-css-url', function () {
    beforeEach(function (done) {
        fse.remove('./results', done);
    })

    it('Should override urls in css and js', function (done) {
        var expectedCSS = fs.readFileSync('./expected/styles.css', 'utf-8'),
            expectedJs = fs.readFileSync('./expected/script.js', 'utf-8'),
            expectedManifest = require('./expected/rev-manifest.json', 'utf-8');
        gulp.src('./fixtures/**/*')
            .pipe(rev())
            .pipe(override())
            .pipe(gulp.dest('./results/'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./results/'))
            .on('end', function () {
                // load results
                var css = fs.readFileSync('./results/styles/styles-ab9d8ca7.css', 'utf-8'),
                    js = fs.readFileSync('./results/scripts/script-933cb2a0.js', 'utf-8'),
                    manifest = require('./results/rev-manifest.json', 'utf-8');

                // check files' content
                expect(css).to.equal(expectedCSS);
                expect(js).to.equal(expectedJs);

                // check manifest
                expect(manifest).to.deep.equal(expectedManifest);

                done();
            });
    });

    it('Should not replace application/json with application.js', function(done) {
        gulp.src('./fixtures/scripts/application.js')
            .pipe(rev())
            .pipe(override())
            .pipe(gulp.dest('./results/'))
            .on('end', function () {
                var js = fs.readFileSync(
                    './results/application-5c2dec97.js',
                    'utf-8');
                expect(js).to.contain('application/json');
                done();
            });
    });

});

