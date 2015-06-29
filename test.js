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
            expectedFont1 = fs.readFileSync('./expected/montserrat-light-webfont.woff', 'utf-8'),
            expectedFont2 = fs.readFileSync('./expected/montserrat-light-webfont.woff2', 'utf-8'),
            expectedManifest = require('./expected/rev-manifest.json', 'utf-8');
        gulp.src('./fixtures/**/*')
            .pipe(rev())
            .pipe(override())
            .pipe(gulp.dest('./results/'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./results/'))
            .on('end', function () {
                // load results
                var css = fs.readFileSync('./results/styles/styles-d329971534.css', 'utf-8'),
                    js = fs.readFileSync('./results/scripts/script-382f58fea6.js', 'utf-8'),
                    font1 = fs.readFileSync('./results/fonts/montserrat-light-webfont-b2f7c06e09.woff', 'utf-8'),
                    font2 = fs.readFileSync('./results/fonts/montserrat-light-webfont-86efde6016.woff2', 'utf-8'),
                    manifest = require('./results/rev-manifest.json', 'utf-8');

                // check files' content
                expect(css).to.equal(expectedCSS);
                expect(js).to.equal(expectedJs);
                expect(expectedFont1).to.equal(font1);
                expect(expectedFont2).to.equal(font2);

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
                    './results/application-5c2dec9780.js',
                    'utf-8');
                expect(js).to.contain('application/json');
                done();
            });
    });

});

