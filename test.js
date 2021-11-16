var rev = require('gulp-rev');
var fs = require('fs');
var gulp = require('gulp');
var fse = require('fs-extra');
var override = require('./index');
var expect = require('chai').expect;
var through = require('through2');

describe('gulp-rev-css-url', function () {
    beforeEach(function (done) {
        fse.remove('./results', done);
    })

    it('Should override urls in css', function (done) {
        var expectedCSS = fs.readFileSync('./expected/styles.css', 'utf-8'),
            expectedCSS2 = fs.readFileSync('./expected/second.css', 'utf-8'),
            expectedFunnyURLs = fs.readFileSync('./expected/funny_urls.css', 'utf-8'),
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
                // check manifest
                var manifest = require('./results/rev-manifest.json', 'utf-8');
                expect(manifest).to.deep.equal(expectedManifest);

                // load results
                var css = fs.readFileSync('./results/styles/styles-522f601534.css', 'utf-8'),
                    css2 = fs.readFileSync('./results/styles/second-0d331ec6b6.css', 'utf-8'),
                    funnyURLs = fs.readFileSync('./results/styles/funny_urls-1f25c64e93.css', 'utf-8'),
                    font1 = fs.readFileSync('./results/fonts/montserrat-light-webfont-b2f7c06e09.woff', 'utf-8'),
                    font2 = fs.readFileSync('./results/fonts/montserrat-light-webfont-86efde6016.woff2', 'utf-8');

                // check files' content
                expect(css).to.equal(expectedCSS);
                expect(css2).to.equal(expectedCSS2);
                expect(funnyURLs).to.equal(expectedFunnyURLs);
                expect(expectedFont1).to.equal(font1);
                expect(expectedFont2).to.equal(font2);

                done();
            });
    });

    it('Should not reorder the pipeline', function (done) {
        var outputOrder = [];
        gulp.src(['./fixtures/styles/styles.css', './fixtures/styles/second.css'])
            .pipe(rev())
            .pipe(override())
            .pipe(through.obj(
                function (file, enc, cb) {
                    outputOrder.push(file.revOrigPath.replace(file.revOrigBase, ''));
                    cb(null, file);
                },
                function (cb) {
                    expect(outputOrder).to.deep.equal(['styles.css', 'second.css']);
                    done();
                }
            ));
    });

});

