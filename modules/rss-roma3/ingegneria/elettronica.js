var RSS = require('../rss');

var Elettronica = function () {};

Elettronica.prototype.updateDb = function () {
    RSS.fetchNews('http://ccs.ele.uniroma3.it/rss2.php', 5, 2, 0, 0).catch(function (error) {
        console.error(error);
    })
};

module.exports = new Elettronica();