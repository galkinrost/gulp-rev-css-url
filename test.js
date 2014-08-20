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
                var css = fs.readFileSync('./results/styles/styles-5f3db2f0.css', 'utf-8'),
                    js = fs.readFileSync('./results/scripts/script-57cb6b72.js', 'utf-8'),
                    manifest = require('./results/rev-manifest.json', 'utf-8');

                // check files' content
                expect(css).to.equal(expectedCSS);
                expect(js).to.equal(expectedJs);

                // check manifest
                expect(manifest).to.deep.equal(expectedManifest);

                done();
            });
    });

});

