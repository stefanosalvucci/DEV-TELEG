var xml2js = require('xml2js');
var http = require('http');

var RSS = function () {
};
/**
 * Get the news and update the DataBase
 * @param {String} url
 * @param {Number} facolta
 * @param {Number} corsoLaurea
 * @param {Number} corso
 * @param {Number} docente
 * @return {Promise}
 */
RSS.prototype.fetchNews = function (url, facolta, corsoLaurea, corso, docente) {
    get(url).then(function (rssObj) {
        var updates = rssObj['rss']['channel'][0]['item'];
        var avvisi = [];

        for (var i = 0; i < updates.length; i++) {
            avvisi.push({
                facolta: facolta,
                corsoLaurea: corsoLaurea,
                corso: corso,
                docente: docente,
                testo: updates[i]['description'][0],
                titolo: updates[i]['title'][0],
                url: updates[i]['link'][0],
                sent: false
            });
            console.log('[NEWS] Updated: ' + updates[i]['title'][0]);
        }
        return database.updateNews(avvisi);
    }, function (error) {
        throw  error;
    });
};

/**
 * Get the news from RSS Channel
 * @param url
 * @returns {Promise}
 */
function get(url) {
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
            }).on('end', function () {
                parser.parseString(xml);
            });
        }).on('error', function (err) {
            reject(err);
        });
    });
}

module.exports = new RSS();