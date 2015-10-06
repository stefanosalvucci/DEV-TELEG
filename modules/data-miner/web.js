var http = require('http');

var Web = function () {
};

/**
 * Returns the source of the web page passed as @param
 * @param {String} url
 * @returns {Promise}
 */
Web.prototype.getHTML = function (url) {
    var html = '';
    return new Promise(function (resolve, reject) {
        http.get(url, function (res) {
            res.on('data', function (chunk) {
                html += chunk
            })
                .on('end', function () {
                    resolve(html)
                })
        })
            .on('error', function (err) {
                reject(err)
            })
    })
};

module.exports = new Web();