var Ingegneria = require('./ingegneria/index');

var RSSRomaTre = function () {};
/**
 * Aggiorna le notizie di tutto l'ateneo
 */
RSSRomaTre.prototype.updateDb = function () {
    Ingegneria.updateDb();
    // TODO implementare le altre facoltà
    // TODO implementare gli avvisi di Ateneo
};

module.exports = new RSSRomaTre();