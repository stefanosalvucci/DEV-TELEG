/**
 * This Module take the datas from the online sources of the university, courses and teachers.
 * Serve the data in JSON via API.
 * @module
 */

var Scienze = require('./Scienze/index');

var DataMiner = function () {
};

DataMiner.prototype.updateNews = function () {
    Scienze.updateNews();
};