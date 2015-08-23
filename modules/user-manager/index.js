var database = require('../database').db;

var User = function (telegramId) {
    this.telegramId = telegramId;
    this.collection = database.collection('users');
};


User.prototype.getDipartimento = function () {
    this.getUser().then(function (user) {
        if (!user.dipartimentoId) {
            // TODO Use User Middleware to get user dipartimentoId (ask for it)
        }
        return Promise.resolve(user.dipartimentoId);
    }).catch(function (err) {
        console.error(err);
    });
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
    return collection.findOne({telegramId: telegramId}).then(function (user) {
        if (user == null) {
            return collection.insertOne({
                telegramId: telegramId
            });
        }
        return Promise.resolve(user);
    });
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
    User: User,
    Middleware: null
};
