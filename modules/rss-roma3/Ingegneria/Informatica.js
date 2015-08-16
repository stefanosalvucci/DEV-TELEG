var RSS = require('../RSS');
var database = require('../../database');

var Informatica = function () {};

Informatica.prototype.updateDb = function () {
    var url = 'http://informatica.ing.uniroma3.it/feed/';

    RSS.fetch(url, function (err, rssObj) {
        if(err) throw err;

        var updates = rssObj['rss']['channel'][0]['item'];
        var avvisi = [];
        for(var i = 0; i < updates.length; i++){
            if(updates[i]['category'][0] === 'Avvisi') {
                avvisi.push({
                    facolta: 'Dipartimento di Ingegneria',
                    corsoLaurea: 'Informatica',
                    corso: 'all',
                    docente: 'all',
                    testo: updates[i]['description'][0],
                    titolo: updates[i]['title'][0],
                    url: updates[i]['link'][0]
                });
            }
        }
        database.updateNews(avvisi);
    });
};

module.exports = new Informatica();