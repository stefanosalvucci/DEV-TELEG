var RSS = require('../rss');

var Facolta = function () {};
/**
 * Aggiorna gli avvisi di facoltà
 */
Facolta.prototype.updateDb = function () {
    RSS.fetchNews('http://www.ingegneria.uniroma3.it/?feed=rss2', 5, 0, 0, 0).catch(function (error) {
        console.error(error);
    });
};

module.exports = new Facolta();