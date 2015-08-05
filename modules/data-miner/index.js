var schema = require('../../schemas.js');
var http = require('http');
var xml2js = require('xml2js');
var mongo = require('mongodb');
var config = require('./config.json');

var dataMiner = function () {
};

/**
 * Get the RSS News Feed from Engineer Website and update DB if not exist
 * @constructor
 */
dataMiner.prototype.IngLastAlert = function () {
    var url = 'http://www.ingegneria.uniroma3.it/?feed=rss2';
    var parser = new xml2js.Parser();
    var xml = '';
    var feed = [];
    var req = http.get(url, function (res) {
        res.on('data', function (chunk) {
            xml += chunk;
        });

        res.on('end', function () {
            parser.parseString(xml);
        });
    });
    req.on('error', function (err) {
        console.log(err);
    });

    parser.addListener('end', function(result){

        var res = result['rss']['channel']['0']['item'];
        var dburl = 'mongodb://'+ config.db_url +':'+ config.db_port + '/' + config.db_name;

        mongo.connect(dburl, function (err, db) {
            if(err) throw err;

            var alerts = db.collection('alerts');

            var avviso = {};
            avviso.corso = 'all';
            avviso.corsoLaurea = 'all';
            avviso.docente = 'all';
            avviso.facolta = 'Ingegneria';
            avviso.titolo = res[0].title[0];
            avviso.testo = res[0].description[0];
            avviso.url = res[0].link[0];

            if(alerts.find({titolo:avviso.titolo}).count() == 0) {
                alerts.insert(avviso, function (err, docs) {
                    if (err) throw err;
                    console.log('Written in DB: ' + docs);
                    db.close();
                });
            } else db.close();

        });
    });

};

module.exports = new dataMiner();