var RSS = require('../rss');

var Informatica = function () {};

Informatica.prototype.updateDb = function () {
    RSS.fetchNews('http://informatica.ing.uniroma3.it/feed/', 5, 1, 0, 0);
};

module.exports = new Informatica();