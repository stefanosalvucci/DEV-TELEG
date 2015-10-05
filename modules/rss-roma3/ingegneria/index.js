var Facolta = require('./facolta');
var Informatica = require('./informatica');
var Elettronica = require('./elettronica');

var Ingegneria = function () {};
/**
 *  Aggiorna le notizie di tutti i CdS
 */
Ingegneria.prototype.updateDb = function () {
    Facolta.updateDb();
    Informatica.updateDb();
    Elettronica.updateDb();
    // TODO scraping dei dati su Civile e Meccanica (Non presenti rss)
};

module.exports = new Ingegneria();