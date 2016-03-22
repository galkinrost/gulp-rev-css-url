var through = require('through2');
var crypto = require('crypto');
var gutil = require('gulp-util');
var path = require('path');

module.exports = function override() {
    var allowedPathRegExp = /\.css$/;

    function md5(str) {
        return crypto.createHash('md5').update(str, 'utf8').digest('hex');
    }

    function relPath(base, filePath) {
        if (filePath.indexOf(base) !== 0) {
            return filePath;
        }
        var newPath = filePath.substr(base.length);
        if (newPath[0] === path.sep) {
            return newPath.substr(1);
        } else {
            return newPath;
        }
    }

    var f = [];

    return through.obj(function (file, enc, cb) {
        var firstFile = null;

        if (file.path && file.revOrigPath) {
            firstFile = firstFile || file;
            var _relPath = relPath(path.resolve(firstFile.revOrigBase), file.revOrigPath);

            f.push({
                origPath: _relPath,
                hashedPath: relPath(path.resolve(firstFile.base), file.path),
                file: file
            });
        }
        cb();
    }, function (cb) {
        var self = this;

        // sort by filename length to not replace the common part(s) of several filenames
        var longestFirst = f.slice().sort(function (a, b) {
            if(a.origPath.length > b.origPath.length) return -1;
            if(a.origPath.length < b.origPath.length) return 1;
            return 0;
        });

        f.forEach(function (_f) {
            var file = _f.file;

            if ((allowedPathRegExp.test(file.revOrigPath) ) && file.contents) {
              console.log(file.revOrigPath);
                var contents = file.contents.toString();
                longestFirst.forEach(function (__f) {
                    var origPath = __f.origPath.replace(new RegExp('\\' + path.sep, 'g'), '/').replace(/\./g, '\\.');
                    var hashedPath = __f.hashedPath.replace(new RegExp('\\' + path.sep, 'g'), '/');
                    if(file.revOrigPath == '/Users/Luhn/Code/salesman/static/css/rezkutablet.com.css') {
                      console.log(origPath);
                      console.log(hashedPath);
                    }
                    contents = contents.replace(
                        new RegExp(origPath, 'g'),
                        hashedPath);
                });

                file.contents = new Buffer(contents);

                // update file's hash as it does in gulp-rev plugin
                var hash = file.revHash = md5(contents).slice(0, 10);
                var ext = path.extname(file.path);
                var filename = path.basename(file.revOrigPath, ext) + '-' + hash + ext;
                file.path = path.join(path.dirname(file.path), filename);

            }
            self.push(file);
        });
        cb();
    });
};
