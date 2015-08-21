var xml2js = require('xml2js');
var http = require('http');

var RSS = function () {};
/**
 * @deprecated use RSS.get(url)
 * @param url
 * @param cb
 */
RSS.prototype.fetch = function (url, cb) {
    var xml = '';
    var parser = new xml2js.Parser();

    parser.addListener('end', function (result) {
        cb(null, result);
    });
    parser.addListener('error', function (err) {
        cb(new Error(err));
    });

    http.get(url, function (res) {
        res.on('data', function (chunk) {
            xml += chunk;
        })
            .on('end', function () {
                parser.parseString(xml);
            });
    })
        .on('error', function (err) {
            cb(new Error(err));
        });
};

/**
 *
 * @param url
 * @returns {Promise}
 */
RSS.prototype.get = function (url) {
    return new Promise(function (resolve, reject) {
        var xml = '';
        var parser = new xml2js.Parser();

        parser.addListener('end', function (result) {
            resolve(result);
        });
        parser.addListener('error', function (err) {
            reject(err);
        });

        http.get(url, function (res) {
            res.on('data', function (chunk) {
                xml += chunk;
            })
                .on('end', function () {
                    parser.parseString(xml);
                });
        })
            .on('error', function (err) {
                reject(err);
            });
    });
};

module.exports = new RSS();