var database = require('../database').db;
var userManager = module.exports = {};

var COLLECTION = database.collection('users');

/**
 * Access to Database and return the User Object if found else null
 *
 * @param id of the user
 * @returns {Promise}
 */
userManager.getUserById = function (id) {
    return COLLECTION.findOne({_id: id});
};

/**
 * Access to Database and return the User Object if found else nulls
 *
 * @param id of Telegram user
 * @returns {Promise}
 */
userManager.getUserByTelegramId = function (id) {
    return COLLECTION.findOne({telegramId: id})
};

/**
 * This function searches in all users and returns only the items that match the filters
 *
 * @param filters array {filter_key: filter_value} i.e. { 'gender' : 'male', 'year' : '1'}
 * @returns {Promise}
 */
userManager.getUserList = function (filters) {
    return collection.find(filters).toArray();
};

/**
 *  Add new user in Database
 *
 * @param user Object User
 * @returns {Promise}
 */
userManager.newUser = function (user) {
    return COLLECTION.insertOne(user);
};