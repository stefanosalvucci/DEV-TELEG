/**
 * Dipartimento di Scienze - Site Scraper
 */
var Web = require('../web');
var cheerio = require('cheerio');
var news = require('../../../schemas').avviso;
var database = require('../../database');

var URL = 'http://www.scienze.uniroma3.it/news/categories/12';
var BASE_URL = 'http://www.scienze.uniroma3.it';

var Scienze = function () {
};

Scienze.prototype.updateNews = function () {
    Web.getHTML(URL).then(PromiseScraper);
};

function PromiseScraper(html) {
    var avvisi = [];
    var promises = [];
    return new Promise(function (resolve, reject) {
        var $ = cheerio.load(html);
        $('td.title').each(function () {
            promises.push(new Promise(function (resolve, reject) {
                resolve(avvisi.push({
                    facolta: 8,
                    corsoLaurea: 0,
                    corso: 0,
                    docente: 0,
                    testo: '',
                    titolo: $(this).text(),
                    url: BASE_URL + $(this).children().attr('href'),
                    sent: false
                }))
            }))
        });
        resolve(Promise.all(promises).then(database.updateNews(avvisi)))
    });

}

module.exports = new Scienze();