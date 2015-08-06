var xml2js = require('xml2js');
var util = require('util');
var http = require('http');
var database = require('../bot-app-controller/database');

var ORARI_COLLECTION = 'orari';
var AULE_COLLECTION = 'aule';

var OrariRomaTre = function () {
};

/**
 * Update the local database with data fetched from orari.uniroma3.it/ing/esporta.php
 */
OrariRomaTre.prototype.updateDb = function () {
    fetchOrari(new Date(), new Date(Date.now() + 86400000), function (err, object) {
        if (err) throw err;
        database.getDbConnection(function (db) {
            var facolta = object['facolta'];
            updateAule(facolta, db.collection(AULE_COLLECTION));
            updateOrari(facolta, db.collection(ORARI_COLLECTION));
            console.log('Db Updated');
        });
    });
};

var fetchOrari = function (fromDate, toDate, cb) {
    var output = "";
    var parser = new xml2js.Parser();
    parser.addListener('end', function (result) {
        cb(null, result);
    });
    parser.addListener('error', function (e) {
        cb(new Error(e));
    });

    var url = util.format(
        "http://orari.uniroma3.it/ing/esporta.php?from_Month=%d&from_Day=%d&from_Year=%d" +
        "&to_Month=%d&to_Day=%d&to_Year=%d&export_type=xml&save_entry=Esporta+calendario"
        , fromDate.getMonth() + 1, fromDate.getDate(), fromDate.getFullYear()
        , toDate.getMonth() + 1, toDate.getDate(), toDate.getFullYear()
    );
    http.get(url, function (res) {
        res.on('data', function (chunk) {
            output += chunk;
        }).on('end', function () {
            parser.parseString(output);
        });
    })  .on('error', function (e) {
        cb(new Error(e));
    });
};

function updateOrari(facolta, collection) {
    collection.remove({});

    var lezioni = facolta['corsoLaurea'];
    for (var i = 0; i < lezioni.length; i++) {
        var lezione = lezioni[i];
        var insegnamenti = lezione['insegnamento'];
        var corsoLaurea = lezione['denominazione'][0];

        for (var j = 0; j < insegnamenti.length; j++) {
            var insegnamento = insegnamenti[j];
            var denominazione = insegnamento['denominazione'][0];
            var periodoAnnoAccademico = insegnamento['periodoAnnoAccademico'];
            var orari = periodoAnnoAccademico[0]['didattica'][0]['orari'];

            for (var k = 0; k < orari.length; k++) {
                var orario = orari[k];
                var dettagli = orario['denominazione'][0];
                var eventoFormativo = orario['eventoFormativo'][0];
                var docente = eventoFormativo['docente'][0];
                var aula = eventoFormativo['aula'][0];
                var giorno = eventoFormativo['giorno'][0];
                var orarioInizio = eventoFormativo['orarioInizio'][0];
                var orarioFine = eventoFormativo['orarioFine'][0];
                collection.insert({
                    facolta: 'Ingegneria',
                    corsoLaurea: corsoLaurea,
                    denominazione: denominazione,
                    dettagli: dettagli,
                    docente: docente,
                    aula: aula,
                    giorno: giorno,
                    orarioInizio: orarioInizio,
                    orarioFine: orarioFine,
                    dateInizio: new Date(giorno + ' ' + orarioInizio),
                    dateFine: new Date(giorno + ' ' + orarioFine)
                });
            }
        }
    }
}

function updateAule(facolta, collection) {
    collection.remove({});

    var listaAule = facolta['listaAuleAsservite'][0]; // Array associativi: aula + capacita
    var aule = listaAule['aula'];
    var capacitas = listaAule['capacita'];
    for (var i = 0; i < aule.length; i++) {
        var aula = aule[i];
        var capacita = capacitas[i];
        collection.insert({
            nome: aula,
            capacita: capacita
        });
    }
}

OrariRomaTre.prototype.getAuleLibere = function () { // TODO non funziona nulla
    database.getDbConnection(function (db) {
        var collection = db.collection(ORARI_COLLECTION);
        var aulePiene = collection.find({
            dateInizio: {$lte: new Date()},
            dateFine: {$gte: new Date()}
        }).map(function (item) {
            return item.aula;
        });
        console.log(aulePiene);
    });

};

module.exports = new OrariRomaTre();

// TODO these lines are only for test purpose! Run this script and not bin/www for development
//module.exports.updateDb();
module.exports.getAuleLibere();
