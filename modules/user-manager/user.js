'use strict';

var database = require('../database').db;
var speaker = require('../speaker');

/**
 * Create or get a new User.
 * @param telegramId
 * @param telegramBot
 * @constructor
 */
var User = function (telegramId, telegramBot, firstName, lastName, username) {
    this.telegramBot = telegramBot;
    this.telegramId = telegramId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.collection = database.collection('users');
};

/**
 * Get the user dipartimento. If it's undefined ask the user for it.
 * @returns {Promise}
 */
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
User.prototype.addToDb = function() {
  return this.collection.insertOne({
    telegramId: this.telegramId,
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    lives: 3
  });
};

module.exports = User;