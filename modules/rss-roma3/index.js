var xml2js = require('xml2js');
var util = require('util');
var http = require('http');
var database = require('../bot-app-controller/database');

var NEWS_COLLECTION = 'news';

var RssRomaTre = function () {};

RssRomaTre.prototype.updateIngDb = function () {
    var url = 'http://www.ingegneria.uniroma3.it/?feed=rss2';
    fetchRss(url, function (err, rssObj) {
        if(err) throw err;

        var rssChannel = rssObj['rss']['channel'][0];

        database.getDbConnection(function (db) {
            updateNews(rssChannel,db.collection(NEWS_COLLECTION));
        });
    });
};


var fetchRss = function (url, cb) {
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

var updateNews = function (rss, collection) {
    var facolta = rss['title'][0];
    var updates = rss['item'];
    for(var i = 0; i < updates.length; i++){
        collection.update({titolo: updates[i]['title'][0]},{
            facolta: facolta,
            corsoLaurea: 'all',
            corso: 'all',
            docente: 'all',
            testo: updates[i]['description'][0],
            titolo: updates[i]['title'][0],
            url: updates[i]['link'][0]
        },{upsert: true});
    }

};
module.exports = new RssRomaTre();