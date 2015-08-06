var RSS = require('../RSS');
var database = require('../../bot-app-controller/database');

var Elettronica = function () {};

Elettronica.prototype.updateDb = function () {
    var url = 'http://ccs.ele.uniroma3.it/rss2.php';

    RSS.fetch(url, function (err, rssObj) {
        if(err) throw err;

        var updates = rssObj['rss']['channel'][0]['item'];
        var avvisi = [];
        for(var i = 0; i < updates.length; i++){
            avvisi.push({
                facolta: 'Dipartimento di Ingegneria',
                corsoLaurea: 'Elettronica',
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

module.exports = new Elettronica();