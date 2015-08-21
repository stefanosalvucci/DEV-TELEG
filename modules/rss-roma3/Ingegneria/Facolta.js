var RSS = require('../RSS');
var database = require('../../database');

var Facolta = function () {};
/**
 * Aggiorna gli avvisi di facoltà
 */
Facolta.prototype.updateDb = function () {
    var url = 'http://www.ingegneria.uniroma3.it/?feed=rss2';
    RSS.get(url).then(function (rssObj) {
        var updates = rssObj['rss']['channel'][0]['item'];
        var avvisi = [];

        for(var i = 0; i < updates.length; i++){
            avvisi.push({
                facolta: 5,
                corsoLaurea: 0,
                corso: 0,
                docente: 0,
                testo: updates[i]['description'][0],
                titolo: updates[i]['title'][0],
                url: updates[i]['link'][0]
            });
        }
        database.updateNews(avvisi);
    })
        .catch(function (err) {
            throw err;
        });
};

module.exports = new Facolta();