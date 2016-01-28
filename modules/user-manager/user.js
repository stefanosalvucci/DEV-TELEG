'use strict';

var database = require('../database').db;
//var speaker = require('../speaker');

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


User.prototype.update = function (update) {
    return this.collection.updateOne({telegramId: this.telegramId}, {$set: update});
};

User.prototype.setLives = function(msg,telegramBot) {
    db.collection('users').find({telegramId: msg.from.id}).limit(1).next().then(function(user){
          db.collection('users').updateOne({telegramId: user.telegramId}, {$set: {lives: user.lives+1}});
          this.telegramBot.sendMessage(msg.chat.id, "Grazie per aver aggiunto un'amico! Hai ottenuto una vita!");
    });
}

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
    return this.collection.find({telegramId: this.telegramId}).limit(1).next().then(function (user) {
        return Promise.resolve(user);
    });
};

/**
 * Forget everything about this user
 *
 * @returns {Promise}
 */
User.prototype.forget = function () {
    console.log("eccomi");
    console.log(this.collection);
    return this.collection.updateOne({telegramId: this.telegramId}, {$set: {hasAccepted: false}});
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
    lives: 3,
    hasAccepted: false
  });
};

module.exports = User;
