var xml2js = require('xml2js');
var http = require('http');

var RSS = function () {};

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

module.exports = new RSS();