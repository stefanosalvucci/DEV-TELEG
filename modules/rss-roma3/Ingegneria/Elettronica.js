var RSS = require('../RSS');
var database = require('../../database');

var Elettronica = function () {};

Elettronica.prototype.updateDb = function () {
    var url = 'http://ccs.ele.uniroma3.it/rss2.php';
    RSS.get(url).then(function (rssObj) {
        var updates = rssObj['rss']['channel'][0]['item'];
        var avvisi = [];

        for(var i = 0; i < updates.length; i++){
            avvisi.push({
                facolta: 5,
                corsoLaurea: 2,
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

module.exports = new Elettronica();