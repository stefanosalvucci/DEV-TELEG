var xml2js = require('xml2js');
var util = require('util');
var http = require('http');
var db = require('../database').db;

var ORARI_COLLECTION = 'orari';
var AULE_COLLECTION = 'aule';

var todayDate = new Date(2015, 5, 16, 11, 5);

var OrariRomaTre = function () {
};

/**
 * Update the local database with data fetched from orari.uniroma3.it/$$$/esporta.php
 */
OrariRomaTre.prototype.updateDb = function () {
    return new Promise(function (resolve, reject) {
        fetchOrari('ing', todayDate, new Date(todayDate.getTime() + 86400000)).then(function (object) {
            var facolta = object['facolta'];
            Promise.all([updateAule(facolta), updateOrari(facolta)]).then(function (values) {
                console.log('Db Updated');
                resolve(values);
            }).catch(reject);
        }).catch(reject);
    });
};

/**
 *
 * @param dipartimento {string}
 * @param fromDate {Date}
 * @param toDate {Date}
 * @return {Promise}
 */
var fetchOrari = function (dipartimento, fromDate, toDate) {
    return new Promise(function (resolve, reject) {
        var output = "";
        var parser = new xml2js.Parser();
        parser.addListener('end', function (result) {
            resolve(result);
        });
        parser.addListener('error', reject);

        var url = util.format(
            "http://orari.uniroma3.it/%s/esporta.php?from_Month=%d&from_Day=%d&from_Year=%d" +
            "&to_Month=%d&to_Day=%d&to_Year=%d&export_type=xml&save_entry=Esporta+calendario", dipartimento
            , fromDate.getMonth() + 1, fromDate.getDate(), fromDate.getFullYear()
            , toDate.getMonth() + 1, toDate.getDate(), toDate.getFullYear()
        );
        http.get(url, function (res) {
            res.on('data', function (chunk) {
                output += chunk;
            }).on('end', function () {
                console.log("HTTP done: " + url);
                parser.parseString(output);
            });
        }).on('error', reject);
    });
};

/**
 * @param {object} facolta
 * @return {Promise}
 */
function updateOrari(facolta) {
    return new Promise(function (resolve, reject) {

        db.collection(ORARI_COLLECTION).deleteMany({}).then(function () {
            var lezioni = facolta['corsoLaurea'];
            var promises = [];
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
                        promises.push(
                            db.collection(ORARI_COLLECTION)
                                .insertOne({
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
                                }));
                    }
                }
            }
            Promise.all(promises).then(function (values) {
                resolve(values)
            }).catch(reject);
        }).catch(reject);
    });
}

/**
 * @param {object} facolta
 * @return {Promise}
 */
function updateAule(facolta) {
    return new Promise(function (resolve, reject) {
        db.collection(AULE_COLLECTION).deleteMany({}).then(function () {
            var promises = [];
            var listaAule = facolta['listaAuleAsservite'][0]; // Array associativi: aula + capacita
            var aule = listaAule['aula'];
            var capacitas = listaAule['capacita'];
            for (var i = 0; i < aule.length; i++) {
                var aula = aule[i];
                var capacita = capacitas[i];
                promises.push(db.collection(AULE_COLLECTION).insertOne({
                    nome: aula,
                    capacita: capacita
                }));
            }
            Promise.all(promises).then(function (values) {
                resolve(values)
            }).catch(reject);
        }).catch(reject);
    });
}

/**
 * @return {Promise}
 */
OrariRomaTre.prototype.getAuleLibere = function () {
    return new Promise(function (resolve, reject) {
        var auleObj = {};
        var auleArr = [];
        db.collection(ORARI_COLLECTION).find({
            dateFine: {$gte: todayDate}
        }, {
            _id: 0,
            aula: 1,
            dateInizio: 1,
            dateFine: 1
        }).forEach(
            function (item) {
                if (item.dateInizio < todayDate && item.dateFine > todayDate) {
                    auleObj[item.aula] = -1
                } else {
                    if (typeof auleObj[item.aula] === 'undefined') auleObj[item.aula] = item.dateInizio;
                    else if (auleObj[item.aula] > item.dateInizio && auleObj[item.aula] != -1) auleObj[item.aula] = item.dateInizio;
                }
            },
            function (err) {
                if (err) return reject(err);
                for (var aula in auleObj)
                    if (auleObj[aula] != -1) auleArr.push({aula: aula, date: auleObj[aula]});
                auleArr.sort(function (item1, item2) {
                    return item2.date.getTime() - item1.date.getTime();
                });
                return resolve(auleArr);
            });
    });
};

module.exports = new OrariRomaTre();

module.exports.updateDb();
/*module.exports.getAuleLibere(function (err, a) {
 console.log(a);
 });*/
