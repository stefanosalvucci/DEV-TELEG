var RSS = require('../RSS');
var database = require('../../bot-app-controller/database');

var Facolta = function () {};
/**
 * Aggiorna gli avvisi di facoltà
 */
Facolta.prototype.updateDb = function () {
    var url = 'http://www.ingegneria.uniroma3.it/?feed=rss2';
    RSS.fetch(url, function (err, rssObj) {
        if(err) throw err;

        var updates = rssObj['rss']['channel'][0]['item'];
        var avvisi = [];

        for(var i = 0; i < updates.length; i++){
            avvisi.push({
                facolta: 'Dipartimento di Ingegneria',
                corsoLaurea: 'all',
                corso: 'all',
                docente: 'all',
                testo: updates[i]['description'][0],
                titolo: updates[i]['title'][0],
                url: updates[i]['link'][0]
            });
        }
        database.updateNews(avvisi);
    });
};

module.exports = new Facolta();