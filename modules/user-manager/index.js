/**
 * This module manages the users
 * @module
 */

var database = require('../database').db;
var dipartimenti = require('../dipartimenti');
var speaker = require('../speaker');

speaker.addQuestion('dipartimento').ask(function (telegramId, telegramBot, question) {
    var message = "Di quale dipartimento fai parte?";
    for (var i = 1; i < dipartimenti.length; i++) {
        message += '\n' + i + ') ' + dipartimenti[i].name;
    }
    telegramBot.sendMessage(telegramId, message);
}).response(function (msg, telegramBot, question) {

    var dipartimentoUtente = parseInt(msg.text);
    if (dipartimentoUtente) {
        if (dipartimentoUtente > dipartimenti.length - 1 || dipartimentoUtente < 1)
            question.reject(new Error('Questo numero non è un dipartimento valido.'));
        question.resolve(dipartimentoUtente);
    } else {
        question.reject(new Error('Ho bisogno del numero del Dipartimento per capire cosa intendi.'))
    }
});

/**
 * Create or get a new User.
 * @param telegramId
 * @param telegramBot
 * @constructor
 */
var User = function (telegramId, telegramBot) {
    this.telegramBot = telegramBot;
    this.telegramId = telegramId;
    this.collection = database.collection('users');
};


User.prototype.getDipartimento = function () {
    var that = this;
    return this.getUser().then(function (user) {
        if (!user['dipartimentoId']) {
            return speaker.ask('dipartimento', that.telegramId, that.telegramBot).then(function (dipartimentoId) {
                return that.update({dipartimentoId: dipartimentoId}).then(function () {
                    return Promise.resolve(dipartimentoId);
                });
            });
        }
        return Promise.resolve(user.dipartimentoId);
    });
};

User.prototype.update = function (update) {
    return this.collection.updateOne({telegramId: this.telegramId}, {$set: update});
};

/**
 * Access to Database and return the User Object if found else null
 *
 * @param {number} id of the user
 * @returns {Promise}
 */
/*User.prototype.getUserById = function (id) {
 return this.collection.findOne({_id: id});
 };*/

/**
 * Access to Database and return the User Object or create it
 *
 * @returns {Promise}
 */
User.prototype.getUser = function () {
    var collection = this.collection;
    var telegramId = this.telegramId;
    return collection.find({telegramId: telegramId}).limit(1).next().then(function (user) {
        if (user == null) {
            return collection.insertOne({
                telegramId: telegramId
            });
        }
        return Promise.resolve(user);
    });
};

/**
 * Forget everything about this user
 *
 * @returns {Promise}
 */
User.prototype.forget = function () {
    return this.collection.removeOne({telegramId: this.telegramId});
};

/**
 * This function searches in all users and returns only the items that match the query
 *
 * @param {object} query The cursor query object.
 * @returns {Cursor}
 */
/*User.prototype.getUserList = function (query) {
 return this.collection.find(query);
 };*/

/**
 *  Add new user in Database
 *
 * @param {object} user Object User
 * @returns {Promise}
 */
/*User.prototype.newUser = function (user) {
 return this.collection.insertOne(user);
 };*/

module.exports = {
    User: User
};
