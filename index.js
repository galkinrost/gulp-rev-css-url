var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

module.exports = function override() {
    var allowedPathRegExp = /\.(css|js)$/;

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
        f.forEach(function (_f) {
            if ((allowedPathRegExp.test(_f.file.revOrigPath) ) && _f.file.contents) {
                var contents = _f.file.contents.toString();
                f.forEach(function (__f) {
                    var origPath = __f.origPath.replace(new RegExp('\\' + path.sep, 'g'), '/').replace(/\./g, '\\.');
                    var hashedPath = __f.hashedPath.replace(new RegExp('\\' + path.sep, 'g'), '/');
                    contents = contents.replace(
                        new RegExp(origPath, 'g'),
                        hashedPath);
                });

                try {
                    _f.file.contents = new Buffer(contents);
                } catch (err) {
                    self.emit('error', new gutil.PluginError('gulp-rev-css-url', err));
                }
            }
            self.push(_f.file);
        });
        cb();
    });
};
