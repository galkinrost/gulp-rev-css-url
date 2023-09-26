var through = require('through2');
var crypto = require('crypto');
var gutil = require('gulp-util');
var path = require('path');
var urlparse = require('url').parse;

module.exports = function override() {
    var allowedPathRegExp = /\.css$/;
    var cssUrlRegExp = /url\(['"]?([^'"\)]*)['"]?\)/gi;

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
    var lookup = {};

    return through.obj(function (file, enc, cb) {
        if (file.path && file.revOrigPath) {
          f.push(file);
          lookup[file.revOrigPath] = file.path;
        }
        cb();
    }, function (cb) {
        var self = this;

        f.forEach(function (file) {
            if ((allowedPathRegExp.test(file.revOrigPath) ) && file.contents) {
                var contents = file.contents.toString();

                contents = contents.replace(cssUrlRegExp, function(m, url) {
                  parsed = urlparse(url);
                  if(parsed.host) {
                    return m;
                  }
                  var dir = path.parse(file.path).dir;
                  var _path = path.join(dir, parsed.pathname);
                  var _new = lookup[_path];
                  if(!_new) {
                    return m;  // Leave unmodified.
                  }
                  _new = path.relative(dir, _new) +
                    (parsed.search || '') +
                    (parsed.hash || '');
                  return 'url(\'' + _new + '\')';
                });
                file.contents = Buffer.from(contents);

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
